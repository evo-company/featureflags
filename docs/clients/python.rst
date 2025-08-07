Python Client
=============

The Python client for FeatureFlags provides both synchronous and asynchronous interfaces for integrating feature flags into your Python applications.

Installation
------------

Install the Python client from PyPI:

.. code-block:: shell

    $ pip install evo-featureflags-client

Or using PDM:

.. code-block:: shell

    $ pdm add evo-featureflags-client

Requirements
~~~~~~~~~~~~

The client supports Python >=3.9.

Synchronous Client
------------------

The synchronous client is suitable for traditional web frameworks like Flask and Django.


Supported sync http clients
~~~~~~~~~~~~~~~~~~~~~~~~~~~

- requests

Basic Setup
~~~~~~~~~~~

.. code-block:: python

    from featureflags_client.http.client import FeatureFlagsClient
    from featureflags_client.http.managers.requests import RequestsManager
    from featureflags_client.http.types import Variable, VariableType

    # Define variables for your project
    USER_ID = Variable("user.id", VariableType.STRING)
    
    # Define your flags with default values
    class Flags:
        NEW_UI_FEATURE = False
        BETA_MODE = False
        PREMIUM_FEATURES = False
    
    # Initialize the client
    manager = RequestsManager(
        url="http://localhost:8080",
        project="my-project",
        variables=[USER_ID],
        defaults=Flags,
        request_timeout=5,
        refresh_interval=10,
    )
    client = FeatureFlagsClient(manager)

    # Preload flags and values from server
    client.preload()

Flags example
~~~~~~~~~~~~~

Here's a complete example of using the FeatureFlags client in a Flask application:

.. code-block:: python

    from flask import Flask, request, jsonify
    from featureflags_client.http.client import FeatureFlagsClient
    from featureflags_client.http.managers.requests import RequestsManager
    from featureflags_client.http.types import Variable, VariableType

    app = Flask(__name__)

    # Define variables for your project
    USER_ID = Variable("user.id", VariableType.STRING)

    # Define your flags with default values
    class Flags:
        TEST = False
        SOME_FLAG = False

    # Initialize the FeatureFlags client
    manager = RequestsManager(
        url="http://localhost:8080",
        project="my-project",
        variables=[USER_ID],
        defaults=Flags,
        request_timeout=5,
        refresh_interval=10,
    )
    ff_client = FeatureFlagsClient(manager)

    # Preload flags and values from server
    try:
        client.preload()
    except Exception:
        logging.exception(
            "Unable to preload feature flags, application will "
            "start working with defaults and retry later"
        )

    @app.route('/hello')
    def hello():
        user_id = request.args.get('user_id', 'anonymous')
        with ff_client.flags({"user.id": user_id}) as flags:
            if flags.TEST:
                return "Hello, TEST!"
            else:
                return "Hello, world!"

    if __name__ == '__main__':
        app.run(debug=True)


Asynchronous Client
-------------------

The asynchronous client is designed for async web frameworks like aiohttp and FastAPI.

Supported async http clients
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

- aiohttp
- httpx

Basic Setup
~~~~~~~~~~~

.. code-block:: python

    from featureflags_client.http.client import FeatureFlagsClient
    from featureflags_client.http.managers.aiohttp import AiohttpManager
    from featureflags_client.http.types import Variable, VariableType

    # Define variables for your project
    REQUEST_QUERY = Variable("request.query", VariableType.STRING)

    # Define your flags with default values
    class Flags:
        TEST = False
        SOME_FLAG = False

    # Initialize the async client
    manager = AiohttpManager(
        url="http://localhost:8080",
        project="my-project",
        variables=[REQUEST_QUERY],
        defaults=Flags,
        request_timeout=5,
        refresh_interval=10,
    )
    client = FeatureFlagsClient(manager)

    # Preload flags and values from server
    try:
        client.preload()
    except Exception:
        logging.exception(
            "Unable to preload feature flags, application will "
            "start working with defaults and retry later"
        )

aiohttp Example
~~~~~~~~~~~~~~~

Here's a complete example using aiohttp:

.. code-block:: python

    import logging
    from aiohttp import web
    from featureflags_client.http.client import FeatureFlagsClient
    from featureflags_client.http.managers.aiohttp import AiohttpManager
    from featureflags_client.http.types import Variable, VariableType

    # Define variables and flags
    REQUEST_QUERY = Variable("request.query", VariableType.STRING)

    class Flags:
        TEST = False
        SOME_FLAG = False

    async def on_start(app):
        """Initialize feature flags client on application startup"""
        app["ff_manager"] = AiohttpManager(
            url="http://localhost:8080",
            project="my-project",
            variables=[REQUEST_QUERY],
            defaults=Flags,
            request_timeout=5,
            refresh_interval=10,
        )
        app["ff_client"] = FeatureFlagsClient(app["ff_manager"])

        try:
            await app["ff_client"].preload_async()
        except Exception:
            logging.exception(
                "Unable to preload feature flags, application will "
                "start working with defaults and retry later"
            )

        # Async managers need to `start` to run flags update loop
        app["ff_manager"].start()

    async def on_stop(app):
        """Cleanup on application shutdown"""
        await app["ff_manager"].wait_closed()

    @web.middleware
    async def feature_flags_middleware(request, handler):
        """Middleware to inject feature flags into request context"""
        ctx = {REQUEST_QUERY.name: request.query_string}
        with request.app["ff_client"].flags(ctx) as ff:
            request["ff"] = ff
            return await handler(request)

    async def index(request):
        """Example endpoint using feature flags"""
        if request["ff"].TEST:
            return web.Response(text="TEST: True")
        else:
            return web.Response(text="TEST: False")

    def create_app():
        """Create and configure the aiohttp application"""
        app = web.Application(middlewares=[feature_flags_middleware])
        app.router.add_get("/", index)
        app.on_startup.append(on_start)
        app.on_cleanup.append(on_stop)
        return app

    if __name__ == "__main__":
        logging.basicConfig(level=logging.INFO)
        web.run_app(create_app(), port=5000)

FastAPI Example
~~~~~~~~~~~~~~~

For FastAPI applications using httpx manager:

.. code-block:: python

    import logging
    from fastapi import FastAPI, Request
    from featureflags_client.http.client import FeatureFlagsClient
    from featureflags_client.http.managers.httpx import HttpxManager
    from featureflags_client.http.types import Variable, VariableType

    # Define variables and flags
    USER_ID = Variable("user.id", VariableType.STRING)
    REQUEST_QUERY = Variable("request.query", VariableType.STRING)

    class Flags:
        TEST = False
        PREMIUM_FEATURE = False

    class Values:
        PAGINATION_LIMIT = 10
        FEATURE_MESSAGE = "Welcome!"

    # Initialize the async client
    manager = HttpxManager(
        url="http://localhost:8080",
        project="my-project",
        variables=[USER_ID, REQUEST_QUERY],
        defaults=Flags,
        request_timeout=5,
        refresh_interval=10,
    )
    client = FeatureFlagsClient(manager)

    app = FastAPI()

    @app.on_event("startup")
    async def startup_event():
        """Initialize feature flags on startup"""
        try:
            await client.preload_async()
            app.state.ff_client = client
        except Exception:
            logging.exception("Unable to preload feature flags")

    @app.get("/feature/{flag_name}")
    async def check_feature(flag_name: str, request: Request):
        """Check feature flag status"""
        user_id = request.query_params.get('user_id', 'anonymous')
        query_string = str(request.query_params)
        
        ctx = {
            "user.id": user_id,
            "request.query": query_string
        }
        
        with request.state.ff_client.flags(ctx) as flags:
            if hasattr(flags, flag_name):
                is_enabled = getattr(flags, flag_name)
                return {"flag": flag_name, "enabled": is_enabled}
            else:
                return {"error": f"Flag {flag_name} not found"}

    @app.get("/values")
    async def get_values(request: Request):
        """Get feature values"""
        user_id = request.query_params.get('user_id', 'anonymous')
        
        ctx = {"user.id": user_id}
        
        with request.state.ff_client.values(ctx) as values:
            return {
                "pagination_limit": values.PAGINATION_LIMIT,
                "feature_message": values.FEATURE_MESSAGE
            }

Configuration Options
---------------------

Both synchronous and asynchronous clients support the following configuration options:

- `url`: URL of your FeatureFlags server
- `project`: Project identifier
- `variables`: List of variables used in your project
- `defaults`: Class defining default values for flags
- `values_defaults`: Class defining default values for values
- `request_timeout`: Request timeout in seconds (default: 5)
- `refresh_interval`: How often to sync with server in seconds (default: 10)

Available Managers
~~~~~~~~~~~~~~~~~~

- **RequestsManager**: Synchronous HTTP client using requests library
- **AiohttpManager**: Asynchronous HTTP client using aiohttp library
- **HttpxManager**: Asynchronous HTTP client using httpx library

Best Practices
--------------

1. **Initialize once**: Create the client once and reuse it throughout your application
2. **Use middleware**: Inject feature flags into request context using middleware
3. **Handle startup**: Preload flags on application startup for immediate availability
4. **Define defaults**: Always provide default values for flags and values
5. **Use context managers**: Use `with client.flags(ctx)` for proper resource management
6. **Define variables**: Register all variables your project uses with the server

Repository
----------

The Python client source code is available at:
`https://github.com/evo-company/featureflags-py`

For updates and contributions, please visit the repository.
