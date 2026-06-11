import logging

try:
    import sentry_sdk
    from sentry_sdk.integrations.asyncio import AsyncioIntegration
    from sentry_sdk.integrations.atexit import AtexitIntegration
    from sentry_sdk.integrations.dedupe import DedupeIntegration
    from sentry_sdk.integrations.excepthook import ExcepthookIntegration
    from sentry_sdk.integrations.fastapi import FastApiIntegration
    from sentry_sdk.integrations.logging import LoggingIntegration
    from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
    from sentry_sdk.integrations.starlette import StarletteIntegration
    from sentry_sdk.integrations.stdlib import StdlibIntegration
    from sentry_sdk.integrations.threading import ThreadingIntegration
except ImportError:
    raise ImportError(
        "`sentry_sdk` is not installed, please install it to use `sentry` "
        "like this `pip install 'evo-featureflags-server[sentry]'`"
    ) from None

from featureflags import __version__
from featureflags.config import SentrySettings

log = logging.getLogger(__name__)


def configure_sentry(
    config: SentrySettings,
    env_prefix: str | None = None,
) -> None:
    """
    Configure error logging to Sentry.
    """

    env = f"{env_prefix}-{config.env}" if env_prefix else config.env

    integrations = [
        AsyncioIntegration(),
        AtexitIntegration(),
        ExcepthookIntegration(),
        DedupeIntegration(),
        StdlibIntegration(),
        ThreadingIntegration(),
        LoggingIntegration(),
        SqlalchemyIntegration(),
        StarletteIntegration(transaction_style="endpoint"),
        FastApiIntegration(transaction_style="endpoint"),
    ]

    sentry_sdk.init(
        dsn=config.dsn,
        environment=env,
        release=__version__,
        shutdown_timeout=config.shutdown_timeout,
        send_default_pii=True,
        default_integrations=False,
        auto_enabling_integrations=False,
        max_breadcrumbs=1000,
        enable_tracing=config.enable_tracing,
        traces_sample_rate=config.traces_sample_rate,
        integrations=integrations,
    )
    log.info(f"Sentry initialized with env: `{env}`")
