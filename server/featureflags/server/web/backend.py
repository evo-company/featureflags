import asyncio
import logging
import os.path
import pkgutil
import contextlib
import json
from datetime import datetime
from enum import Enum
from functools import partial
from typing import Optional

from uuid import UUID

from sanic import Sanic
from grpclib.utils import graceful_exit
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
    access_token = request.cookies.get('access_token')
    request['session'] = await get_session(access_token,
                                           db=request.app.sa_engine,
                                           secret=request.app.cfg.main.secret)


async def on_response(request, response):
    if 'session' in request:
        access_token_cookie = request['session'].get_access_token()
        if access_token_cookie is None:
            pass
        elif access_token_cookie == '':
            response.cookies['access_token'] = ''
        else:
            response.cookies['access_token'] = access_token_cookie
            response.cookies['access_token']['max-age'] = COOKIE_MAX_AGE
            response.cookies['access_token']['httponly'] = True


def ignore_404(*_, **__):
    return text('Not found', status=404)


async def index(_):
    return html(pkgutil.get_data('featureflags.server.web',
                                 'static/index.html').decode('utf-8'))


def graph_context(
    sa_engine,
    session,
    ldap,
    ctx_override: Optional[dict] = None
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
        request.app.hiku_engine,
        GRAPH,
        MUTATION_GRAPH,
    )

    ctx = graph_context(
        request.app.sa_engine,
        request['session'],
        request.app.ldap,
    )

    result = await graphql_endpoint.dispatch_ext(request.json, ctx)

    return json_response(result, dumps=json_dumps)


async def health(_):
    return text('OK')


def create_app(*, cfg, sa_engine, hiku_engine, ldap):
    app = Sanic(configure_logging=False)

    app.router.add('/', {'GET'}, index)
    app.router.add('/health', {'GET'}, health)

    # not implemented
    app.router.add('/favicon.ico', {'GET'}, ignore_404)
    app.router.add('/apple-touch-icon.png', {'GET'}, ignore_404)
    app.router.add('/apple-touch-icon-precomposed.png', {'GET'}, ignore_404)
    app.router.add('/static/fuse.js.map', {'GET'}, ignore_404)

    app.router.add('/graphql', {'POST'}, graphql)

    app.static('/static', os.path.join(os.path.dirname(__file__), 'static'))
    if not cfg.main.debug:
        app.error_handler.add(NotFound, ignore_404)

    app.register_middleware(on_request, 'request')
    app.register_middleware(on_response, 'response')

    app.cfg = cfg
    app.sa_engine = sa_engine
    app.hiku_engine = hiku_engine
    app.ldap = ldap
    return app


async def main(cfg, *, host=None, port=None, prometheus_port=None):
    host = host or '0.0.0.0'
    port = port or 8000

    if prometheus_port:
        metrics.configure(prometheus_port)

    loop = asyncio.get_event_loop()

    async with contextlib.AsyncExitStack() as stack:
        sa_engine = await stack.enter_async_context(get_db(cfg))

        app = create_app(
            cfg=cfg,
            sa_engine=sa_engine,
            hiku_engine=Engine(AsyncIOExecutor(loop=loop)),
            ldap=get_ldap(cfg),
        )
        server = await app.create_server(
            host=host, port=port,
            debug=cfg.main.debug,
            access_log=cfg.main.debug,
            return_asyncio_server=True,
        )
        log.info('Web server listening on %s:%s', host, port)
        stack.enter_context(graceful_exit([server], loop=loop))
        await server.wait_closed()
        log.info('Exiting...')
