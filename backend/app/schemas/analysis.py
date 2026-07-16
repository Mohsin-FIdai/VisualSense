from pydantic import BaseModel, Field
from typing import Optional


class AnalysisResponse(BaseModel):
    id: str
    image_id: str
    session_id: str
    scene_summary: Optional[str] = None
    status: str = "success"
    error: Optional[str] = None
    objects: Optional[list] = None
    ocr_text: Optional[str] = None
    languages: Optional[list] = None
    colors: Optional[list] = None
    faces: Optional[dict] = None
    logos: Optional[list] = None
    safety: Optional[dict] = None
    charts: Optional[str] = None
    tables: Optional[str] = None
    handwriting: Optional[str] = None
    confidence: Optional[float] = None
    quality: Optional[str] = None
    suggested_questions: Optional[list[str]] = None
    tokens_used: Optional[int] = None

    model_config = {"from_attributes": True}
