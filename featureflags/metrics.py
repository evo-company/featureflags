import logging
from collections.abc import Callable
from contextlib import AbstractContextManager
from typing import Any

from fastapi import FastAPI
from prometheus_client import start_http_server
from prometheus_client.decorator import decorator as prometheus_decorator
from prometheus_fastapi_instrumentator import Instrumentator

log = logging.getLogger(__name__)


def wrap_metric(metric: AbstractContextManager) -> Callable:
    async def wrapper(fn: Callable, *args: Any, **kwargs: Any) -> None:
        with metric:
            return await fn(*args, **kwargs)

    return prometheus_decorator(wrapper)


def configure_metrics(
    port: int | None = None,
    app: FastAPI | None = None,
) -> None:
    if port:
        start_http_server(port=port)
        log.info("Prometheus metrics initialized")

        if app:
            instrumentator = Instrumentator(
                should_instrument_requests_inprogress=True,
                inprogress_labels=True,
                excluded_handlers=["/metrics", "/~health"],
            )
            instrumentator.instrument(
                app=app,
                latency_lowr_buckets=[
                    0.001,
                    0.005,
                    0.01,
                    0.025,
                    0.05,
                    0.1,
                    0.25,
                    0.5,
                ],
            )
            log.info("Http instrumentation initialized")

    else:
        log.info("Prometheus metrics disabled")
