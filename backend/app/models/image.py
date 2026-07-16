from __future__ import annotations

from datetime import datetime
from typing import Optional, List
from uuid import uuid4

from sqlalchemy import String, Integer, DateTime, JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.db.base import Base


class Image(Base):
    __tablename__ = "images"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid4())
    )
    session_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("sessions.id", ondelete="CASCADE"), index=True
    )
    filename: Mapped[str] = mapped_column(String(255))
    original_name: Mapped[str] = mapped_column(String(255))
    mime_type: Mapped[str] = mapped_column(String(100))
    file_size: Mapped[int] = mapped_column(Integer)
    width: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    height: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    storage_path: Mapped[str] = mapped_column(String(500))
    thumbnail_path: Mapped[Optional[str]] = mapped_column(
        String(500), nullable=True
    )
    exif_data: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()
    )

    # Relationships
    session: Mapped["Session"] = relationship(
        "Session", back_populates="images"
    )
    analyses: Mapped[List["Analysis"]] = relationship(
        "Analysis", back_populates="image", lazy="selectin", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Image id={self.id} filename={self.filename}>"
