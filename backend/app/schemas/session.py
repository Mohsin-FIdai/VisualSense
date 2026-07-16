from pydantic import BaseModel
from datetime import datetime
from typing import Optional

from app.schemas.chat import ChatMessage
from app.schemas.analysis import AnalysisResponse
from app.schemas.upload import ImageMetadata


class ImageInfo(BaseModel):
    id: str
    filename: str
    original_name: str
    mime_type: str
    file_size: int
    width: Optional[int] = None
    height: Optional[int] = None
    storage_path: str
    thumbnail_path: Optional[str] = None

    model_config = {"from_attributes": True}


class SessionResponse(BaseModel):
    id: str
    title: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    image: Optional[ImageInfo] = None
    message_count: int = 0

    model_config = {"from_attributes": True}


class SessionListResponse(BaseModel):
    sessions: list[SessionResponse]
    total: int


class SessionDetail(SessionResponse):
    messages: list[ChatMessage] = []
    analysis: Optional[AnalysisResponse] = None
