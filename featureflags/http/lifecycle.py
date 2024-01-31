import anyio.to_thread
from dependency_injector.containers import DeclarativeContainer
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import ORJSONResponse

from featureflags.config import config
from featureflags.errors import BaseInternalServerError


def configure_lifecycle(app: FastAPI, container: DeclarativeContainer) -> None:
    @app.on_event("startup")
    async def startup() -> None:
        """Application startup functions."""

        # https://github.com/tiangolo/fastapi/discussions/8587
        # Adjust this value to limit the number of concurrent threads.
        limiter = anyio.to_thread.current_default_thread_limiter()
        limiter.total_tokens = config.http.max_concurrent_threads

        await container.init_resources()

    @app.on_event("shutdown")
    async def shutdown() -> None:
        """Application shutdown functions."""

        await container.shutdown_resources()

    @app.exception_handler(HTTPException)
    async def http_exception_handler(
        _: Request,
        exc: HTTPException,
    ) -> ORJSONResponse:
        headers = getattr(exc, "headers", None)

        return ORJSONResponse(
            content={"detail": exc.detail},
            status_code=exc.status_code,
            headers=headers,
        )

    @app.exception_handler(BaseInternalServerError)
    async def internal_server_error_handler(
        _: Request,
        exc: BaseInternalServerError,
    ) -> ORJSONResponse:
        headers = getattr(exc, "headers", None)

        return ORJSONResponse(
            content={"detail": exc.detail},
            status_code=exc.status_code,
            headers=headers,
        )
