"""Chat service — saving and retrieving chat messages."""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, asc

from app.models.message import Message
from app.core.logging import get_logger

logger = get_logger()


async def save_message(
    db: AsyncSession,
    session_id: str,
    role: str,
    content: str,
    token_count: int | None = None,
) -> Message:
    """Save a chat message to the database."""
    message = Message(
        session_id=session_id,
        role=role,
        content=content,
        token_count=token_count,
    )
    db.add(message)
    await db.commit()
    await db.refresh(message)
    logger.info(
        "Message saved",
        session_id=session_id,
        role=role,
        length=len(content),
    )
    return message


async def get_messages(db: AsyncSession, session_id: str) -> list[Message]:
    """Get all messages for a session, ordered by creation time."""
    result = await db.execute(
        select(Message)
        .where(Message.session_id == session_id)
        .order_by(asc(Message.created_at))
    )
    return list(result.scalars().all())
