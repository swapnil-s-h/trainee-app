import os
import uuid
import aiofiles
from pathlib import Path
from fastapi import UploadFile
from app.core.config import settings


def _ensure_dir(path: str) -> Path:
    p = Path(path)
    p.mkdir(parents=True, exist_ok=True)
    return p


async def save_photo(file: UploadFile, subfolder: str) -> str:
    """
    Save an uploaded photo to local storage.

    Args:
        file:      The uploaded file from FastAPI.
        subfolder: e.g. 'registration' or 'snapshots'

    Returns:
        Relative URL path like 'storage/photos/registration/<uuid>.jpg'
    """
    base_dir = _ensure_dir(os.path.join(settings.PHOTO_STORAGE_PATH, subfolder))

    ext = Path(file.filename).suffix if file.filename else ".jpg"
    filename = f"{uuid.uuid4()}{ext}"
    file_path = base_dir / filename

    async with aiofiles.open(file_path, "wb") as out_file:
        content = await file.read()
        await out_file.write(content)

    # Return as a forward-slash path usable as a relative URL
    return str(file_path).replace("\\", "/")


async def save_photo_bytes(image_bytes: bytes, subfolder: str, ext: str = ".jpg") -> str:
    """
    Save raw image bytes (e.g. the best frame selected internally) to local storage.

    Returns:
        Relative URL path string.
    """
    base_dir = _ensure_dir(os.path.join(settings.PHOTO_STORAGE_PATH, subfolder))
    filename = f"{uuid.uuid4()}{ext}"
    file_path = base_dir / filename

    async with aiofiles.open(file_path, "wb") as out_file:
        await out_file.write(image_bytes)

    return str(file_path).replace("\\", "/")