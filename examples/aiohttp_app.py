import logging

from aiohttp import web
from grpclib.client import Channel

from featureflags.client.flags import Client
from featureflags.client.managers.asyncio import AsyncIOManager

import flags


log = logging.getLogger(__name__)


async def on_start(app):
    app['ff_manager'] = AsyncIOManager(
        app['config'].FF_PROJECT, [flags.REQUEST_QUERY],
        Channel(app['config'].FF_HOST, app['config'].FF_PORT),
    )
    app['ff_client'] = Client(flags.Defaults, app['ff_manager'])
    try:
        await app['ff_manager'].preload(timeout=5)
    except Exception:
        log.exception('Unable to preload feature flags, application will '
                      'start working with defaults and retry later')
    app['ff_manager'].start()


async def on_stop(app):
    app['ff_manager'].close()
    await app['ff_manager'].wait_closed()


@web.middleware
async def middleware(request, handler):
    ctx = {flags.REQUEST_QUERY.name: request.query_string}
    with request.app['ff_client'].flags(ctx) as ff:
        request['ff'] = ff
        return await handler(request)


async def index(request):
    if request['ff'].TEST:
        return web.Response(text='TEST: True')
    else:
        return web.Response(text='TEST: False')


def create_app():
    app = web.Application(middlewares=[middleware])
    app.router.add_get('/', index)
    app.on_startup.append(on_start)
    app.on_cleanup.append(on_stop)

    import config
    app['config'] = config
    return app


if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    logging.getLogger('featureflags').setLevel(logging.DEBUG)

    web.run_app(create_app(), port=5000)
