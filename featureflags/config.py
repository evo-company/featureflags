import logging
import os
import re
from pathlib import Path

import yaml
from pydantic import Field, model_validator
from pydantic_settings import BaseSettings

log = logging.getLogger(__name__)

CONFIG_PATH_ENV_VAR = "CONFIG_PATH"

CONFIGS_DIR = Path().parent / "configs"
DEFAULT_CONFIG_PATH = CONFIGS_DIR / "local.yaml"

_ENV_VAR_PATTERN = re.compile(
    r"\$\{([A-Za-z_]\w*)\}|\$([A-Za-z_]\w*)"
)


def _resolve_env_match(match: re.Match[str]) -> str:
    env_name = match.group(1) or match.group(2)
    try:
        return os.environ[env_name]
    except KeyError as e:
        raise ValueError(
            f"Config references env var {env_name!r}, "
            "but it is not set in the environment."
        ) from e


class LoggingSettings(BaseSettings):
    level_app: str
    level_libs: str
    handlers: list[str]
    syslog_app: str | None
    syslog_facility: str | None
    syslog_mapping: dict | None
    syslog_defaults: dict | None


class PostgresSettings(BaseSettings):
    host: str
    port: int
    user: str = Field(..., alias="PGUSER")
    password: str = Field(..., alias="PGPASS")
    database: str
    timeout: int = 10

    @property
    def dsn(self) -> str:
        return (
            f"postgresql://{self.user}"
            f":{self.password}"
            f"@{self.host}"
            f":{self.port}"
            f"/{self.database}"
        )


class LdapAuthSettings(BaseSettings):
    host: str
    base_dn: str


class OidcClient(BaseSettings):
    id: str
    name: str
    read_only: bool = False
    # Confidential clients (most web clients) have a secret used at the
    # token-exchange step. Public clients (e.g. CLI device-code) leave it null
    # and rely on PKCE alone.
    client_secret: str | None = None

    @model_validator(mode="after")
    def _resolve_secret_from_env(self) -> "OidcClient":
        # "$VAR" / "${VAR}" so the secret can come from an env var (typically
        # a K8s Secret) instead of being inlined in the Git-tracked YAML.
        if self.client_secret:
            self.client_secret = _ENV_VAR_PATTERN.sub(
                _resolve_env_match, self.client_secret
            )
        return self


class OidcProvider(BaseSettings):
    """
    Configuration for one OpenID Connect identity provider (Google, Microsoft
    Entra ID, Auth0, Okta, Keycloak, …). Every IdP that follows the OIDC spec
    works with the same verification code; only "issuer" / endpoints / clients
    differ.

    When the three explicit endpoint fields are omitted, they are discovered
    from "{issuer}/.well-known/openid-configuration" on first use.

    Splitting "authorization_endpoint" from the others is useful in test
    setups where the browser and the server reach the IdP through different
    URLs (e.g. "http://localhost:9000" vs "http://mock-oidc:9000" inside a
    docker network).
    """

    name: str
    display_name: str | None = None
    issuer: str
    jwks_uri: str | None = None
    authorization_endpoint: str | None = None
    token_endpoint: str | None = None
    # If non-empty, the email domain on the verified ID token must be one of
    # these values. Replaces the Google-only "hd" claim check.
    allowed_email_domains: list[str] = Field(default_factory=list)
    clients: list[OidcClient] = Field(default_factory=list)

    @property
    def client_by_id(self) -> dict[str, OidcClient]:
        return {c.id: c for c in self.clients}

    @property
    def web_client(self) -> OidcClient | None:
        """First non-read-only client — the one used for the cookie flow."""
        for c in self.clients:
            if not c.read_only:
                return c
        return None


class OidcAuthSettings(BaseSettings):
    providers: list[OidcProvider] = Field(default_factory=list)

    @property
    def enabled(self) -> bool:
        return bool(self.providers)


class InstrumentationSettings(BaseSettings):
    prometheus_port: int | None = None


class AppSettings(BaseSettings):
    port: int = 8080
    host: str = "0.0.0.0"
    reload: bool = False
    max_concurrent_threads: int = 40


class HttpSettings(BaseSettings):
    port: int = 8081
    host: str = "0.0.0.0"
    reload: bool = False
    max_concurrent_threads: int = 40


class SentrySettings(BaseSettings):
    enabled: bool = False
    dsn: str | None = None
    env: str | None = None
    enable_tracing: bool = True
    traces_sample_rate: float = 1.0
    shutdown_timeout: int = 1


class Config(BaseSettings):
    debug: bool
    secret: str = Field(..., alias="SECRET")
    test_environ: bool = False

    postgres: PostgresSettings
    ldap: LdapAuthSettings | None = None
    oidc: OidcAuthSettings | None = None
    logging: LoggingSettings
    instrumentation: InstrumentationSettings
    sentry: SentrySettings

    app: AppSettings
    http: HttpSettings

    @model_validator(mode="after")
    def _require_at_least_one_auth_method(self) -> "Config":
        if self.ldap is None and (self.oidc is None or not self.oidc.providers):
            raise ValueError(
                "At least one authentication method must be configured: "
                "set 'ldap' (host + base_dn) or 'oidc' (with at least one "
                "provider in 'oidc.providers')."
            )
        return self


def _load_config() -> Config:
    config_path = os.environ.get(CONFIG_PATH_ENV_VAR, DEFAULT_CONFIG_PATH)
    log.info("Reading config from %s", config_path)

    with open(config_path) as f:
        config_data = yaml.safe_load(f)

    return Config(**config_data)


config = _load_config()
