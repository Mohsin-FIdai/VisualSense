"""
VisualSense — Application Configuration

Loads settings from environment variables and .env file using Pydantic BaseSettings.
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment / .env file."""

    # ── AI Model ──────────────────────────────────────────────────────────
    ollama_url: str = "http://localhost:11434"
    model_name: str = "llava:7b"

    # ── Database ──────────────────────────────────────────────────────────
    database_url: str = "sqlite+aiosqlite:///./data/visualsense.db"

    # ── Redis ─────────────────────────────────────────────────────────────
    redis_url: str = "redis://localhost:6379"

    # ── File Storage ──────────────────────────────────────────────────────
    upload_dir: str = "./uploads"
    max_file_size: int = 20_971_520  # 20 MB

    # ── CORS ──────────────────────────────────────────────────────────────
    cors_origins: str = "http://localhost:3000"

    # ── Rate Limiting ─────────────────────────────────────────────────────
    rate_limit_per_minute: int = 30

    # ── Server ────────────────────────────────────────────────────────────
    backend_host: str = "0.0.0.0"
    backend_port: int = 8000

    model_config = {
        "env_file": ("../.env", ".env"),
        "env_file_encoding": "utf-8",
        "case_sensitive": False,
        "extra": "ignore",
    }


settings = Settings()
