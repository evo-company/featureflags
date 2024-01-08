import time
from collections.abc import Callable
from functools import wraps
from typing import Any

from prometheus_client import (
    Counter,
    Gauge,
    Histogram,
)

GRPC_METHOD_TIME = Histogram(
    "grpc_method_time_seconds",
    "time spent in requests to grpc method",
    ["method"],
)

GRPC_METHOD_COUNT = Counter(
    "grpc_method_call_count", "how many times grpc method called", ["method"]
)

GRPC_METHOD_IN_PROGRESS = Gauge(
    "grpc_method_call_in_progress",
    "how many grpc method calls in progress",
    ["method"],
)


def track(func: Callable) -> Callable:
    @wraps(func)
    async def wrapper(*args: Any, **kwargs: Any) -> Any:
        func_name = func.__name__

        GRPC_METHOD_COUNT.labels(func_name).inc()
        GRPC_METHOD_IN_PROGRESS.labels(func_name).inc()

        start_time = time.perf_counter()
        try:
            result = await func(*args, **kwargs)
        finally:
            GRPC_METHOD_TIME.labels(func_name).observe(
                time.perf_counter() - start_time
            )
            GRPC_METHOD_IN_PROGRESS.labels(func_name).dec()

        return result

    return wrapper
