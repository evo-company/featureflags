from collections.abc import Awaitable, Callable

from fastapi import FastAPI, Request, Response

from featureflags.services.auth import (
    set_user_session_from_cookie,
    set_user_session_to_response,
)
from featureflags.web.container import Container


def configure_middlewares(app: FastAPI, container: Container) -> None:
    @app.middleware("http")
    async def set_user_session_and_auth_cookie(
        request: Request,
        call_next: Callable[[Request], Awaitable[Response]],
    ) -> Response:
        engine = await container.db_engine()
        await set_user_session_from_cookie(request, engine)

        response = await call_next(request)
        await set_user_session_to_response(response)

        return response
