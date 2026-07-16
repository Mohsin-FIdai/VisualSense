from __future__ import annotations

from datetime import datetime
from typing import Optional, List
from uuid import uuid4

from sqlalchemy import String, DateTime, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.db.base import Base


class Session(Base):
    __tablename__ = "sessions"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid4())
    )
    title: Mapped[Optional[str]] = mapped_column(
        String(255), nullable=True, default="New Analysis"
    )
    status: Mapped[str] = mapped_column(String(50), default="active")
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now()
    )
    updated_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime, onupdate=func.now(), nullable=True
    )

    # Relationships
    images: Mapped[List["Image"]] = relationship(
        "Image", back_populates="session", lazy="selectin", cascade="all, delete-orphan"
    )
    messages: Mapped[List["Message"]] = relationship(
        "Message", back_populates="session", lazy="selectin", cascade="all, delete-orphan"
    )
    analyses: Mapped[List["Analysis"]] = relationship(
        "Analysis", back_populates="session", lazy="selectin", cascade="all, delete-orphan"
    )

    __table_args__ = (
        Index("ix_sessions_created_at", "created_at"),
    )

    def __repr__(self) -> str:
        return f"<Session id={self.id} title={self.title}>"
