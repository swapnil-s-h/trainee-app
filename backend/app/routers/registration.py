"""
POST /register/face
===================
Accepts multiple photos from the Registration Step 2 screen.
Processes each, merges valid embeddings, stores in trainees table.
"""

import asyncio
import uuid
from datetime import datetime
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.core.database import get_db
from app.models.verification import Trainee
from app.schemas.verification import FaceRegistrationResponse, AuditLogEntry
from app.services import face_service
from app.services.audit_service import write_audit_log
from app.utils.storage import save_photo_bytes

router = APIRouter(prefix="/register", tags=["Registration"])


@router.post("/face", response_model=FaceRegistrationResponse)
async def register_face(
    trainee_id: str = Form(..., description="Employee ID of the trainee"),
    name: str = Form(None, description="Full name of the trainee (optional for now)"),
    photos: List[UploadFile] = File(..., description="Multiple angle photos from registration flow"),
    db: AsyncSession = Depends(get_db),
):
    """
    Face Registration Endpoint — called from Registration Step 2.

    Expects:
      - trainee_id (form field)
      - name (form field, optional)
      - photos[] (multiple image files, one per angle instruction)

    Process:
      1. Read all uploaded photo bytes.
      2. Run InsightFace on each photo in a thread pool (non-blocking).
      3. Merge valid embeddings into one robust vector.
      4. Save the best photo to local storage.
      5. Upsert the trainee record in the DB.
      6. Write audit log.
    """
    if not photos:
        raise HTTPException(status_code=400, detail="At least one photo is required.")
    print("Step 1: Received photos")
    # ── Step 1: Read all photo bytes ──────────────────────────────────────
    all_bytes = []
    for photo in photos:
        content = await photo.read()
        all_bytes.append(content)

    photos_received = len(all_bytes)
    print("Step 2: Starting face processing")

    # ── Step 2: Process each photo in a thread pool ───────────────────────
    # face_service functions are CPU-bound (synchronous).
    # We offload them to a thread pool to avoid blocking the async event loop.
    loop = asyncio.get_event_loop()

    results = await asyncio.gather(*[
        loop.run_in_executor(None, face_service.process_single_image, img_bytes)
        for img_bytes in all_bytes
    ])
    print("Step 3: Face processing done")

    photos_used = sum(1 for r in results if r.success)

    if photos_used == 0:
        # Log the failure before raising
        await write_audit_log(db, AuditLogEntry(
            action="FACE_REGISTRATION_FAILED",
            metadata={
                "trainee_id": trainee_id,
                "photos_received": photos_received,
                "reason": "No valid face detected in any of the submitted photos.",
                "individual_failures": [r.failure_reason for r in results],
            },
        ))
        raise HTTPException(
            status_code=422,
            detail=(
                f"Face registration failed: no valid face detected in any of the "
                f"{photos_received} submitted photos. Ensure good lighting and that "
                f"only one face is visible per photo."
            ),
        )

    # ── Step 3: Merge embeddings ──────────────────────────────────────────
    merged_embedding = await loop.run_in_executor(
        None, face_service.merge_embeddings, list(results)
    )
    print("Step 4: Merged embeddings")

    # ── Step 4: Save the best photo ───────────────────────────────────────
    best_photo_bytes = await loop.run_in_executor(
        None, face_service.select_best_photo, all_bytes, list(results)
    )
    print("Step 5: Saving photo")

    master_photo_url = await save_photo_bytes(
        best_photo_bytes, subfolder="registration"
    )

    # ── Step 5: Upsert trainee record ─────────────────────────────────────
    existing = await db.execute(
        select(Trainee).where(Trainee.trainee_id == trainee_id)
    )
    trainee = existing.scalar_one_or_none()

    embedding_list = merged_embedding.tolist()  # numpy → Python list for JSON storage

    if trainee is None:
        trainee = Trainee(
            id=uuid.uuid4(),
            tenant_id=None,            # Will be set once tenant system is integrated
            trainee_id=trainee_id,
            name=name,
            master_photo_url=master_photo_url,
            face_embedding=embedding_list,
            registered_at=datetime.utcnow(),
        )
        db.add(trainee)
    else:
        # Re-registration: overwrite the existing embedding and photo
        trainee.face_embedding = embedding_list
        trainee.master_photo_url = master_photo_url
        trainee.registered_at = datetime.utcnow()
        if name:
            trainee.name = name
        print("Step 6: Writing to DB")

    await db.flush()

    # ── Step 6: Audit log ─────────────────────────────────────────────────
    await write_audit_log(db, AuditLogEntry(
        action="FACE_REGISTRATION_SUCCESS",
        metadata={
            "trainee_id": trainee_id,
            "photos_received": photos_received,
            "photos_used": photos_used,
            "master_photo_url": master_photo_url,
            "individual_liveness_scores": [
                round(r.liveness_score, 4) for r in results
            ],
        },
    ))

    return FaceRegistrationResponse(
        trainee_id=trainee_id,
        message=f"Face registered successfully using {photos_used} of {photos_received} photos.",
        photos_received=photos_received,
        photos_used=photos_used,
        master_photo_url=master_photo_url,
    )