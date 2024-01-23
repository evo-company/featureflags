from fastapi import FastAPI
from fastapi.responses import ORJSONResponse
from fastapi.staticfiles import StaticFiles

from featureflags.config import config
from featureflags.container import Container
from featureflags.metrics import configure_metrics
from featureflags.web.api.graph import router as graphql_router
from featureflags.web.api.health import router as health_router
from featureflags.web.api.index import STATIC_DIR
from featureflags.web.api.index import router as index_router
from featureflags.web.lifecycle import configure_lifecycle
from featureflags.web.middlewares import configure_middlewares


def create_app() -> FastAPI:
    app = FastAPI(
        debug=config.debug,
        default_response_class=ORJSONResponse,
    )

    container = Container()
    app.container = container  # type: ignore

    app.include_router(health_router)
    app.include_router(index_router)
    app.include_router(graphql_router)

    static_files = StaticFiles(
        directory=STATIC_DIR,
        check_dir=not config.debug,
        html=True,
    )
    app.mount("/static", static_files, name="static")

    configure_metrics(port=config.instrumentation.prometheus_port)
    configure_middlewares(app, container)
    configure_lifecycle(app, container)

    return app


def main() -> None:
    import uvicorn

    uvicorn.run(
        app="featureflags.web.app:create_app",
        factory=True,
        host=config.app.host,
        port=config.app.port,
        loop="uvloop",
        http="httptools",
        reload=config.app.reload,
    )
