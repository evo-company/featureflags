import logging

from grpc import insecure_channel

from featureflags.client.flags import Client
from featureflags.client.managers.sync import SyncManager

import flags
import config


def make_app():
    channel = insecure_channel('{}:{}'.format(config.FF_HOST, config.FF_PORT))
    manager = SyncManager(config.FF_PROJECT, [flags.REQUEST_QUERY], channel)
    client = Client(flags.Defaults, manager)

    def application(environ, start_response):
        ctx = {flags.REQUEST_QUERY.name: environ['QUERY_STRING']}
        with client.flags(ctx) as ff:
            if ff.TEST:
                content = b'TEST: True'
            else:
                content = b'TEST: False'
        start_response('200 OK', [('Content-Length', str(len(content)))])
        return [content]
    return application


if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    logging.getLogger('featureflags').setLevel(logging.DEBUG)

    from wsgiref.simple_server import make_server
    with make_server('', 5000, make_app()) as server:
        server.serve_forever()
