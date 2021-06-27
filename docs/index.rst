FeatureFlags
============

FeatureFlags service and client library for Python.

Installation
~~~~~~~~~~~~

To install client library for synchronous app:

.. code-block:: shell

    $ pip install featureflags-client grpcio

To install client library for asynchronous app:

.. code-block:: shell

    $ pip install featureflags-client grpclib

Example
~~~~~~~

.. code-block:: python

    from featureflags.client.flags import Client
    from featureflags.client.managers.asyncio import AsyncIOManager

    class Defaults:
        FOO_FEATURE = False

    async def main():
        loop = asyncio.get_event_loop()
        channel = Channel('grpc.featureflags.svc', 50051, loop=loop)
        manager = AsyncIOManager('project.name', [], channel, loop=loop)
        client = Client(Defaults, manager)

        try:
            manager.preload(timeout=5)
        except asyncio.TimeoutError:
            log.warning('Unable to preload feature flags in time, '
                        'application will start working with defaults '
                        'and retry later')
        manager.start()
        try:
            with client.flags() as flags:
                if flags.FOO_FEATURE:
                    print('Feature enabled')
                else:
                    print('Feature disabled')
        finally:
            manager.close()
            await manager.wait_closed()

During your application's lifetime
:py:class:`~featureflags.client.managers.asyncio.AsyncIOManager` will
synchronize state with FeatureFlags server, reachable at
``grpc.featureflags.svc:50051`` address, so you will be able to change behaviour
of your application in runtime in a matter of seconds, in order to test features
in production with real users and load, with ability to turn off specific
features in case of unexpected problems.

User's Guide
~~~~~~~~~~~~

.. toctree::
    :maxdepth: 2

    client/index
    server/index
    changelog/index
