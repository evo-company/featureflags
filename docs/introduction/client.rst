Client
======

This guide will help you get started with the FeatureFlags python client library.

Installation
------------

.. code-block:: shell

    $ pip install evo-featureflags-client


Here's a simple example of using the sync FeatureFlags client in a Flask application:

.. code-block:: python

    from flask import Flask, request, jsonify
    from featureflags_client.http.client import FeatureFlagsClient
    from featureflags_client.http.managers.requests import RequestsManager
    from featureflags_client.http.types import Variable, VariableType

    app = Flask(__name__)

    REQUEST_QUERY = Variable("user.name", VariableType.STRING)

    class Flags:
        TEST = False

    manager = RequestsManager(
        url="http://localhost:8080",
        project="my-project",
        variables=[],
        defaults=Flags,
        request_timeout=5,
        refresh_interval=10,
    )
    ff_client = FeatureFlagsClient(manager)

    @app.route('/hello/<username>')
    def hello(username):
        flags = client.flags({"user.name": username})
        if flags.TEST:
            return f"Hello, {username}! TEST is enabled"
        else:
            return f"Hello, {username}! TEST is disabled"

    if __name__ == '__main__':
        app.run(debug=True)
