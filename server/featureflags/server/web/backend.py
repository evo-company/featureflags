import logging
import os.path
import pkgutil
import json
from datetime import datetime
from enum import Enum
from functools import partial
from typing import Optional

from uuid import UUID

from sanic import Sanic
from sanic.response import html, text, json as json_response
from sanic.exceptions import NotFound, Unauthorized

from hiku.engine import Engine
from hiku.executors.asyncio import AsyncIOExecutor

from hiku.endpoint.graphql import AsyncBatchGraphQLEndpoint

from .. import metrics
from ..auth import get_session
from ..actions import (
    AccessError,
    DirtyProjects,
    Changes,
)
from ..services.db import get_db
from ..graph.graph import (
    GRAPH,
    SA_ENGINE,
    SESSION,
    MUTATION_GRAPH,
    LDAP,
    DIRTY,
    CHANGES,
    IDS,
)
from ..services.ldap import get_ldap


log = logging.getLogger(__name__)

COOKIE_MAX_AGE = 365 * 24 * 3600


async def on_request(request):
    access_token = request.cookies.get("access_token")
    request.ctx.session = await get_session(
        access_token,
        db=request.app.ctx.sa_engine,
        secret=request.app.ctx.cfg.secret,
    )


async def on_response(request, response):
    if request.ctx.session:
        access_token_cookie = request.ctx.session.get_access_token()
        if access_token_cookie is None:
            pass
        elif access_token_cookie == "":
            response.cookies["access_token"] = ""
        else:
            response.cookies["access_token"] = access_token_cookie
            response.cookies["access_token"]["max-age"] = COOKIE_MAX_AGE
            response.cookies["access_token"]["httponly"] = True


async def ignore_404(*_, **__):
    return text("Not found", status=404)


async def index(_):
    return html(
        pkgutil.get_data("featureflags.server.web", "static/index.html").decode(
            "utf-8"
        )
    )


def graph_context(
    sa_engine, session, ldap, ctx_override: Optional[dict] = None
):
    ctx = {
        SA_ENGINE: sa_engine,
        SESSION: session,
        LDAP: ldap,
        DIRTY: DirtyProjects(),
        CHANGES: Changes(),
        IDS: dict(),
    }

    if ctx_override is not None:
        ctx.update(ctx_override)

    return ctx


class AsyncGraphQLEndpoint(AsyncBatchGraphQLEndpoint):
    __ctx = None

    async def execute(self, graph, op, ctx):
        ctx.update(self.__ctx or {})
        return await super().execute(graph, op, ctx)

    async def dispatch_ext(self, json_body: dict, ctx: dict) -> dict:
        self.__ctx = ctx
        try:
            res = await super().dispatch(json_body)
        except AccessError as e:
            raise Unauthorized(*e.args) from e
        else:
            return res


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, UUID):
            return str(o)
        if isinstance(o, Enum):
            return o.value
        if isinstance(o, datetime):
            return o.isoformat()
        return json.JSONEncoder.default(self, o)


json_dumps = partial(json.dumps, cls=JSONEncoder)


async def graphql(request):
    graphql_endpoint = AsyncGraphQLEndpoint(
        request.app.ctx.hiku_engine,
        GRAPH,
        MUTATION_GRAPH,
    )

    ctx = graph_context(
        request.app.ctx.sa_engine,
        request.ctx.session,
        request.app.ctx.ldap,
    )

    result = await graphql_endpoint.dispatch_ext(request.json, ctx)

    return json_response(result, dumps=json_dumps)


async def health(_):
    return text("OK")


async def setup_db(app):
    app.ctx.sa_engine = await get_db(app.ctx.cfg)


async def shutdown_db(app):
    app.ctx.sa_engine.close()
    await app.ctx.sa_engine.wait_closed()


async def setup_hiku(app):
    app.ctx.hiku_engine = Engine(AsyncIOExecutor())


async def setup_ldap(app):
    app.ctx.ldap = get_ldap(app.ctx.cfg)


def create_app(*, cfg):
    app = Sanic(name="web", configure_logging=False)

    app.add_route(index, "/")
    app.add_route(health, "/health")

    # not implemented
    app.add_route(ignore_404, "/favicon.ico", name="favicon")
    app.add_route(ignore_404, "/apple-touch-icon.png", name="apple-touch-icon")
    app.add_route(
        ignore_404,
        "/apple-touch-icon-precomposed.png",
        name="apple-touch-icon-precomposed",
    )
    app.add_route(ignore_404, "/static/fuse.js.map", name="fuse.js.map")

    app.add_route(graphql, "/graphql", {"POST"})

    app.static("/static", os.path.join(os.path.dirname(__file__), "static"))
    if not cfg.debug:
        app.error_handler.add(NotFound, ignore_404)

    app.register_middleware(on_request, "request")
    app.register_middleware(on_response, "response")

    app.ctx.cfg = cfg

    app.register_listener(setup_db, "before_server_start")
    app.register_listener(shutdown_db, "before_server_stop")
    app.register_listener(setup_hiku, "before_server_start")
    app.register_listener(setup_ldap, "before_server_start")

    return app


def main(cfg, host, port, prometheus_port):
    if prometheus_port:
        metrics.configure(prometheus_port)

    app = create_app(cfg=cfg)

    host = host or "0.0.0.0"
    port = port or 8000

    log.info("Web server listening on %s:%s", host, port)

    app.run(
        host=host,
        port=port,
        debug=cfg.debug,
        access_log=cfg.debug,
        single_process=True,
    )
