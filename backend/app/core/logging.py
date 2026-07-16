"""
VisualSense — Structured Logging

Configures structlog for JSON-formatted, structured log output.
"""

import structlog


def setup_logging() -> None:
    """Configure structlog with JSON rendering and standard processors."""
    structlog.configure(
        processors=[
            structlog.contextvars.merge_contextvars,
            structlog.processors.add_log_level,
            structlog.processors.StackInfoRenderer(),
            structlog.dev.set_exc_info,
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.JSONRenderer(),
        ],
        wrapper_class=structlog.make_filtering_bound_logger(0),
        context_class=dict,
        logger_factory=structlog.PrintLoggerFactory(),
        cache_logger_on_first_use=True,
    )


def get_logger(name: str | None = None) -> structlog.stdlib.BoundLogger:
    """Return a bound structlog logger, optionally named.

    Args:
        name: Optional logger name added as ``logger`` key to every event.

    Returns:
        A fully-configured structlog bound logger instance.
    """
    log = structlog.get_logger()
    if name:
        log = log.bind(logger_name=name)
    return log

