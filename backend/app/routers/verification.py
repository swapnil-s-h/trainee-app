"""
POST /verify/snapshot
=====================
Called by the frontend at random intervals during lesson watching or quiz taking.
Accepts a single snapshot, verifies identity, writes a full audit record.
"""
# D:\Projects\practiceNative\backend\app\routers\verification.py

import asyncio
import uuid
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models.verification import (
    Trainee, VisualVerification,
    VerificationStatusEnum, SnapshotTriggerEnum,
)
from app.schemas.verification import SnapshotVerificationResponse, AuditLogEntry
from app.services import face_service
from app.services.audit_service import write_audit_log
from app.utils.storage import save_photo_bytes

router = APIRouter(prefix="/verify", tags=["Verification"])


def _determine_status(
    result: "face_service.VerificationResult",
) -> VerificationStatusEnum:
    """
    Map a VerificationResult to the PostgreSQL enum value.

    Priority order (most severe first):
      1. No face detected
      2. Multiple faces (already blocked in process_single_image, but checked here for clarity)
      3. Spoof detected (liveness failed)
      4. Mismatch (face detected, liveness passed, but wrong person)
      5. Passed
    """
    if result.faces_detected_count == 0:
        return VerificationStatusEnum.NO_FACE_DETECTED
    if result.faces_detected_count > 1:
        return VerificationStatusEnum.MULTIPLE_FACES
    if not result.is_liveness_passed:
        return VerificationStatusEnum.SPOOF_DETECTED
    if not result.matched:
        return VerificationStatusEnum.MISMATCH
    return VerificationStatusEnum.PASSED


@router.post("/snapshot", response_model=SnapshotVerificationResponse)
async def verify_snapshot(
    trainee_id: str = Form(..., description="Employee ID of the trainee being monitored"),
    session_id: str = Form(None, description="Session/Quiz ID (UUID string, optional until sessions table is ready)"),
    trigger_type: SnapshotTriggerEnum = Form(
        SnapshotTriggerEnum.RANDOM_SNAPSHOT,
        description="What triggered this snapshot: RANDOM_SNAPSHOT, LESSON_WATCH, QUIZ_ATTEMPT",
    ),
    gps_lat: float = Form(None, description="GPS latitude at time of capture"),
    gps_long: float = Form(None, description="GPS longitude at time of capture"),
    photo: UploadFile = File(..., description="The snapshot photo from the front camera"),
    db: AsyncSession = Depends(get_db),
):
    """
    Snapshot Verification Endpoint — called by frontend during lessons/quiz.

    Process:
      1. Look up trainee's stored embedding from DB.
      2. Run face verification against the snapshot.
      3. Determine status and whether to flag.
      4. Save snapshot photo to local storage.
      5. Write VisualVerification record (full audit row).
      6. Write AuditLog entry.
      7. Return result to frontend.

    Flagging logic:
      A snapshot is flagged (is_flagged=True) for any non-PASSED status.
      Flagged snapshots require supervisor review via verification_reviews table.
    """
    import time
    start_time = time.monotonic()
    captured_at = datetime.utcnow()

    # ── Step 1: Fetch trainee's stored embedding ───────────────────────────
    result_row = await db.execute(
        select(Trainee).where(Trainee.trainee_id == trainee_id)
    )
    trainee = result_row.scalar_one_or_none()

    if trainee is None:
        raise HTTPException(
            status_code=404,
            detail=f"Trainee '{trainee_id}' not found. Face must be registered before verification.",
        )

    if trainee.face_embedding is None:
        raise HTTPException(
            status_code=422,
            detail=f"Trainee '{trainee_id}' has no registered face embedding. Complete face registration first.",
        )

    # ── Step 2: Read photo and run verification ────────────────────────────
    snapshot_bytes = await photo.read()

    loop = asyncio.get_event_loop()
    verification_result = await loop.run_in_executor(
        None,
        face_service.verify_snapshot,
        snapshot_bytes,
        trainee.face_embedding,   # sequence (list / vector); face_service normalizes to ndarray
    )

    processing_time_ms = int((time.monotonic() - start_time) * 1000)

    # ── Step 3: Determine status and flagging ─────────────────────────────
    status = _determine_status(verification_result)
    is_flagged = status != VerificationStatusEnum.PASSED

    # ── Step 4: Save snapshot photo ───────────────────────────────────────
    snapshot_url = await save_photo_bytes(snapshot_bytes, subfolder="snapshots")

    # ── Step 5: Write VisualVerification record ────────────────────────────
    verification_id = uuid.uuid4()
    session_uuid = uuid.UUID(session_id) if session_id else None

    vv = VisualVerification(
        id=verification_id,
        tenant_id=None,                   # Set once tenant system is integrated
        trainee_id=trainee_id,
        session_id=session_uuid,
        snapshot_url=snapshot_url,
        captured_at=captured_at,
        gps_lat=gps_lat,
        gps_long=gps_long,
        faces_detected_count=verification_result.faces_detected_count,
        liveness_score=verification_result.liveness_score,
        is_liveness_passed=verification_result.is_liveness_passed,
        matched_confidence_score=verification_result.confidence_score,
        verification_status=status,
        is_flagged=is_flagged,
        trigger_type=trigger_type,
        processing_time_ms=processing_time_ms,
    )
    db.add(vv)
    await db.flush()

    # ── Step 6: Write audit log ────────────────────────────────────────────
    audit_action = "SNAPSHOT_VERIFIED" if not is_flagged else f"SNAPSHOT_FLAGGED_{status.value}"

    await write_audit_log(db, AuditLogEntry(
        action=audit_action,
        metadata={
            "trainee_id": trainee_id,
            "verification_id": str(verification_id),
            "session_id": session_id,
            "status": status.value,
            "confidence_score": verification_result.confidence_score,
            "liveness_score": verification_result.liveness_score,
            "faces_detected": verification_result.faces_detected_count,
            "gps_lat": gps_lat,
            "gps_long": gps_long,
            "trigger_type": trigger_type.value,
            "is_flagged": is_flagged,
            "processing_time_ms": processing_time_ms,
            "failure_reason": verification_result.failure_reason,
            "captured_at": captured_at.isoformat(),
        },
    ))

    # ── Step 7: Return response ────────────────────────────────────────────
    message_map = {
        VerificationStatusEnum.PASSED: "Identity verified successfully.",
        VerificationStatusEnum.MISMATCH: "Face mismatch detected. Flagged for supervisor review.",
        VerificationStatusEnum.MULTIPLE_FACES: "Multiple faces detected. Flagged for supervisor review.",
        VerificationStatusEnum.NO_FACE_DETECTED: "No face detected in snapshot. Flagged for review.",
        VerificationStatusEnum.SPOOF_DETECTED: "Anti-spoofing check failed. Flagged for supervisor review.",
    }

    return SnapshotVerificationResponse(
        verification_id=verification_id,
        trainee_id=trainee_id,
        verification_status=status,
        is_flagged=is_flagged,
        matched_confidence_score=verification_result.confidence_score,
        liveness_score=verification_result.liveness_score,
        faces_detected_count=verification_result.faces_detected_count,
        processing_time_ms=processing_time_ms,
        captured_at=captured_at,
        message=message_map[status],
    )