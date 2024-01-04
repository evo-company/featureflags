import asyncio
import logging
import time
from collections.abc import Callable
from typing import Any

log = logging.getLogger(__name__)


def debug_cancellation(func: Callable) -> Callable:
    async def wrapper(self: Any, stream: Any, *args: Any, **kwargs: Any) -> Any:
        start_time = time.monotonic()
        try:
            return await func(self, stream, *args, **kwargs)
        except asyncio.CancelledError:
            if stream.deadline:
                deadline = stream.deadline.time_remaining()
                log.warning(
                    "Request cancelled, elapsed: %.4fs;" " remaining: %.4fs",
                    time.monotonic() - start_time,
                    deadline,
                    exc_info=True,
                )
            else:
                log.warning(
                    "Request cancelled, elapsed: %.4fs;"
                    " user-agent: %s;"
                    " metadata: %s;",
                    time.monotonic() - start_time,
                    stream.user_agent,
                    stream.metadata,
                    exc_info=True,
                )

            raise

    return wrapper
