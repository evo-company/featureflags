from abc import ABC, abstractmethod
from uuid import uuid4, UUID
from typing import Optional
from datetime import datetime, timedelta
from dataclasses import dataclass

import jwt

from sqlalchemy import select

from .utils import sel_first
from .schema import AuthSession


ACCESS_TOKEN_TTL = timedelta(minutes=10)


class SessionState:
    user: Optional[UUID]

    def get_access_token(self):
        raise NotImplementedError(type(self))


@dataclass
class Unknown(SessionState):
    """
    Represents initial state, when user was never signed in, so we are doing
    nothing here.
    """

    user: Optional[UUID] = None

    def get_access_token(self):
        return None  # nothing to do


@dataclass
class ValidAccessToken(SessionState):
    """
    Represents valid access token, no need to renew it, user is authenticated.
    """

    user: UUID

    def get_access_token(self):
        return None  # no need to change access_token


@dataclass
class ExpiredAccessToken(SessionState):
    """
    Represents expired access token, when user still signed in, so we can renew
    access token.
    """

    user: UUID
    _secret: str
    _session_key: str
    _session_exp: datetime

    def get_access_token(self):
        exp = min(self._session_exp, datetime.utcnow() + ACCESS_TOKEN_TTL)
        return jwt.encode(
            {"exp": exp, "user": self.user.hex, "session": self._session_key},
            self._secret,
            algorithm="HS256",
        )


@dataclass
class SignedOutSession(SessionState):
    """
    Represents expired access token, when it can't be renewed, because user
    was signed out.
    """

    _session_key: str
    _secret: str
    user: UUID = None

    def get_access_token(self):
        return jwt.encode(
            {
                "session": self._session_key,
            },
            self._secret,
            algorithm="HS256",
        )


@dataclass
class EmptyAccessToken(SessionState):
    """
    Represents an expired session, user is unauthenticated, but we are keeping
    session key to reuse it during next sign in action.
    """

    user: UUID = None

    def get_access_token(self):
        return None  # preserve empty session


class SessionBase(ABC):
    @property
    @abstractmethod
    def is_authenticated(self):
        pass


class Session(SessionBase):
    def __init__(
        self, ident: Optional[str], state: SessionState, *, secret: str
    ):
        self._ident = ident
        self._state = state
        self._secret = secret

    @property
    def is_authenticated(self):
        return self._state.user is not None

    @property
    def user(self):
        return self._state.user

    @property
    def ident(self):
        return self._ident

    def ensure_ident(self):
        if self._ident is None:
            self._ident = uuid4().hex
        return self._ident

    def associate_user(self, user, expiration_time):
        self._state = ExpiredAccessToken(
            user, self._secret, self._ident, expiration_time
        )

    def disassociate_user(self):
        assert self._ident
        self._state = SignedOutSession(self._ident, self._secret)

    def get_access_token(self):
        return self._state.get_access_token()


class InternalSession(SessionBase):
    is_authenticated = True


class TestSession(SessionBase):
    __test__ = False

    def __init__(self, user=None):
        self._user = user

    @property
    def is_authenticated(self):
        return self._user is not None

    @property
    def user(self):
        return self._user


async def get_session(access_token=None, *, db, secret):
    if access_token is None:
        state = Unknown()
        session_key = None
    else:
        try:
            payload = jwt.decode(access_token, secret, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            payload = jwt.decode(
                access_token, secret, verify=False, algorithms=["HS256"]
            )
            session_key = payload["session"]

            if "user" in payload:
                async with db.acquire() as conn:
                    row = await sel_first(
                        conn,
                        (
                            select(
                                [
                                    AuthSession.auth_user,
                                    AuthSession.expiration_time,
                                ]
                            ).where(AuthSession.session == session_key)
                        ),
                    )
                if (
                    row
                    and row.auth_user  # FIXME: backward compatibility
                    and row.expiration_time > datetime.utcnow()
                ):
                    state = ExpiredAccessToken(
                        row.auth_user, secret, session_key, row.expiration_time
                    )
                else:
                    state = SignedOutSession(session_key, secret)
            else:
                state = SignedOutSession(session_key, secret)
        except jwt.InvalidSignatureError:  # if secret key was changed
            payload = jwt.decode(
                access_token, secret, verify=False, algorithms=["HS256"]
            )
            session_key = payload["session"]
            state = SignedOutSession(session_key, secret)
        else:
            session_key = payload["session"]
            if "user" in payload:
                try:
                    user = UUID(hex=payload["user"])
                except ValueError:
                    # FIXME: backward compatibility
                    state = SignedOutSession(session_key, secret)
                else:
                    state = ValidAccessToken(user=user)
            else:
                state = EmptyAccessToken()
    return Session(session_key, state, secret=secret)
