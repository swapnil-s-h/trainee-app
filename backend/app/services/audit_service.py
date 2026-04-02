from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.verification import AuditLog
from app.schemas.verification import AuditLogEntry


async def write_audit_log(db: AsyncSession, entry: AuditLogEntry) -> None:
    """
    Write a single audit log entry to the audit_logs table.

    This is called after every significant action:
    - Face registration attempt
    - Snapshot verification result
    - Any flagged event

    The metadata JSONB field captures the context specific to each action.
    Convention for metadata keys per action type:

        FACE_REGISTRATION_SUCCESS:
            trainee_id, photos_received, photos_used, master_photo_url

        FACE_REGISTRATION_FAILED:
            trainee_id, photos_received, reason

        SNAPSHOT_VERIFIED:
            trainee_id, verification_id, status, confidence_score,
            liveness_score, faces_detected, gps_lat, gps_long,
            trigger_type, is_flagged

        SNAPSHOT_NO_FACE:
            trainee_id, verification_id, gps_lat, gps_long, trigger_type
    """
    log = AuditLog(
        action=entry.action,
        actor_id=entry.actor_id,
        tenant_id=entry.tenant_id,
        meta_data=entry.metadata,
        created_at=datetime.utcnow(),
    )
    db.add(log)
    # Flush so the row is written in the same transaction as the caller.
    # The caller's session commit will persist it.
    await db.flush()