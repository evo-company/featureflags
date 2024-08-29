from fastapi import FastAPI
from fastapi.responses import ORJSONResponse

from featureflags.config import config
from featureflags.http.api.flags import router as flags_router
from featureflags.http.api.health import router as health_router
from featureflags.http.container import Container
from featureflags.http.lifecycle import configure_lifecycle
from featureflags.metrics import configure_metrics
from featureflags.services.auth import set_internal_user_session


def create_app() -> FastAPI:
    app = FastAPI(
        debug=config.debug,
        default_response_class=ORJSONResponse,
    )

    container = Container()
    app.container = container  # type: ignore

    app.include_router(health_router)
    app.include_router(flags_router)

    set_internal_user_session()

    configure_metrics(port=config.instrumentation.prometheus_port, app=app)
    configure_lifecycle(app, container)

    if config.sentry.enabled:
        from featureflags.sentry import SentryMode, configure_sentry

        configure_sentry(config.sentry, env_prefix="http", mode=SentryMode.HTTP)

    return app


def main() -> None:
    import uvicorn

    uvicorn.run(
        app="featureflags.http.app:create_app",
        factory=True,
        host=config.http.host,
        port=config.http.port,
        loop="uvloop",
        http="httptools",
        reload=config.http.reload,
        log_level="debug" if config.debug else "info",
    )
