"""Local file storage utilities."""

import os
from pathlib import Path

from app.core.logging import get_logger

logger = get_logger()


async def save_file(content: bytes, directory: str, filename: str) -> str:
    """Save bytes to disk, return full path."""
    dir_path = Path(directory)
    dir_path.mkdir(parents=True, exist_ok=True)

    file_path = dir_path / filename
    with open(file_path, "wb") as f:
        f.write(content)

    logger.info("File saved", path=str(file_path), size=len(content))
    return str(file_path)


async def delete_file(path: str) -> bool:
    """Delete a file from disk."""
    try:
        if os.path.exists(path):
            os.remove(path)
            logger.info("File deleted", path=path)
            return True
        return False
    except Exception as e:
        logger.error("File deletion failed", path=path, error=str(e))
        return False


def ensure_directory(path: str) -> None:
    """Ensure a directory exists, creating it if necessary."""
    Path(path).mkdir(parents=True, exist_ok=True)
