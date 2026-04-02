# D:\Projects\practiceNative\backend\app\schemas\verification.py

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID
from app.models.verification import VerificationStatusEnum, SnapshotTriggerEnum


# ── Registration Schemas ───────────────────────────────────────────────────

class FaceRegistrationResponse(BaseModel):
    """Returned after successful face registration."""
    trainee_id: str
    message: str
    photos_received: int
    photos_used: int          # Photos that passed detection (contributed to embedding)
    master_photo_url: str


# ── Verification Schemas ───────────────────────────────────────────────────

class SnapshotVerificationResponse(BaseModel):
    """Returned after processing a monitoring snapshot."""
    verification_id: UUID
    trainee_id: str
    verification_status: VerificationStatusEnum
    is_flagged: bool
    matched_confidence_score: Optional[float] = None
    liveness_score: Optional[float] = None
    faces_detected_count: int
    processing_time_ms: int
    captured_at: datetime
    message: str


# ── Audit Schema ───────────────────────────────────────────────────────────

class AuditLogEntry(BaseModel):
    """Internal schema used by audit_service — not exposed as API response."""
    action: str
    actor_id: Optional[UUID] = None
    tenant_id: Optional[UUID] = None
    metadata: Optional[dict] = None