"""Analysis service — saving and retrieving AI analysis results."""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.analysis import Analysis
from app.core.logging import get_logger

logger = get_logger()


async def save_analysis(
    db: AsyncSession,
    image_id: str,
    session_id: str,
    analysis_data: dict,
) -> Analysis:
    """Save analysis results to the database."""
    analysis = Analysis(
        image_id=image_id,
        session_id=session_id,
        scene_summary=analysis_data.get("scene_summary"),
        objects=analysis_data.get("objects"),
        ocr_text=analysis_data.get("ocr_text"),
        languages=analysis_data.get("languages"),
        colors=analysis_data.get("colors"),
        faces=analysis_data.get("faces"),
        logos=analysis_data.get("logos"),
        safety=analysis_data.get("safety"),
        charts=analysis_data.get("charts"),
        tables=analysis_data.get("tables"),
        handwriting=analysis_data.get("handwriting"),
        confidence=analysis_data.get("confidence"),
        quality=analysis_data.get("quality"),
        suggested_questions=analysis_data.get("suggested_questions"),
        tokens_used=analysis_data.get("tokens_used"),
    )
    db.add(analysis)
    await db.commit()
    await db.refresh(analysis)
    logger.info("Analysis saved", image_id=image_id, session_id=session_id)
    return analysis


async def get_analysis(db: AsyncSession, session_id: str) -> Analysis | None:
    """Get the most recent analysis for a session."""
    result = await db.execute(
        select(Analysis)
        .where(Analysis.session_id == session_id)
        .order_by(Analysis.created_at.desc())
    )
    return result.scalar_one_or_none()
