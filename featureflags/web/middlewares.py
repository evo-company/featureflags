from collections.abc import Awaitable, Callable

from fastapi import FastAPI, Request, Response
from fastapi.responses import ORJSONResponse

from featureflags.errors import UserNotAuthorizedError
from featureflags.services.auth import (
    set_user_session_from_bearer,
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
        oidc_authenticators = container.oidc_authenticators()

        try:
            is_set = await set_user_session_from_bearer(
                request=request,
                engine=engine,
                oidc_authenticators=oidc_authenticators,
            )
        except UserNotAuthorizedError as e:
            return ORJSONResponse(
                {"detail": e.detail},
                status_code=e.status_code,
            )

        if not is_set:
            await set_user_session_from_cookie(request, engine)

        response = await call_next(request)
        await set_user_session_to_response(response)
        return response
