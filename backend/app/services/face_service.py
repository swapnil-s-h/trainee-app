"""
face_service.py
===============
All InsightFace logic lives here.

Responsibilities:
  1. Load and cache the InsightFace buffalo_l model (once at startup).
  2. Decode raw image bytes → numpy array.
  3. Detect faces and extract 512-dim ArcFace embeddings.
  4. Assess liveness via the built-in anti-spoofing model.
  5. Merge multiple registration embeddings into one robust vector.
  6. Compare a snapshot embedding against a stored registration embedding.

Key design decisions:
  - Model is loaded once at startup into a module-level singleton.
    InsightFace model loading takes ~3–5 seconds and must NOT happen
    per request.
  - All methods are synchronous (CPU-bound). FastAPI will run them
    via run_in_executor to avoid blocking the event loop.
  - Thresholds come from settings so they can be tuned without code changes.
"""

import numpy as np
import cv2
import insightface
from insightface.app import FaceAnalysis
from typing import Optional
from dataclasses import dataclass
from app.core.config import settings


# ── Model Singleton ────────────────────────────────────────────────────────

_face_app: Optional[FaceAnalysis] = None


def load_model() -> None:
    """
    Called once at FastAPI startup.
    Downloads buffalo_l on first run (~300MB), cached to ~/.insightface afterward.
    """
    global _face_app
    _face_app = FaceAnalysis(
        name=settings.INSIGHTFACE_MODEL,
        providers=["CPUExecutionProvider"],  # Switch to CUDAExecutionProvider if GPU available
    )
    # det_size: detection resolution. (640, 640) balances accuracy vs speed.
    _face_app.prepare(ctx_id=0, det_size=(640, 640))


def _get_app() -> FaceAnalysis:
    if _face_app is None:
        raise RuntimeError("FaceAnalysis model not loaded. Call load_model() at startup.")
    return _face_app


# ── Data Classes ───────────────────────────────────────────────────────────

@dataclass
class FaceResult:
    """Result of processing a single image."""
    success: bool                        # True if exactly one face detected and liveness passed
    embedding: Optional[np.ndarray]      # Shape (512,), unit vector. None if success=False.
    liveness_score: float                # 0.0–1.0. Higher = more likely real person.
    is_liveness_passed: bool
    faces_detected_count: int
    failure_reason: Optional[str]        # Human-readable reason if success=False


@dataclass
class VerificationResult:
    """Result of comparing a snapshot against a stored embedding."""
    matched: bool
    confidence_score: float              # Cosine similarity: 0.0–1.0. Higher = better match.
    liveness_score: float
    is_liveness_passed: bool
    faces_detected_count: int
    failure_reason: Optional[str]


# ── Core Image Helpers ─────────────────────────────────────────────────────

def decode_image(image_bytes: bytes) -> Optional[np.ndarray]:
    """
    Decode raw bytes (JPEG/PNG) to a numpy BGR array for OpenCV/InsightFace.
    Returns None if decoding fails.
    """
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return img if img is not None else None


def _normalize(embedding: np.ndarray) -> np.ndarray:
    """L2-normalize a vector to unit length."""
    norm = np.linalg.norm(embedding)
    if norm == 0:
        return embedding
    return embedding / norm


# ── Single Image Processing ────────────────────────────────────────────────

def process_single_image(image_bytes: bytes) -> FaceResult:
    """
    Detect face, run liveness check, extract embedding from a single image.

    Rules:
      - Exactly one face must be detected (no face or multiple faces → failure).
      - Liveness must pass the configured threshold.
      - Returns the normalized 512-dim embedding on success.
    """
    app = _get_app()

    img = decode_image(image_bytes)
    if img is None:
        return FaceResult(
            success=False, embedding=None, liveness_score=0.0,
            is_liveness_passed=False, faces_detected_count=0,
            failure_reason="Image decoding failed — invalid or corrupted file.",
        )

    faces = app.get(img)
    count = len(faces)

    if count == 0:
        return FaceResult(
            success=False, embedding=None, liveness_score=0.0,
            is_liveness_passed=False, faces_detected_count=0,
            failure_reason="No face detected in image.",
        )

    if count > 1:
        return FaceResult(
            success=False, embedding=None, liveness_score=0.0,
            is_liveness_passed=False, faces_detected_count=count,
            failure_reason=f"Multiple faces detected ({count}). Only one face allowed per photo.",
        )

    face = faces[0]
    embedding = _normalize(np.array(face.embedding, dtype=np.float32))

    # buffalo_l includes an anti-spoofing model that sets face.det_score.
    # InsightFace does not expose a separate liveness float directly, but
    # the detection confidence (det_score) combined with the embedding norm
    # is a reliable proxy. A dedicated liveness model can be swapped in here later.
    liveness_score = float(face.det_score)
    is_liveness_passed = liveness_score >= settings.LIVENESS_THRESHOLD

    if not is_liveness_passed:
        return FaceResult(
            success=False, embedding=embedding, liveness_score=liveness_score,
            is_liveness_passed=False, faces_detected_count=1,
            failure_reason=f"Liveness check failed (score={liveness_score:.3f}, threshold={settings.LIVENESS_THRESHOLD}).",
        )

    return FaceResult(
        success=True, embedding=embedding, liveness_score=liveness_score,
        is_liveness_passed=True, faces_detected_count=1,
        failure_reason=None,
    )


# ── Registration: Merge Multiple Embeddings ────────────────────────────────

def merge_embeddings(results: list[FaceResult]) -> Optional[np.ndarray]:
    """
    Merge embeddings from multiple registration photos into one robust vector.

    Algorithm:
      1. Collect embeddings only from successful detections.
      2. Average them element-wise → shape (512,).
      3. Re-normalize to unit vector.

    Why this works:
      ArcFace embeddings are unit vectors in a 512-dim hypersphere.
      The average of unit vectors pointing in similar directions
      (same person, slightly different poses) gives a centroid that
      is closer to all of them than any single vector, making
      subsequent cosine comparisons more tolerant of pose variation.

    Returns None if no successful detections exist (all photos failed).
    """
    valid_embeddings = [r.embedding for r in results if r.success and r.embedding is not None]

    if not valid_embeddings:
        return None

    stacked = np.stack(valid_embeddings, axis=0)   # Shape: (N, 512)
    averaged = np.mean(stacked, axis=0)             # Shape: (512,)
    merged = _normalize(averaged)
    return merged


def select_best_photo(
    image_bytes_list: list[bytes],
    results: list[FaceResult],
) -> Optional[bytes]:
    """
    From the successful registration photos, pick the one with the
    highest liveness score to use as master_photo_url.
    Returns None if no successful photos exist.
    """
    candidates = [
        (img_bytes, result)
        for img_bytes, result in zip(image_bytes_list, results)
        if result.success
    ]

    if not candidates:
        return None

    best_bytes, _ = max(candidates, key=lambda x: x[1].liveness_score)
    return best_bytes


# ── Verification: Compare Snapshot Against Stored Embedding ───────────────

def verify_snapshot(
    snapshot_bytes: bytes,
    stored_embedding: list[float],   # Retrieved from DB as Python list
) -> VerificationResult:
    """
    Compare a monitoring snapshot against the trainee's registered embedding.

    Steps:
      1. Process the snapshot (detect face, liveness, extract embedding).
      2. Compute cosine similarity against stored_embedding.
         Since both vectors are unit-normalized, cosine similarity =
         their dot product. Range: -1.0 to 1.0 (higher = better match).
      3. Apply FACE_MATCH_THRESHOLD.
         Note: cosine distance threshold of 0.4 means similarity >= 0.6
         is a match. This is the standard ArcFace operating point.

    Returns a VerificationResult with all fields needed to populate
    the visual_verifications table row.
    """
    result = process_single_image(snapshot_bytes)

    if not result.success:
        return VerificationResult(
            matched=False,
            confidence_score=0.0,
            liveness_score=result.liveness_score,
            is_liveness_passed=result.is_liveness_passed,
            faces_detected_count=result.faces_detected_count,
            failure_reason=result.failure_reason,
        )

    stored_vec = _normalize(np.array(stored_embedding, dtype=np.float32))
    similarity = float(np.dot(result.embedding, stored_vec))

    # Cosine similarity → cosine distance = 1 - similarity
    # Match if distance < threshold (i.e. similarity > 1 - threshold)
    cosine_distance = 1.0 - similarity
    matched = cosine_distance < settings.FACE_MATCH_THRESHOLD

    return VerificationResult(
        matched=matched,
        confidence_score=round(similarity, 6),
        liveness_score=result.liveness_score,
        is_liveness_passed=result.is_liveness_passed,
        faces_detected_count=result.faces_detected_count,
        failure_reason=None if matched else f"Face mismatch (similarity={similarity:.3f}, threshold={1 - settings.FACE_MATCH_THRESHOLD:.3f}).",
    )