import base64
import time
from dataclasses import dataclass
from typing import Any

import jwt
import pytest
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from sqlalchemy import select

from featureflags.config import OidcClient, OidcProvider
from featureflags.errors import (
    ReadOnlySessionError,
    UserNotAuthorizedError,
)
from featureflags.models import AuthUser
from featureflags.services.auth import (
    BaseUserSession,
    auth_required,
    user_session,
)
from featureflags.services.oidc_auth import (
    InvalidTokenError,
    OidcAuthenticator,
    get_or_create_oidc_user,
    make_oidc_subject,
)
from featureflags.tests.state import mk_auth_user
from featureflags.utils import select_first


@dataclass
class IdpKey:
    pem: bytes
    public_jwk: jwt.PyJWK
    kid: str


@pytest.fixture(scope="module")
def idp_key() -> IdpKey:
    private = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    public = private.public_key()
    pem = private.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption(),
    )
    numbers = public.public_numbers()

    def to_b64url(n: int) -> str:
        b = n.to_bytes((n.bit_length() + 7) // 8, "big")
        return base64.urlsafe_b64encode(b).rstrip(b"=").decode("ascii")

    kid = "test-key"
    jwk_dict = {
        "kty": "RSA",
        "kid": kid,
        "use": "sig",
        "alg": "RS256",
        "n": to_b64url(numbers.n),
        "e": to_b64url(numbers.e),
    }
    return IdpKey(pem=pem, public_jwk=jwt.PyJWK(jwk_dict), kid=kid)


@pytest.fixture
def provider() -> OidcProvider:
    return OidcProvider(
        name="testidp",
        issuer="https://test.example",
        jwks_uri="https://test.example/jwks",
        authorization_endpoint="https://test.example/authorize",
        token_endpoint="https://test.example/token",
        allowed_email_domains=["vchasno.ua"],
        clients=[
            OidcClient(
                id="web-client",
                name="web",
                read_only=False,
                client_secret="secret",
            ),
            OidcClient(id="cli-client", name="cli", read_only=True),
        ],
    )


@pytest.fixture
def authenticator(provider: OidcProvider, idp_key: IdpKey) -> OidcAuthenticator:
    """Pre-populated authenticator so verify_token() does no I/O."""
    a = OidcAuthenticator(provider)
    a._jwks = {idp_key.kid: idp_key.public_jwk}
    a._jwks_fetched_at = time.monotonic()
    return a


def mint_token(
    idp_key: IdpKey,
    *,
    aud: str = "web-client",
    email: str = "alice@vchasno.ua",
    sub: str = "user-1",
    iss: str = "https://test.example",
    exp_in: int = 3600,
    extra: dict[str, Any] | None = None,
) -> str:
    now = int(time.time())
    payload = {
        "iss": iss,
        "sub": sub,
        "aud": aud,
        "iat": now,
        "exp": now + exp_in,
        "email": email,
        "email_verified": True,
    }
    if extra:
        payload.update(extra)
    return jwt.encode(
        payload,
        idp_key.pem,
        algorithm="RS256",
        headers={"kid": idp_key.kid},
    )


@pytest.mark.asyncio
async def test_verify_token_success(
    authenticator: OidcAuthenticator, idp_key: IdpKey
):
    token = mint_token(idp_key)
    claims, client_name, read_only = await authenticator.verify_token(token)
    assert claims["email"] == "alice@vchasno.ua"
    assert client_name == "web"
    assert read_only is False


@pytest.mark.asyncio
async def test_verify_token_read_only_client(
    authenticator: OidcAuthenticator, idp_key: IdpKey
):
    token = mint_token(idp_key, aud="cli-client")
    _claims, client_name, read_only = await authenticator.verify_token(token)
    assert client_name == "cli"
    assert read_only is True


@pytest.mark.asyncio
async def test_verify_token_unknown_audience(
    authenticator: OidcAuthenticator, idp_key: IdpKey
):
    token = mint_token(idp_key, aud="some-other-client")
    with pytest.raises(InvalidTokenError):
        await authenticator.verify_token(token)


@pytest.mark.asyncio
async def test_verify_token_bad_issuer(
    authenticator: OidcAuthenticator, idp_key: IdpKey
):
    token = mint_token(idp_key, iss="https://evil.example")
    with pytest.raises(InvalidTokenError):
        await authenticator.verify_token(token)


@pytest.mark.asyncio
async def test_verify_token_expired(
    authenticator: OidcAuthenticator, idp_key: IdpKey
):
    token = mint_token(idp_key, exp_in=-3600)
    with pytest.raises(InvalidTokenError):
        await authenticator.verify_token(token)


@pytest.mark.asyncio
async def test_verify_token_disallowed_domain(
    authenticator: OidcAuthenticator, idp_key: IdpKey
):
    token = mint_token(idp_key, email="stranger@gmail.com")
    with pytest.raises(InvalidTokenError):
        await authenticator.verify_token(token)


@pytest.mark.asyncio
async def test_verify_token_no_email_when_domain_required(
    authenticator: OidcAuthenticator, idp_key: IdpKey
):
    # Mint without the email claim — provider has allowed_email_domains, so reject.
    now = int(time.time())
    payload = {
        "iss": "https://test.example",
        "sub": "user-1",
        "aud": "web-client",
        "iat": now,
        "exp": now + 3600,
    }
    token = jwt.encode(
        payload, idp_key.pem, algorithm="RS256", headers={"kid": idp_key.kid}
    )
    with pytest.raises(InvalidTokenError):
        await authenticator.verify_token(token)


@pytest.mark.asyncio
async def test_verify_token_unverified_email_when_domain_required(
    authenticator: OidcAuthenticator, idp_key: IdpKey
):
    # Domain policy is configured; an "email_verified=false" token must be
    # rejected so attackers can't self-assert another user's email.
    token = mint_token(idp_key, extra={"email_verified": False})
    with pytest.raises(InvalidTokenError):
        await authenticator.verify_token(token)


@pytest.mark.asyncio
async def test_verify_token_unknown_kid(
    authenticator: OidcAuthenticator, idp_key: IdpKey
):
    now = int(time.time())
    payload = {
        "iss": "https://test.example",
        "sub": "user-1",
        "aud": "web-client",
        "iat": now,
        "exp": now + 3600,
        "email": "alice@vchasno.ua",
    }
    # Sign with a key whose kid is not in the JWKS cache.
    token = jwt.encode(
        payload,
        idp_key.pem,
        algorithm="RS256",
        headers={"kid": "rotated-key"},
    )
    # Authenticator should attempt a refresh; rate-limited until cooldown,
    # so we expect rejection without network access in this fixture setup.
    with pytest.raises(InvalidTokenError):
        await authenticator.verify_token(token)


@pytest.mark.asyncio
async def test_authenticate_creates_new_user(
    authenticator: OidcAuthenticator, idp_key: IdpKey, db_engine
):
    token = mint_token(
        idp_key, email="brand-new@vchasno.ua", sub="external-id-42"
    )
    principal = await authenticator.authenticate(token, engine=db_engine)
    assert principal.provider == "testidp"
    assert principal.client_name == "web"
    assert principal.read_only is False
    # The created user should be looked up by oidc_subject.
    expected = make_oidc_subject("testidp", "external-id-42")
    async with db_engine.acquire() as conn:
        row = await select_first(
            conn, select([AuthUser.id]).where(AuthUser.oidc_subject == expected)
        )
    assert row is not None
    assert row.id == principal.user_id


@pytest.mark.asyncio
async def test_authenticate_links_existing_ldap_user(
    authenticator: OidcAuthenticator, idp_key: IdpKey, db_engine
):
    """
    An existing AuthUser created by LDAP (no oidc_subject) should be linked
    on first Google sign-in, not duplicated.
    """
    existing = await mk_auth_user(db_engine, username="linked@vchasno.ua")
    token = mint_token(idp_key, email=existing.username, sub="linked-sub-1")
    principal = await authenticator.authenticate(token, engine=db_engine)
    assert principal.user_id == existing.id

    # And the oidc_subject column is now populated for that user.
    async with db_engine.acquire() as conn:
        row = await select_first(
            conn,
            select([AuthUser.oidc_subject]).where(AuthUser.id == existing.id),
        )
    assert row.oidc_subject == make_oidc_subject("testidp", "linked-sub-1")


@pytest.mark.asyncio
async def test_build_authorize_url(authenticator: OidcAuthenticator):
    url = await authenticator.build_authorize_url(
        client_id="web-client",
        redirect_uri="https://app.test/oidc/testidp/callback",
        state="STATE-X",
        code_challenge="CHALLENGE-X",
        nonce="N-X",
    )
    assert url.startswith("https://test.example/authorize?")
    assert "response_type=code" in url
    assert "client_id=web-client" in url
    assert "state=STATE-X" in url
    assert "code_challenge=CHALLENGE-X" in url
    assert "code_challenge_method=S256" in url
    assert "nonce=N-X" in url


class _ReadOnlySession(BaseUserSession):
    @property
    def is_authenticated(self) -> bool:
        return True

    @property
    def is_read_only(self) -> bool:
        return True


class _ReadWriteSession(BaseUserSession):
    @property
    def is_authenticated(self) -> bool:
        return True

    @property
    def is_read_only(self) -> bool:
        return False


class _Unauthenticated(BaseUserSession):
    @property
    def is_authenticated(self) -> bool:
        return False


@pytest.mark.asyncio
async def test_auth_required_rejects_unauthenticated():
    @auth_required
    async def mutate() -> str:
        return "ok"

    user_session.set(_Unauthenticated())  # type: ignore[arg-type]
    with pytest.raises(UserNotAuthorizedError):
        await mutate()


@pytest.mark.asyncio
async def test_auth_required_rejects_read_only():
    @auth_required
    async def mutate() -> str:
        return "ok"

    user_session.set(_ReadOnlySession())  # type: ignore[arg-type]
    with pytest.raises(ReadOnlySessionError):
        await mutate()


@pytest.mark.asyncio
async def test_auth_required_allows_read_write():
    @auth_required
    async def mutate() -> str:
        return "ok"

    user_session.set(_ReadWriteSession())  # type: ignore[arg-type]
    assert await mutate() == "ok"


@pytest.mark.asyncio
async def test_get_or_create_oidc_user_is_idempotent(db_engine):
    user_id_1 = await get_or_create_oidc_user(
        db_engine,
        provider="testidp",
        sub="stable-sub",
        email="someone@vchasno.ua",
    )
    user_id_2 = await get_or_create_oidc_user(
        db_engine,
        provider="testidp",
        sub="stable-sub",
        email="someone@vchasno.ua",
    )
    assert user_id_1 == user_id_2
