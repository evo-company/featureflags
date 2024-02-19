import logging
import os
from pathlib import Path

import yaml
from pydantic import Field
from pydantic_settings import BaseSettings

log = logging.getLogger(__name__)

CONFIG_PATH_ENV_VAR = "CONFIG_PATH"

CONFIGS_DIR = Path().parent / "configs"
DEFAULT_CONFIG_PATH = CONFIGS_DIR / "local.yaml"


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


class LdapSettings(BaseSettings):
    host: str | None
    base_dn: str | None


class InstrumentationSettings(BaseSettings):
    prometheus_port: int | None = None


class AppSettings(BaseSettings):
    port: int = 8000
    host: str = "0.0.0.0"
    reload: bool = False
    max_concurrent_threads: int = 40


class HttpSettings(BaseSettings):
    port: int = 8080
    host: str = "0.0.0.0"
    reload: bool = False
    max_concurrent_threads: int = 40


class RpcSettings(BaseSettings):
    port: int = 8000
    host: str = "0.0.0.0"


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
    ldap: LdapSettings
    logging: LoggingSettings
    instrumentation: InstrumentationSettings
    sentry: SentrySettings

    app: AppSettings
    rpc: RpcSettings
    http: HttpSettings


def _load_config() -> Config:
    config_path = os.environ.get(CONFIG_PATH_ENV_VAR, DEFAULT_CONFIG_PATH)
    log.info("Reading config from %s", config_path)

    with open(config_path) as f:
        config_data = yaml.safe_load(f)

    return Config(**config_data)


config = _load_config()
