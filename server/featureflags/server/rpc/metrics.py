from functools import wraps
from time import perf_counter

from prometheus_client import (
    Histogram,
    Counter,
    Gauge,
)


GRPC_METHOD_TIME = Histogram(
    'grpc_method_time_seconds',
    'time spent in requests to grpc method',
    ['method']
)

GRPC_METHOD_COUNT = Counter(
    'grpc_method_call_count',
    'how many times grpc method called',
    ['method']
)

GRPC_METHOD_IN_PROGRESS = Gauge(
    'grpc_method_call_in_progress',
    'how many grpc method calls in progress',
    ['method']
)


def track(wrapped):
    @wraps(wrapped)
    async def tracker(*args, **kw):
        method = wrapped.__name__
        GRPC_METHOD_COUNT.labels(method).inc()
        GRPC_METHOD_IN_PROGRESS.labels(method).inc()
        start_time = perf_counter()
        try:
            rv = await wrapped(*args, **kw)
        finally:
            GRPC_METHOD_TIME.labels(method).observe(
                perf_counter() - start_time
            )
            GRPC_METHOD_IN_PROGRESS.labels(method).dec()

        return rv
    return tracker
