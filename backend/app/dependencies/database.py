"""Re-export get_db from db.session for cleaner imports."""

from app.db.session import get_db

__all__ = ["get_db"]
