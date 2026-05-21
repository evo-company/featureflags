import contextvars
from abc import ABC, abstractmethod
from collections.abc import Callable
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any
from uuid import UUID, uuid4

import aiopg.sa
import jwt
from aiopg import sa
from fastapi import Request, Response
from sqlalchemy import select

from featureflags.config import config
from featureflags.errors import (
    ReadOnlySessionError,
    UserNotAuthorizedError,
)
from featureflags.models import AuthSession
from featureflags.services.oidc_auth import (
    InvalidTokenError,
    OidcAuthenticator,
)
from featureflags.utils import select_first
from featureflags.web.constants import (
    ACCESS_TOKEN_TTL,
    COOKIE_ACCESS_TOKEN,
    COOKIE_ACCESS_TOKEN_MAX_AGE,
)


def decode_jwt_token(
    secret: str,
    access_token: str | None = None,
    verify_signature: bool = True,
) -> dict:
    return jwt.decode(
        access_token,
        secret,
        options={"verify_signature": verify_signature},
        algorithms=["HS256"],
    )


def encode_jwt_token(
    secret: str,
    payload: dict,
) -> str:
    # this is secure as payload is constructed at encode_jwt_token call and
    # payload is controlled at the caller side
    # nosemgrep: python.jwt.security.audit.jwt-exposed-data.jwt-python-exposed-data  # noqa: E501, ERA001
    return jwt.encode(
        payload,
        secret,
        algorithm="HS256",
    )


@dataclass(frozen=True)
class BaseState(ABC):
    user: UUID | None

    @abstractmethod
    def get_access_token(self) -> str | None:
        raise NotImplementedError()


@dataclass(frozen=True)
class UnknownState(BaseState):
    """
    Represents initial state, when user was never signed in, so we are doing
    nothing here.
    """

    user: UUID | None

    def get_access_token(self) -> str | None:
        return None  # nothing to do


@dataclass(frozen=True)
class ValidAccessTokenState(BaseState):
    """
    Represents valid access token, no need to renew it, user is authenticated.
    """

    user: UUID

    def get_access_token(self) -> str | None:
        return None  # no need to change access_token


@dataclass(frozen=True)
class ExpiredAccessTokenState(BaseState):
    """
    Represents expired access token, when user still signed in, so we can renew
    access token.
    """

    secret: str
    ident: str
    session_exp: datetime

    user: UUID

    def get_access_token(self) -> str:
        return encode_jwt_token(
            self.secret,
            payload={
                "exp": min(
                    self.session_exp, datetime.utcnow() + ACCESS_TOKEN_TTL
                ),
                "user": self.user.hex,
                "session": self.ident,
            },
        )


@dataclass(frozen=True)
class SignedOutState(BaseState):
    """
    Represents expired access token, when it can't be renewed, because user
    was signed out.
    """

    ident: str
    secret: str
    user: UUID | None

    def get_access_token(self) -> str:
        return encode_jwt_token(
            self.secret,
            payload={
                "session": self.ident,
            },
        )


@dataclass(frozen=True)
class EmptyAccessTokenState(BaseState):
    """
    Represents an expired session, user is unauthenticated, but we are keeping
    session key to reuse it during next sign in action.
    """

    user: UUID | None

    def get_access_token(self) -> str | None:
        return None  # preserve empty session


@dataclass(frozen=True)
class BearerTokenState(BaseState):
    """
    Stateless Bearer-authenticated session — an OIDC ID token sent by a CLI
    or service. Each request must carry its own token; no cookie renewal.
    """

    user: UUID
    provider: str
    client_name: str | None
    read_only: bool

    def get_access_token(self) -> str | None:
        return None


class BaseUserSession(ABC):
    @property
    @abstractmethod
    def is_authenticated(self) -> bool:
        raise NotImplementedError()

    @property
    def is_read_only(self) -> bool:
        """
        Default to False — only Bearer-auth sessions backed by a read-only
        client override this.
        """
        return False


@dataclass
class UserSession(BaseUserSession):
    state: BaseState
    secret: str
    ident: str = field(default=None)

    def __post_init__(self) -> None:
        if self.ident is None:
            self.ident = uuid4().hex

    @property
    def is_authenticated(self) -> bool:
        return self.state.user is not None

    @property
    def is_read_only(self) -> bool:
        return isinstance(self.state, BearerTokenState) and self.state.read_only

    @property
    def user(self) -> UUID | None:
        return self.state.user

    def sign_in(self, user: UUID, expiration_time: datetime) -> None:
        self.state = ExpiredAccessTokenState(
            user=user,
            secret=self.secret,
            ident=self.ident,
            session_exp=expiration_time,
        )

    def sign_out(self) -> None:
        self.state = SignedOutState(
            user=None, ident=self.ident, secret=self.secret
        )

    def get_access_token(self) -> str | None:
        return self.state.get_access_token()


class InternalUserSession(BaseUserSession):
    is_authenticated = True


@dataclass
class TestSession(BaseUserSession):
    user: UUID | None = None

    @property
    def is_authenticated(self) -> bool:
        return self.user is not None


async def create_user_session(
    engine: sa.engine.Engine,
    secret: str,
    access_token: str | None = None,
) -> UserSession:
    if access_token is None:
        return UserSession(
            ident=None,  # type: ignore
            state=UnknownState(user=None),
            secret=secret,
        )

    state: BaseState
    try:
        payload = decode_jwt_token(secret, access_token)
    except jwt.ExpiredSignatureError:
        payload = decode_jwt_token(secret, access_token, verify_signature=False)

        if "user" in payload:
            async with engine.acquire() as conn:
                if (
                    (
                        auth_session_row := await select_first(
                            conn,
                            select(
                                [
                                    AuthSession.auth_user,
                                    AuthSession.expiration_time,
                                ]
                            ).where(AuthSession.session == payload["session"]),
                        )
                    )
                    # FIXME: backward compatibility
                    and auth_session_row.auth_user
                    and auth_session_row.expiration_time > datetime.utcnow()
                ):
                    state = ExpiredAccessTokenState(
                        user=auth_session_row.auth_user,
                        secret=secret,
                        ident=payload["session"],
                        session_exp=auth_session_row.expiration_time,
                    )
                else:
                    state = SignedOutState(
                        user=None,
                        ident=payload["session"],
                        secret=secret,
                    )

        else:
            state = SignedOutState(
                user=None,
                ident=payload["session"],
                secret=secret,
            )

    except jwt.InvalidSignatureError:  # if secret key was changed
        payload = decode_jwt_token(secret, access_token, verify_signature=False)
        state = SignedOutState(
            user=None,
            ident=payload["session"],
            secret=secret,
        )

    else:
        if "user" in payload:
            try:
                user = UUID(hex=payload["user"])
            except ValueError:
                # FIXME: backward compatibility
                state = SignedOutState(
                    user=None,
                    ident=payload["session"],
                    secret=secret,
                )
            else:
                state = ValidAccessTokenState(user=user)
        else:
            state = EmptyAccessTokenState(user=None)

    return UserSession(ident=payload["session"], state=state, secret=secret)


async def set_user_session_from_cookie(
    request: Request, engine: aiopg.sa.Engine
) -> None:
    access_token = request.cookies.get(COOKIE_ACCESS_TOKEN)

    user_session.set(
        await create_user_session(
            engine=engine,
            access_token=access_token,
            secret=config.secret,
        )
    )


async def set_user_session_from_bearer(
    request: Request,
    engine: aiopg.sa.Engine,
    oidc_authenticators: dict[str, OidcAuthenticator],
) -> bool:
    """
    Try Bearer-token auth. Returns "True" if an Authorization header was
    present and consumed. Raises "UserNotAuthorizedError" when a Bearer
    header is present but no configured authenticator accepts the token.

    Routes to the right authenticator by the token's unverified "iss"
    claim — a forged "iss" still loses at signature verification because
    each authenticator only trusts its own JWKS.
    """
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return False

    token = auth_header[len("Bearer ") :]
    try:
        unverified = decode_jwt_token(
            secret=config.secret,
            access_token=token,
            verify_signature=False,
        )
    except jwt.PyJWTError as e:
        raise UserNotAuthorizedError() from e

    iss = unverified.get("iss")
    authenticators = oidc_authenticators.values()
    authenticator = next(
        (a for a in authenticators if a.provider.issuer == iss),
        None,
    )
    if authenticator is None:
        raise UserNotAuthorizedError()

    try:
        principal = await authenticator.authenticate(token, engine=engine)
    except InvalidTokenError as e:
        raise UserNotAuthorizedError() from e

    user_session.set(
        UserSession(
            state=BearerTokenState(
                user=principal.user_id,
                provider=principal.provider,
                client_name=principal.client_name,
                read_only=principal.read_only,
            ),
            secret=config.secret,
        )
    )
    return True


async def set_user_session_to_response(response: Response) -> None:
    if access_token_cookie := user_session.get().get_access_token():
        response.set_cookie(
            key=COOKIE_ACCESS_TOKEN,
            value=access_token_cookie,
            max_age=COOKIE_ACCESS_TOKEN_MAX_AGE,
            httponly=True,
            secure=not config.debug,
        )


def set_internal_user_session() -> None:
    user_session.set(InternalUserSession())  # type: ignore


def auth_required(func: Callable) -> Callable:
    async def wrapper(*args: Any, **kwargs: Any) -> Any:
        user = user_session.get()
        if not user.is_authenticated:
            raise UserNotAuthorizedError()
        if user.is_read_only:
            raise ReadOnlySessionError()
        return await func(*args, **kwargs)

    return wrapper


user_session: contextvars.ContextVar[UserSession] = contextvars.ContextVar(
    "user_session"
)
