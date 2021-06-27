import asyncio
import logging
import os.path
import pkgutil
import contextlib

from sanic import Sanic
from grpclib.utils import graceful_exit
from sanic.response import html, raw, text
from sanic.exceptions import NotFound, Unauthorized

from hiku.engine import Engine
from hiku.readers.protobuf import transform
from hiku.executors.asyncio import AsyncIOExecutor

from featureflags.protobuf.backend_pb2 import Request, Reply

from .. import metrics
from ..auth import get_session
from ..actions import dispatch_ops, AccessError
from ..services.db import get_db
from ..graph.graph import pull
from ..graph.proto import populate
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


async def call(request):
    request_proto = Request.FromString(request.body)

    if request_proto.operations:
        try:
            await dispatch_ops(request_proto.operations,
                               sa=request.app.sa_engine,
                               session=request['session'],
                               ldap=request.app.ldap)
        except AccessError as e:
            raise Unauthorized(*e.args) from e

    reply = Reply()

    query = transform(request_proto.query)
    if query.fields:
        result = await pull(request.app.hiku_engine, query,
                            sa=request.app.sa_engine,
                            session=request['session'])
        populate(result, reply.result)

    return raw(reply.SerializeToString(),
               content_type='application/x-protobuf')


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

    app.router.add('/featureflags.backend.Backend/Call', {'POST'}, call)

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
