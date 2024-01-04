import logging
from collections.abc import Callable
from contextlib import AbstractContextManager
from typing import Any

from prometheus_client import start_http_server
from prometheus_client.decorator import decorator as prometheus_decorator

log = logging.getLogger(__name__)


def wrap_metric(metric: AbstractContextManager) -> Callable:
    async def wrapper(fn: Callable, *args: Any, **kwargs: Any) -> None:
        with metric:
            return await fn(*args, **kwargs)

    return prometheus_decorator(wrapper)


def configure_metrics(port: int | None = None) -> None:
    if port:
        start_http_server(port=port)
        log.info("Prometheus metrics initialized")
    else:
        log.info("Prometheus metrics disabled")
