"""
main.py
=======
FastAPI application entry point.

Start the server:
    uvicorn main:app --reload --host 0.0.0.0 --port 8000

API docs available at:
    http://localhost:8000/docs      (Swagger UI)
    http://localhost:8000/redoc     (ReDoc)
"""

from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.services import face_service
from fastapi.middleware.cors import CORSMiddleware
from app.routers import registration, verification


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Runs on startup and shutdown.
    InsightFace model is loaded once here — not per request.
    Model download (~300MB) happens only on first run.
    """
    print("Loading InsightFace buffalo_l model...")
    face_service.load_model()
    print("InsightFace model loaded and ready.")
    yield
    print("Shutting down.")


app = FastAPI(
    title="Trainee Visual Verification API",
    description=(
        "Backend for Module 13 — AI-Powered Visual Verification. "
        "Handles face registration during onboarding and continuous identity "
        "monitoring during lessons and quizzes."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ────────────────────────────────────────────────────────────────
app.include_router(registration.router)
app.include_router(verification.router)


@app.get("/health", tags=["Health"])
async def health_check():
    """Simple health check — confirms server is running."""
    return {"status": "ok", "model": "buffalo_l"}