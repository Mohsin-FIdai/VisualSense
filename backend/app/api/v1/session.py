"""Session endpoints — create, get, delete, and list sessions."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.database import get_db
from app.services import session_service
from app.schemas.session import (
    SessionResponse,
    SessionDetail,
    SessionListResponse,
    ImageInfo,
)
from app.schemas.chat import ChatMessage
from app.schemas.analysis import AnalysisResponse
from app.core.logging import get_logger

logger = get_logger()
router = APIRouter()


@router.post("/session", response_model=SessionResponse)
async def create_session(db: AsyncSession = Depends(get_db)):
    """Create a new empty session."""
    session = await session_service.create_session(db)
    return SessionResponse(
        id=session.id,
        title=session.title,
        status=session.status,
        created_at=session.created_at,
        updated_at=session.updated_at,
        message_count=0,
    )


@router.get("/session/{session_id}", response_model=SessionDetail)
async def get_session(session_id: str, db: AsyncSession = Depends(get_db)):
    """Get full session details with messages and analysis."""
    session = await session_service.get_session(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Build image info
    image_info = None
    if session.images:
        img = session.images[0]
        image_info = ImageInfo(
            id=img.id,
            filename=img.filename,
            original_name=img.original_name,
            mime_type=img.mime_type,
            file_size=img.file_size,
            width=img.width,
            height=img.height,
            storage_path=img.storage_path,
            thumbnail_path=img.thumbnail_path,
        )

    # Build messages
    chat_messages = [
        ChatMessage(
            id=msg.id,
            role=msg.role,
            content=msg.content,
            created_at=msg.created_at,
        )
        for msg in sorted(session.messages, key=lambda m: m.created_at)
    ]

    # Build analysis
    analysis_response = None
    if session.analyses:
        a = session.analyses[0]
        
        is_failed = a.scene_summary and "I couldn’t analyze this image properly" in a.scene_summary
        
        analysis_response = AnalysisResponse(
            id=a.id,
            image_id=a.image_id,
            session_id=a.session_id,
            scene_summary=a.scene_summary,
            status="failed" if is_failed else "success",
            error="Model returned empty output" if is_failed else None,
            objects=a.objects,
            ocr_text=a.ocr_text,
            languages=a.languages,
            colors=a.colors,
            faces=a.faces,
            logos=a.logos,
            safety=a.safety,
            charts=a.charts,
            tables=a.tables,
            handwriting=a.handwriting,
            confidence=a.confidence,
            quality=a.quality,
            suggested_questions=a.suggested_questions,
            tokens_used=a.tokens_used,
        )

    return SessionDetail(
        id=session.id,
        title=session.title,
        status=session.status,
        created_at=session.created_at,
        updated_at=session.updated_at,
        image=image_info,
        message_count=len(session.messages),
        messages=chat_messages,
        analysis=analysis_response,
    )


@router.delete("/session/{session_id}")
async def delete_session(session_id: str, db: AsyncSession = Depends(get_db)):
    """Delete a session and all related data."""
    deleted = await session_service.delete_session(db, session_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"status": "deleted", "session_id": session_id}


@router.get("/history", response_model=SessionListResponse)
async def list_sessions(db: AsyncSession = Depends(get_db)):
    """List all sessions, newest first."""
    sessions = await session_service.list_sessions(db)

    session_responses = []
    for s in sessions:
        image_info = None
        if s.images:
            img = s.images[0]
            image_info = ImageInfo(
                id=img.id,
                filename=img.filename,
                original_name=img.original_name,
                mime_type=img.mime_type,
                file_size=img.file_size,
                width=img.width,
                height=img.height,
                storage_path=img.storage_path,
                thumbnail_path=img.thumbnail_path,
            )

        session_responses.append(
            SessionResponse(
                id=s.id,
                title=s.title,
                status=s.status,
                created_at=s.created_at,
                updated_at=s.updated_at,
                image=image_info,
                message_count=len(s.messages) if s.messages else 0,
            )
        )

    return SessionListResponse(
        sessions=session_responses,
        total=len(session_responses),
    )
