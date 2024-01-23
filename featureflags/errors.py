from starlette import status


class BaseInternalServerError(Exception):
    """Internal server error."""

    status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR
    detail: str = "Internal server error."


class UserNotAuthorizedError(BaseInternalServerError):
    """User not authorized."""

    status_code: int = status.HTTP_401_UNAUTHORIZED
    detail: str = "User not authorized."
