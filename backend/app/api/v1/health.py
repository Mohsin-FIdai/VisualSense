"""Health check endpoint."""

from datetime import datetime, timezone

from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health")
async def health_check() -> dict:
    """Return service health status."""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "service": "VisualSense API",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
