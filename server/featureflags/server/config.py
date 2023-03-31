import yaml

from pydantic import BaseSettings, Extra, Field


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
    user: str = Field("postgres", env="PGUSER")
    password: str = Field("postgres", env="PGPASS")
    database: str

    @property
    def dsn(self):
        return f"postgresql://{self.user}:{self.password}@{self.host}:{self.port}/{self.database}"


class LdapSettings(BaseSettings):
    host: str | None
    base_dn: str | None


class Config(BaseSettings):
    debug: bool
    secret: str = Field("secret", env="SECRET")
    postgres: PostgresSettings
    ldap: LdapSettings
    logging: LoggingSettings


def load_config(path: str) -> Config:
    with open(path, "r") as f:
        data = yaml.load(f, Loader=yaml.FullLoader)
    return Config(**data)
