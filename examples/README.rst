Examples
========

Here you can find examples for:

- `AIOHTTP`_
- `Sanic`_
- `Flask`_
- `WSGI`_

Prerequisites:

.. code-block:: shell

    $ pip install featureflags-client

If you're using AsyncIO:

.. code-block:: shell

    $ pip install grpclib

else:

.. code-block:: shell

    $ pip install grpcio

Configuration for all examples located in ``config.py`` module.

Feature flags and variables are defined in ``flags.py`` module.

Every example starts a HTTP server and available on http://localhost:5000

AIOHTTP:

.. code-block:: shell

    $ PYTHONPATH=../client:../protobuf python aiohttp_app.py

Sanic:

.. code-block:: shell

    $ PYTHONPATH=../client:../protobuf python sanic_app.py

Flask:

.. code-block:: shell

    $ PYTHONPATH=../client:../protobuf python flask_app.py

WSGI:

.. code-block:: shell

    $ PYTHONPATH=../client:../protobuf python wsgi_app.py

.. _AIOHTTP: https://aiohttp.readthedocs.io/
.. _Sanic: https://sanic.readthedocs.io/
.. _Flask: http://flask.pocoo.org
.. _WSGI: https://www.python.org/dev/peps/pep-0333/
