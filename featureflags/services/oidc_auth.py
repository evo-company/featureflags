"""
Generic OpenID Connect authenticator.

Verifies an ID token (JWT) issued by any OIDC-compliant identity provider
(Google, Microsoft Entra ID, Auth0, Okta, Keycloak, …) against a configured
issuer + JWKS URI + audience list. Each configured client carries a
"read_only" flag — for example, a desktop/CLI client can be marked read-only
so the server rejects mutations from tokens it issued.

The verifier is provider-agnostic: any new IdP is a new entry in
"auth.oidc.providers" config — no code change.

Networking is fully async (httpx). The JWKS is fetched lazily on first use
and cached in memory with a TTL; rotation is detected by a "kid" miss, which
triggers a fresh fetch (rate-limited so a stream of bogus tokens cannot
hammer the IdP).
"""

import asyncio
import logging
import time
from dataclasses import dataclass
from urllib.parse import urlencode
from uuid import UUID, uuid4

import aiopg.sa
import httpx
import jwt
from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert

from featureflags.config import OidcProvider
from featureflags.models import AuthUser
from featureflags.utils import select_first

log = logging.getLogger(__name__)

CLOCK_SKEW_SECONDS = 10
HTTP_TIMEOUT_SECONDS = 5
JWKS_MAX_AGE_SECONDS = 3600
JWKS_REFRESH_COOLDOWN_SECONDS = 60


class InvalidTokenError(Exception):
    """Token failed OIDC verification."""


@dataclass(frozen=True)
class AuthenticatedPrincipal:
    user_id: UUID
    provider: str
    client_name: str | None
    read_only: bool


class OidcAuthenticator:
    def __init__(self, provider: OidcProvider) -> None:
        self._provider = provider
        self._client_by_aud = provider.client_by_id
        if not self._client_by_aud:
            raise ValueError(
                f"OIDC provider {provider.name!r} has no clients configured"
            )

        # Long-lived async HTTP client. httpx keeps a connection pool; it's
        # safe to share across requests from any coroutine on the loop.
        self._http = httpx.AsyncClient(timeout=HTTP_TIMEOUT_SECONDS)

        # Endpoint URIs — populated from config or discovered from
        # "{issuer}/.well-known/openid-configuration" on first use.
        self._jwks_uri: str | None = provider.jwks_uri
        self._authorization_endpoint: str | None = (
            provider.authorization_endpoint
        )
        self._token_endpoint: str | None = provider.token_endpoint

        self._jwks: dict[str, jwt.PyJWK] = {}
        self._jwks_fetched_at: float = 0.0
        self._jwks_lock = asyncio.Lock()
        self._endpoints_lock = asyncio.Lock()

    @property
    def name(self) -> str:
        return self._provider.name

    @property
    def provider(self) -> OidcProvider:
        return self._provider

    async def aclose(self) -> None:
        await self._http.aclose()

    async def _ensure_endpoints(self) -> None:
        """
        Populate any of "jwks_uri", "authorization_endpoint",
        "token_endpoint" that the provider config didn't supply by fetching
        "{issuer}/.well-known/openid-configuration". Idempotent.
        """
        if all(
            x is not None
            for x in (
                self._jwks_uri,
                self._authorization_endpoint,
                self._token_endpoint,
            )
        ):
            return
        async with self._endpoints_lock:
            if all(
                x is not None
                for x in (
                    self._jwks_uri,
                    self._authorization_endpoint,
                    self._token_endpoint,
                )
            ):
                return
            url = (
                f"{self._provider.issuer.rstrip('/')}"
                "/.well-known/openid-configuration"
            )
            log.info("Discovering OIDC config: %s", url)
            try:
                resp = await self._http.get(url)
                resp.raise_for_status()
            except httpx.HTTPError as e:
                raise InvalidTokenError(
                    f"Failed to discover OIDC config at {url}: {e}"
                ) from e
            data = resp.json()
            self._jwks_uri = self._jwks_uri or data.get("jwks_uri")
            self._authorization_endpoint = (
                self._authorization_endpoint
                or data.get("authorization_endpoint")
            )
            self._token_endpoint = self._token_endpoint or data.get(
                "token_endpoint"
            )
            if not self._jwks_uri:
                raise InvalidTokenError(
                    f"OIDC discovery missing 'jwks_uri': {url}"
                )

    async def _ensure_jwks_uri(self) -> str:
        await self._ensure_endpoints()
        assert self._jwks_uri is not None
        return self._jwks_uri

    async def _fetch_jwks(self) -> None:
        """
        Replace the in-memory JWKS cache with a fresh fetch. Caller must
        hold "_jwks_lock".
        """
        jwks_uri = await self._ensure_jwks_uri()
        try:
            resp = await self._http.get(jwks_uri)
            resp.raise_for_status()
        except httpx.HTTPError as e:
            raise InvalidTokenError(
                f"Failed to fetch JWKS from {jwks_uri}: {e}"
            ) from e
        data = resp.json()
        new_keys: dict[str, jwt.PyJWK] = {}
        for jwk_dict in data.get("keys", []):
            try:
                pyjwk = jwt.PyJWK(jwk_dict)
            except Exception as e:  # noqa: BLE001
                log.warning("Skipping malformed JWK from %s: %s", jwks_uri, e)
                continue
            kid = pyjwk.key_id or jwk_dict.get("kid")
            if kid:
                new_keys[kid] = pyjwk
        if not new_keys:
            raise InvalidTokenError(
                f"JWKS from {jwks_uri} contained no usable keys"
            )
        self._jwks = new_keys
        self._jwks_fetched_at = time.monotonic()

    async def _get_signing_key(self, kid: str) -> jwt.PyJWK:
        now = time.monotonic()
        if (
            kid in self._jwks
            and (now - self._jwks_fetched_at) < JWKS_MAX_AGE_SECONDS
        ):
            return self._jwks[kid]

        async with self._jwks_lock:
            now = time.monotonic()
            # Another coroutine may have refreshed while we waited.
            if (
                kid in self._jwks
                and (now - self._jwks_fetched_at) < JWKS_MAX_AGE_SECONDS
            ):
                return self._jwks[kid]

            # Rate-limit refreshes so a flood of bogus tokens with random
            # "kid" values cannot hammer the IdP.
            if (
                self._jwks
                and (now - self._jwks_fetched_at)
                < JWKS_REFRESH_COOLDOWN_SECONDS
            ):
                raise InvalidTokenError(f"Unknown signing key: {kid!r}")

            await self._fetch_jwks()
            if kid not in self._jwks:
                raise InvalidTokenError(f"Unknown signing key: {kid!r}")
            return self._jwks[kid]

    async def verify_token(self, token: str) -> tuple[dict, str, bool]:
        """
        Verify an ID token. Returns (claims, client_name, read_only).
        Raises "InvalidTokenError" on any failure.
        """
        try:
            header = jwt.get_unverified_header(token)
        except jwt.PyJWTError as e:
            raise InvalidTokenError(f"Invalid JWT header: {e}") from e
        kid = header.get("kid")
        if not kid:
            raise InvalidTokenError("Token header missing 'kid'")

        pyjwk = await self._get_signing_key(kid)

        try:
            claims = jwt.decode(
                token,
                pyjwk.key,
                algorithms=["RS256", "ES256"],
                audience=list(self._client_by_aud.keys()),
                issuer=self._provider.issuer,
                leeway=CLOCK_SKEW_SECONDS,
            )
        except jwt.PyJWTError as e:
            raise InvalidTokenError(f"Invalid ID token: {e}") from e

        aud = claims.get("aud")
        client = self._client_by_aud.get(aud)
        if client is None:
            raise InvalidTokenError(f"Unexpected audience: {aud!r}")

        if not claims.get("sub"):
            raise InvalidTokenError("Token missing 'sub' claim")

        # We always link by email, so an unverified email would let an
        # attacker pick any victim's address — require a verified one.
        email = claims.get("email")
        if not email or "@" not in email or claims.get("email_verified") is not True:
            raise InvalidTokenError("Token missing verified 'email' claim")

        if self._provider.allowed_email_domains:
            domain = email.rsplit("@", 1)[-1].lower()
            allowed = {d.lower() for d in self._provider.allowed_email_domains}
            if domain not in allowed:
                raise InvalidTokenError(f"Email domain not allowed: {domain!r}")

        return claims, client.name, client.read_only

    async def authenticate(
        self,
        token: str,
        *,
        engine: aiopg.sa.Engine,
    ) -> AuthenticatedPrincipal:
        claims, client_name, read_only = await self.verify_token(token)
        user_id = await get_or_create_oidc_user(
            engine,
            provider=self._provider.name,
            sub=claims["sub"],
            email=claims["email"],
        )
        return AuthenticatedPrincipal(
            user_id=user_id,
            provider=self._provider.name,
            client_name=client_name,
            read_only=read_only,
        )

    async def build_authorize_url(
        self,
        *,
        client_id: str,
        redirect_uri: str,
        state: str,
        code_challenge: str,
        scope: str = "openid email profile",
        nonce: str | None = None,
    ) -> str:
        """Construct the URL the browser is redirected to for the
        Authorization Code + PKCE flow."""
        await self._ensure_endpoints()
        if not self._authorization_endpoint:
            raise InvalidTokenError(
                f"Provider {self._provider.name!r} has no "
                "'authorization_endpoint' configured or discovered"
            )
        params = {
            "response_type": "code",
            "client_id": client_id,
            "redirect_uri": redirect_uri,
            "scope": scope,
            "state": state,
            "code_challenge": code_challenge,
            "code_challenge_method": "S256",
        }
        if nonce:
            params["nonce"] = nonce
        return f"{self._authorization_endpoint}?{urlencode(params)}"

    async def exchange_code(
        self,
        *,
        client_id: str,
        client_secret: str | None,
        code: str,
        code_verifier: str,
        redirect_uri: str,
    ) -> str:
        """
        Exchange an authorization code for an ID token at the provider's
        token endpoint. Returns the raw ID token string (not yet verified —
        caller should run it through "authenticate()").
        """
        await self._ensure_endpoints()
        if not self._token_endpoint:
            raise InvalidTokenError(
                f"Provider {self._provider.name!r} has no "
                "'token_endpoint' configured or discovered"
            )
        data = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": redirect_uri,
            "client_id": client_id,
            "code_verifier": code_verifier,
        }
        if client_secret:
            data["client_secret"] = client_secret
        try:
            resp = await self._http.post(self._token_endpoint, data=data)
            resp.raise_for_status()
        except httpx.HTTPError as e:
            body = (
                e.response.text
                if getattr(e, "response", None) is not None
                else ""
            )
            raise InvalidTokenError(
                f"Token exchange failed at {self._token_endpoint}: {e} {body}"
            ) from e
        body = resp.json()
        id_token = body.get("id_token")
        if not id_token:
            raise InvalidTokenError(
                "Token endpoint response missing 'id_token'"
            )
        return id_token


def make_oidc_subject(provider: str, sub: str) -> str:
    """Compose the provider-namespaced subject stored in "auth_user"."""
    return f"{provider}:{sub}"


async def get_or_create_oidc_user(
    engine: aiopg.sa.Engine,
    *,
    provider: str,
    sub: str,
    email: str | None,
) -> UUID:
    """
    Resolve an OIDC identity to an "AuthUser":
      1. Match on namespaced "oidc_subject" (e.g. "google:11223344").
      2. Fall back to "username" == email (existing LDAP users); link by
         filling "oidc_subject" so future lookups hit step 1.
      3. Create a new row otherwise. Without an email, the username falls
         back to the namespaced subject.
    """
    namespaced_sub = make_oidc_subject(provider, sub)

    async with engine.acquire() as conn:
        row = await select_first(
            conn,
            select([AuthUser.id]).where(
                AuthUser.oidc_subject == namespaced_sub
            ),
        )
        if row is not None:
            return row.id

        if email:
            row = await select_first(
                conn,
                select([AuthUser.id]).where(AuthUser.username == email),
            )
            if row is not None:
                log.warning(
                    "OIDC sign-in linked existing user %r to oidc_subject "
                    "%r via email fallback",
                    email,
                    namespaced_sub,
                )
                await conn.execute(
                    AuthUser.__table__.update()
                    .where(AuthUser.id == row.id)
                    .values({AuthUser.oidc_subject: namespaced_sub})
                )
                return row.id

        username = email or namespaced_sub
        new_id = uuid4()
        await conn.execute(
            insert(AuthUser.__table__)
            .values(
                {
                    AuthUser.id: new_id,
                    AuthUser.username: username,
                    AuthUser.oidc_subject: namespaced_sub,
                }
            )
            .on_conflict_do_nothing()
        )
        row = await select_first(
            conn,
            select([AuthUser.id]).where(AuthUser.username == username),
        )
        assert row is not None
        return row.id
