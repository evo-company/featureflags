import logging.config

from sanic import Sanic
from sanic.log import LOGGING_CONFIG_DEFAULTS
from sanic.response import text
from grpclib.client import Channel

from featureflags.client.flags import Client
from featureflags.client.managers.asyncio import AsyncIOManager

import flags


app = Sanic(configure_logging=False)

log = logging.getLogger(__name__)


@app.listener('before_server_start')
async def on_start(sanic_app, loop):
    sanic_app.ff_manager = AsyncIOManager(
        app.config.FF_PROJECT, [flags.REQUEST_QUERY],
        Channel(app.config.FF_HOST, app.config.FF_PORT, loop=loop),
        loop=loop
    )
    sanic_app.flags_client = Client(flags.Defaults, sanic_app.ff_manager)
    try:
        await sanic_app.ff_manager.preload(timeout=5)
    except Exception:
        log.exception('Unable to preload feature flags, application will '
                      'start working with defaults and retry later')
    sanic_app.ff_manager.start()


@app.listener('after_server_stop')
async def on_stop(sanic_app, _):
    sanic_app.ff_manager.close()
    await sanic_app.ff_manager.wait_closed()


@app.middleware('request')
async def flags_ctx_enter(request):
    request['_ff_ctx'] = ctx = request.app.flags_client.flags({
        flags.REQUEST_QUERY.name: request.query_string,
    })
    request['ff'] = ctx.__enter__()


@app.middleware('response')
async def flags_ctx_enter_exit(request, _):
    request['_ff_ctx'].__exit__(None, None, None)


@app.route('/')
async def index(request):
    if request['ff'].TEST:
        return text('TEST: True')
    else:
        return text('TEST: False')


if __name__ == '__main__':
    LOGGING_CONFIG_DEFAULTS['loggers']['featureflags'] = {
        'level': 'DEBUG',
        'handlers': ['console'],
    }
    logging.config.dictConfig(LOGGING_CONFIG_DEFAULTS)

    import config
    app.config.from_object(config)
    app.run(host='0.0.0.0', port=5000)
