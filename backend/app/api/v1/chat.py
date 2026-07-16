"""Chat endpoint — SSE streaming chat about analyzed images."""

import json

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.database import get_db
from app.schemas.chat import ChatRequest
from app.services import chat_service, analysis_service, session_service
from app.ai.vision import vision_service
from app.ai.context import (
    build_analysis_context,
    build_chat_messages,
    extract_suggested_questions,
)
from app.core.logging import get_logger

logger = get_logger()
router = APIRouter()


@router.post("/chat")
async def chat(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db),
):
    """Chat about an analyzed image with SSE streaming."""
    # Verify session exists
    session = await session_service.get_session(db, request.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Save user message
    await chat_service.save_message(
        db=db,
        session_id=request.session_id,
        role="user",
        content=request.message,
    )

    # Get conversation history
    messages = await chat_service.get_messages(db, request.session_id)

    # Get analysis context
    analysis = await analysis_service.get_analysis(db, request.session_id)
    analysis_context = ""
    if analysis:
        analysis_dict = {
            "scene_summary": analysis.scene_summary,
            "objects": analysis.objects,
            "ocr_text": analysis.ocr_text,
            "languages": analysis.languages,
            "colors": analysis.colors,
            "faces": analysis.faces,
            "logos": analysis.logos,
            "safety": analysis.safety,
            "charts": analysis.charts,
            "tables": analysis.tables,
            "handwriting": analysis.handwriting,
            "confidence": analysis.confidence,
            "quality": analysis.quality,
        }
        analysis_context = build_analysis_context(analysis_dict)

    # Build chat messages (exclude the latest user message since build_chat_messages adds it)
    history_messages = build_chat_messages(
        history=[m for m in messages[:-1]],
        analysis_context=analysis_context,
        new_message=request.message,
    )

    # Capture session_id for use in the closure
    session_id = request.session_id

    async def event_stream():
        full_response = ""
        try:
            async for chunk in vision_service.chat_stream(
                history_messages, analysis_context
            ):
                full_response += chunk
                event_data = json.dumps({"type": "chunk", "content": chunk})
                yield f"data: {event_data}\n\n"

            # Extract suggested questions from full response
            clean_text, suggested_questions = extract_suggested_questions(
                full_response
            )

            # Save assistant message to DB using a new session
            from app.db.base import async_session_factory

            async with async_session_factory() as new_db:
                await chat_service.save_message(
                    db=new_db,
                    session_id=session_id,
                    role="assistant",
                    content=clean_text,
                )

            # Send final event
            done_data = json.dumps(
                {
                    "type": "done",
                    "content": clean_text,
                    "suggested_questions": suggested_questions,
                }
            )
            yield f"data: {done_data}\n\n"

        except Exception as e:
            logger.error("Chat stream error", error=str(e))
            error_data = json.dumps({"type": "error", "content": str(e)})
            yield f"data: {error_data}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
