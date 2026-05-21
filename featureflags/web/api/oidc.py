"""
Server-initiated OAuth2 Authorization Code + PKCE flow.

This is the universal "Sign in with X" pattern for any OIDC identity
provider. The browser never speaks OAuth — it sees only:
  - "GET /oidc/{provider}/login"     → 302 to IdP authorize endpoint
  - "GET /oidc/{provider}/callback"  → 302 to /, with session cookie set

State and PKCE verifier live in a short-lived HttpOnly cookie encrypted
with "SECRET" (Fernet: AES-128-CBC + HMAC-SHA256), so all server state for
one in-flight login is recoverable from the request alone — no DB writes,
no in-memory map. The PKCE verifier is the sensitive field; encryption
keeps it opaque even if the cookie is observed off-channel.
"""

import base64
import hashlib
import json
import logging
import secrets
from datetime import UTC, datetime
from urllib.parse import quote

import aiopg.sa
from cryptography.fernet import Fernet, InvalidToken
from dependency_injector.wiring import Provide, inject
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.dialects.postgresql import insert

from featureflags.config import config
from featureflags.graph.constants import AUTH_SESSION_TTL
from featureflags.models import AuthSession
from featureflags.services.auth import user_session
from featureflags.services.oidc_auth import (
    InvalidTokenError,
    OidcAuthenticator,
)
from featureflags.web.container import Container

log = logging.getLogger(__name__)

router = APIRouter(prefix="/oidc", tags=["oidc"])

STATE_COOKIE = "oidc_state"
STATE_TTL_SECONDS = 600


def _fernet() -> Fernet:
    # Fernet requires a 32-byte url-safe base64 key; derive deterministically
    # from "config.secret" so restarts decrypt in-flight state cookies.
    key = base64.urlsafe_b64encode(
        hashlib.sha256(config.secret.encode("utf-8")).digest()
    )
    return Fernet(key)


def _encode_state(payload: dict) -> str:
    # Encrypted (not just signed) because the payload carries the PKCE
    # "verifier" — exposing it off-channel would defeat PKCE protection
    # against authorization-code interception.
    return _fernet().encrypt(json.dumps(payload).encode("utf-8")).decode("ascii")


def _decode_state(token: str) -> dict:
    raw = _fernet().decrypt(token.encode("ascii"), ttl=STATE_TTL_SECONDS)
    return json.loads(raw)


def _make_pkce() -> tuple[str, str]:
    verifier = secrets.token_urlsafe(64)
    digest = hashlib.sha256(verifier.encode("ascii")).digest()
    challenge = base64.urlsafe_b64encode(digest).rstrip(b"=").decode("ascii")
    return verifier, challenge


def _redirect_uri(request: Request, provider_name: str) -> str:
    return (
        f"{request.url.scheme}://{request.url.netloc}"
        f"/oidc/{provider_name}/callback"
    )


def _load_state(
    request: Request, provider_name: str, expected_state: str
) -> dict:
    cookie_value = request.cookies.get(STATE_COOKIE)
    if not cookie_value:
        raise HTTPException(
            400,
            "Missing state cookie — login flow expired or third-party cookies blocked",
        )
    try:
        state_data = _decode_state(cookie_value)
    except InvalidToken as e:
        raise HTTPException(400, "Invalid or expired state cookie") from e
    if state_data.get("state") != expected_state:
        raise HTTPException(400, "State mismatch — possible CSRF")
    if state_data.get("provider") != provider_name:
        raise HTTPException(
            400, "Provider mismatch — callback URL differs from login URL"
        )
    return state_data


def _safe_next_url(raw: str | None) -> str:
    candidate = raw or "/"
    if not candidate.startswith("/") or candidate.startswith("//"):
        return "/"
    return candidate


@router.get("/{provider_name}/login")
@inject
async def oidc_login(
    provider_name: str,
    request: Request,
    next: str = "/",  # noqa: A002 — query param name is conventional
    oidc_authenticators: dict[str, OidcAuthenticator] = Depends(
        Provide[Container.oidc_authenticators]
    ),
) -> RedirectResponse:
    authenticator = oidc_authenticators.get(provider_name)
    if authenticator is None:
        raise HTTPException(404, f"Unknown OIDC provider: {provider_name!r}")

    web_client = authenticator.provider.web_client
    if web_client is None:
        raise HTTPException(
            500,
            f"Provider {provider_name!r} has no non-read-only "
            "(web) client configured.",
        )

    redirect_uri = _redirect_uri(request, provider_name)
    state = secrets.token_urlsafe(32)
    verifier, challenge = _make_pkce()
    nonce = secrets.token_urlsafe(16)

    try:
        authorize_url = await authenticator.build_authorize_url(
            client_id=web_client.id,
            redirect_uri=redirect_uri,
            state=state,
            code_challenge=challenge,
            nonce=nonce,
        )
    except InvalidTokenError as e:
        raise HTTPException(500, str(e)) from e

    state_cookie = _encode_state(
        {
            "provider": provider_name,
            "state": state,
            "verifier": verifier,
            "client_id": web_client.id,
            "redirect_uri": redirect_uri,
            "nonce": nonce,
            "next": next,
        },
    )

    response = RedirectResponse(authorize_url, status_code=302)
    response.set_cookie(
        STATE_COOKIE,
        state_cookie,
        max_age=STATE_TTL_SECONDS,
        httponly=True,
        secure=not config.debug,
        samesite="lax",
        path="/",
    )
    return response


@router.get("/{provider_name}/callback")
@inject
async def oidc_callback(
    provider_name: str,
    request: Request,
    code: str | None = None,
    state: str | None = None,
    error: str | None = None,
    error_description: str | None = None,
    oidc_authenticators: dict[str, OidcAuthenticator] = Depends(
        Provide[Container.oidc_authenticators]
    ),
    db_engine: aiopg.sa.Engine = Depends(Provide[Container.db_engine]),
) -> RedirectResponse:
    if error:
        msg = (
            error if not error_description else f"{error}: {error_description}"
        )
        raise HTTPException(400, f"OIDC error: {msg}")
    if not code or not state:
        raise HTTPException(400, "Missing 'code' or 'state' in callback")

    state_data = _load_state(request, provider_name, state)

    authenticator = oidc_authenticators.get(provider_name)
    if authenticator is None:
        raise HTTPException(404, f"Unknown OIDC provider: {provider_name!r}")

    client_id = state_data["client_id"]
    client = authenticator.provider.client_by_id.get(client_id)
    client_secret = client.client_secret if client else None

    try:
        id_token_str = await authenticator.exchange_code(
            client_id=client_id,
            client_secret=client_secret,
            code=code,
            code_verifier=state_data["verifier"],
            redirect_uri=state_data["redirect_uri"],
        )
        principal = await authenticator.authenticate(
            token=id_token_str, engine=db_engine,
        )
    except InvalidTokenError as e:
        log.warning("OIDC callback rejected: %s", e)
        raise HTTPException(401, str(e)) from e

    if principal.read_only:
        raise HTTPException(
            403,
            "Read-only OIDC clients cannot establish a web session.",
        )

    session = user_session.get()
    now = datetime.now(UTC)
    expiration_time = now + AUTH_SESSION_TTL
    async with db_engine.acquire() as conn:
        await conn.execute(
            insert(AuthSession.__table__)
            .values(
                {
                    AuthSession.session: session.ident,
                    AuthSession.auth_user: principal.user_id,
                    AuthSession.creation_time: now,
                    AuthSession.expiration_time: expiration_time,
                }
            )
            .on_conflict_do_update(
                index_elements=[AuthSession.session],
                set_={
                    AuthSession.auth_user.name: principal.user_id,
                    AuthSession.expiration_time.name: expiration_time,
                },
            )
        )

    # Mutate the context-var session in place; "set_user_session_to_response"
    # in the middleware writes the renewed access-token cookie on the way out.
    session.sign_in(principal.user_id, expiration_time)

    next_url = _safe_next_url(state_data.get("next"))
    response = RedirectResponse(quote(next_url, safe="/?&=#"), status_code=302)
    response.delete_cookie(STATE_COOKIE, path="/")
    return response
