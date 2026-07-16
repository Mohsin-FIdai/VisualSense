"""Image service — validation, saving, thumbnail generation, metadata extraction."""

import os
import base64
import uuid
from pathlib import Path

from fastapi import UploadFile, HTTPException
from PIL import Image

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger()

ALLOWED_MIME_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/bmp",
    "image/tiff",
}


async def validate_image(file: UploadFile) -> None:
    """Validate uploaded image file type and size."""
    if not file.content_type or file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type: {file.content_type}. "
            f"Allowed: {', '.join(sorted(ALLOWED_MIME_TYPES))}",
        )

    # Check file size by reading content
    content = await file.read()
    await file.seek(0)  # Reset file position

    if len(content) > settings.max_file_size:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size: "
            f"{settings.max_file_size / (1024 * 1024):.0f}MB",
        )


async def save_image(file: UploadFile) -> tuple[str, str, str]:
    """Save uploaded image to disk. Returns (storage_path, filename, original_name)."""
    original_name = file.filename or "unknown.png"
    ext = os.path.splitext(original_name)[1] or ".png"
    filename = f"{uuid.uuid4().hex}{ext}"

    upload_dir = Path(settings.upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)

    storage_path = str(upload_dir / filename)

    content = await file.read()
    with open(storage_path, "wb") as f:
        f.write(content)

    logger.info(
        "Image saved",
        filename=filename,
        original_name=original_name,
        size=len(content),
    )
    return storage_path, filename, original_name


def generate_thumbnail(image_path: str) -> str:
    """Create a 400px max thumbnail. Returns thumbnail path."""
    try:
        thumb_dir = Path(settings.upload_dir) / "thumbnails"
        thumb_dir.mkdir(parents=True, exist_ok=True)

        img = Image.open(image_path)
        img.thumbnail((400, 400), Image.LANCZOS)

        thumb_filename = f"thumb_{Path(image_path).name}"
        # Convert to RGB if needed (for RGBA/P mode images)
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
            thumb_filename = Path(thumb_filename).stem + ".jpg"

        thumb_path = str(thumb_dir / thumb_filename)
        img.save(thumb_path, quality=85)

        logger.info("Thumbnail generated", path=thumb_path)
        return thumb_path
    except Exception as e:
        logger.error("Thumbnail generation failed", error=str(e))
        return ""


def extract_metadata(image_path: str) -> dict:
    """Get width, height, format, exif data using Pillow."""
    try:
        img = Image.open(image_path)
        metadata = {
            "width": img.width,
            "height": img.height,
            "format": img.format,
            "mode": img.mode,
        }

        # Extract EXIF data if available
        exif_data = {}
        if hasattr(img, "_getexif") and img._getexif():
            raw_exif = img._getexif()
            from PIL.ExifTags import TAGS

            for tag_id, value in raw_exif.items():
                tag = TAGS.get(tag_id, str(tag_id))
                try:
                    if isinstance(value, bytes):
                        value = value.decode("utf-8", errors="ignore")
                    elif not isinstance(
                        value, (str, int, float, bool, type(None))
                    ):
                        value = str(value)
                    exif_data[tag] = value
                except Exception:
                    pass

        metadata["exif"] = exif_data if exif_data else None
        return metadata
    except Exception as e:
        logger.error("Metadata extraction failed", error=str(e))
        return {
            "width": None,
            "height": None,
            "format": None,
            "mode": None,
            "exif": None,
        }


def image_to_base64(image_path: str) -> str:
    """Read image and return base64 encoded string."""
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")
