from prometheus_client.decorator import decorator
from prometheus_client.exposition import start_http_server


def wrap(metric):
    async def wrapper(fn, *args, **kwargs):
        with metric:
            return await fn(*args, **kwargs)
    return decorator(wrapper)


def configure(port):
    start_http_server(port)
