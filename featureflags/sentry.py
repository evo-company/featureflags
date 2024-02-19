import logging

from fastapi import FastAPI

try:
    import sentry_sdk
    from sentry_sdk.integrations.asgi import SentryAsgiMiddleware
    from sentry_sdk.integrations.asyncio import AsyncioIntegration
    from sentry_sdk.integrations.atexit import AtexitIntegration
    from sentry_sdk.integrations.dedupe import DedupeIntegration
    from sentry_sdk.integrations.excepthook import ExcepthookIntegration
    from sentry_sdk.integrations.grpc import GRPCIntegration
    from sentry_sdk.integrations.logging import LoggingIntegration
    from sentry_sdk.integrations.stdlib import StdlibIntegration
    from sentry_sdk.integrations.threading import ThreadingIntegration
    from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
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
    app: FastAPI | None = None,
) -> None:
    """
    Configure error logging to Sentry.
    """

    env = f"{env_prefix}-{config.env}" if env_prefix else config.env

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
        integrations=[
            AsyncioIntegration(),
            AtexitIntegration(),
            ExcepthookIntegration(),
            DedupeIntegration(),
            StdlibIntegration(),
            ThreadingIntegration(),
            LoggingIntegration(),
            GRPCIntegration(),
            SqlalchemyIntegration(),
        ],
    )

    if app is not None:
        # Add FastApi specific middleware.
        app.add_middleware(SentryAsgiMiddleware)

    log.info(f"Sentry initialized with env: `{env}`")
