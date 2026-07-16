"""Upload endpoint — image upload with AI analysis."""

import os

from fastapi import APIRouter, UploadFile, File, Depends, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.database import get_db
from app.services import image_service, session_service, analysis_service
from app.ai.vision import vision_service
from app.schemas.upload import UploadResponse, ImageMetadata
from app.schemas.analysis import AnalysisResponse
from app.models.image import Image as ImageModel
from app.core.logging import get_logger

logger = get_logger()
router = APIRouter()


@router.post("/upload", response_model=UploadResponse)
async def upload_image(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    """Upload an image for AI analysis."""
    # Validate image
    await image_service.validate_image(file)

    # Save image to disk
    storage_path, filename, original_name = await image_service.save_image(file)

    # Extract metadata
    metadata = image_service.extract_metadata(storage_path)

    # Create session
    session = await session_service.create_session(db)

    # Get actual file size
    file_size = metadata.get("width") and os.path.getsize(storage_path) or os.path.getsize(storage_path)

    # Create image record
    image_record = ImageModel(
        session_id=session.id,
        filename=filename,
        original_name=original_name,
        mime_type=file.content_type or "image/png",
        file_size=file_size,
        width=metadata.get("width"),
        height=metadata.get("height"),
        storage_path=storage_path,
        exif_data=metadata.get("exif"),
    )
    db.add(image_record)
    await db.commit()
    await db.refresh(image_record)

    # Generate thumbnail in background
    background_tasks.add_task(image_service.generate_thumbnail, storage_path)

    # Convert image to base64 for AI analysis
    image_base64 = image_service.image_to_base64(storage_path)
    content_type = file.content_type or "image/png"
    session_id = session.id
    image_id = image_record.id

    async def background_analysis():
        # Create a new local db session for the background task
        from app.db.base import async_session_factory
        async with async_session_factory() as bg_db:
            try:
                analysis_data = await vision_service.analyze_image(
                    image_base64, content_type
                )
                await analysis_service.save_analysis(
                    db=bg_db,
                    image_id=image_id,
                    session_id=session_id,
                    analysis_data=analysis_data,
                )
                scene_summary = analysis_data.get("scene_summary", "")
                if scene_summary:
                    title = scene_summary[:100] + ("..." if len(scene_summary) > 100 else "")
                    await session_service.update_title(bg_db, session_id, title)
            except Exception as e:
                logger.error("Background AI analysis failed", error=str(e))

    # Add the analysis to background tasks
    background_tasks.add_task(background_analysis)
    analysis_response = None

    # Build response
    image_metadata = ImageMetadata(
        width=metadata.get("width"),
        height=metadata.get("height"),
        file_size=image_record.file_size,
        mime_type=file.content_type or "image/png",
        format=metadata.get("format"),
        exif=metadata.get("exif"),
    )

    return UploadResponse(
        session_id=session.id,
        image_id=image_record.id,
        filename=filename,
        original_name=original_name,
        metadata=image_metadata,
        analysis=analysis_response,
    )
