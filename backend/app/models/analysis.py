from __future__ import annotations

from datetime import datetime
from typing import Optional
from uuid import uuid4

from sqlalchemy import String, Integer, Float, Text, DateTime, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.db.base import Base


class Analysis(Base):
    __tablename__ = "analyses"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid4())
    )
    image_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("images.id", ondelete="CASCADE"), index=True
    )
    session_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("sessions.id", ondelete="CASCADE"), index=True
    )
    scene_summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    objects: Mapped[Optional[list]] = mapped_column(JSON, nullable=True)
    ocr_text: Mapped[Optional[str]] = mapped_column(JSON, nullable=True)
    languages: Mapped[Optional[list]] = mapped_column(JSON, nullable=True)
    colors: Mapped[Optional[list]] = mapped_column(JSON, nullable=True)
    faces: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    logos: Mapped[Optional[list]] = mapped_column(JSON, nullable=True)
    safety: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    charts: Mapped[Optional[str]] = mapped_column(JSON, nullable=True)
    tables: Mapped[Optional[str]] = mapped_column(JSON, nullable=True)
    handwriting: Mapped[Optional[str]] = mapped_column(JSON, nullable=True)
    confidence: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    quality: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    suggested_questions: Mapped[Optional[list]] = mapped_column(JSON, nullable=True)
    tokens_used: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()
    )

    # Relationships
    image: Mapped["Image"] = relationship("Image", back_populates="analyses")
    session: Mapped["Session"] = relationship("Session", back_populates="analyses")

    def __repr__(self) -> str:
        return f"<Analysis id={self.id} image_id={self.image_id}>"
