"""API v1 router — aggregates all sub-routers."""

from fastapi import APIRouter

from app.api.v1 import upload, chat, session, health

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(upload.router, tags=["Upload"])
api_router.include_router(chat.router, tags=["Chat"])
api_router.include_router(session.router, tags=["Sessions"])
api_router.include_router(health.router, tags=["Health"])
