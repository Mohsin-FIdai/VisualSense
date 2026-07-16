"""Session service — CRUD operations for analysis sessions."""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from sqlalchemy.orm import selectinload

from app.models.session import Session
from app.core.logging import get_logger

logger = get_logger()


async def create_session(db: AsyncSession) -> Session:
    """Create a new analysis session."""
    session = Session()
    db.add(session)
    await db.commit()
    await db.refresh(session)
    logger.info("Session created", session_id=session.id)
    return session


async def get_session(db: AsyncSession, session_id: str) -> Session | None:
    """Get a session with eager loading of images, messages, and analyses."""
    result = await db.execute(
        select(Session)
        .options(
            selectinload(Session.images),
            selectinload(Session.messages),
            selectinload(Session.analyses),
        )
        .where(Session.id == session_id)
    )
    return result.scalar_one_or_none()


async def list_sessions(db: AsyncSession) -> list[Session]:
    """List all sessions, newest first."""
    result = await db.execute(
        select(Session)
        .options(
            selectinload(Session.images),
            selectinload(Session.messages),
        )
        .order_by(desc(Session.created_at))
    )
    return list(result.scalars().all())


async def delete_session(db: AsyncSession, session_id: str) -> bool:
    """Delete a session and all related data."""
    session = await get_session(db, session_id)
    if not session:
        return False

    await db.delete(session)
    await db.commit()
    logger.info("Session deleted", session_id=session_id)
    return True


async def update_title(
    db: AsyncSession, session_id: str, title: str
) -> Session | None:
    """Update session title."""
    session = await get_session(db, session_id)
    if not session:
        return None

    session.title = title[:255] if title else "New Analysis"
    await db.commit()
    await db.refresh(session)
    return session
