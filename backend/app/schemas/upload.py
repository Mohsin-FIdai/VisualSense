from pydantic import BaseModel
from typing import Optional

from app.schemas.analysis import AnalysisResponse


class ImageMetadata(BaseModel):
    width: Optional[int] = None
    height: Optional[int] = None
    file_size: int
    mime_type: str
    format: Optional[str] = None
    exif: Optional[dict] = None


class UploadResponse(BaseModel):
    session_id: str
    image_id: str
    filename: str
    original_name: str
    metadata: ImageMetadata
    analysis: Optional[AnalysisResponse] = None

    model_config = {"from_attributes": True}
