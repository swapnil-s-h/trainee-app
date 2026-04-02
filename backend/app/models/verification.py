# D:\Projects\practiceNative\backend\app\models\verification.py

import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Text, Float, Boolean, Integer,
    DateTime, Enum as SAEnum, ForeignKey, JSON,
)
from sqlalchemy.dialects.postgresql import UUID
from pgvector.sqlalchemy import Vector

from app.core.database import Base
import enum


# ── Enums (must match PostgreSQL enums exactly) ────────────────────────────

class VerificationStatusEnum(str, enum.Enum):
    PASSED = "PASSED"
    MISMATCH = "MISMATCH"
    MULTIPLE_FACES = "MULTIPLE_FACES"
    NO_FACE_DETECTED = "NO_FACE_DETECTED"
    SPOOF_DETECTED = "SPOOF_DETECTED"


class SupervisorDecisionEnum(str, enum.Enum):
    OVERRIDE_PASS = "OVERRIDE_PASS"
    CONFIRM_FAIL = "CONFIRM_FAIL"


class SnapshotTriggerEnum(str, enum.Enum):
    RANDOM_SNAPSHOT = "RANDOM_SNAPSHOT"
    LESSON_WATCH = "LESSON_WATCH"
    QUIZ_ATTEMPT = "QUIZ_ATTEMPT"


# ── Models ─────────────────────────────────────────────────────────────────

class Trainee(Base):
    __tablename__ = "trainees"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), nullable=True)
    trainee_id = Column(String(50), unique=True, nullable=False)
    name = Column(String(255), nullable=True)
    master_photo_url = Column(Text, nullable=True)

    # Matches schema.sql: public.vector(512). Pass a list of 512 floats from application code.
    face_embedding = Column(Vector(512), nullable=True)

    registered_at = Column(DateTime, default=datetime.utcnow)


class VisualVerification(Base):
    __tablename__ = "visual_verifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), nullable=True)
    trainee_id = Column(String(50), ForeignKey("trainees.trainee_id"), nullable=True)
    session_id = Column(UUID(as_uuid=True), nullable=True)  # FK to sessions table (future)
    snapshot_url = Column(Text, nullable=True)
    captured_at = Column(DateTime(timezone=False), nullable=True)
    gps_lat = Column(Float, nullable=True)
    gps_long = Column(Float, nullable=True)
    faces_detected_count = Column(Integer, nullable=True)
    liveness_score = Column(Float, nullable=True)
    is_liveness_passed = Column(Boolean, nullable=True)
    matched_confidence_score = Column(Float, nullable=True)
    verification_status = Column(
        SAEnum(VerificationStatusEnum, name="verification_status_enum", create_type=False),
        nullable=True,
    )
    is_flagged = Column(Boolean, nullable=True)
    trigger_type = Column(
        SAEnum(SnapshotTriggerEnum, name="snapshot_trigger_enum", create_type=False),
        nullable=True,
    )
    processing_time_ms = Column(Integer, nullable=True)


class VerificationReview(Base):
    __tablename__ = "verification_reviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    verification_id = Column(UUID(as_uuid=True), ForeignKey("visual_verifications.id"), nullable=True)
    reviewed_by_supervisor_id = Column(UUID(as_uuid=True), nullable=True)
    supervisor_decision = Column(
        SAEnum(SupervisorDecisionEnum, name="supervisor_decision_enum", create_type=False),
        nullable=True,
    )
    supervisor_comments = Column(Text, nullable=True)
    reviewed_at = Column(DateTime, nullable=True)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), nullable=True)
    action = Column(String(100), nullable=True)
    actor_id = Column(UUID(as_uuid=True), nullable=True)
    # Column in DB is named 'metadata' but the ORM attribute is 'meta_data'
    # because 'metadata' is reserved by SQLAlchemy's DeclarativeBase.
    meta_data = Column("metadata", JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)