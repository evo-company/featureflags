FeatureFlags service and client library for Python.

See ``examples`` directory for complete examples for some major Web frameworks.

Overview
~~~~~~~~

This repository consists of three sub-projects:

- ``/client`` - client library
- ``/server`` - server application
- ``/protobuf`` - message types definition for talking between client and server
  using gRPC protocol

Client supports Python >=3.7.

Server requires Python >= 3.11.

Server consists of two services:

- Web application:

  - sanic_ + hiku_ + aiopg_ on backend
  - `react.js`_ + `Apollo`_ on frontend

- gRPC API handler:

  - grpclib_ + hiku_

Installation
~~~~~~~~~~~~

On PyPi: https://pypi.org/project/evo-featureflags-client

To install client library for synchronous app:

.. code-block:: shell

    $ pip install evo-featureflags-client grpcio

To install client library for asynchronous app:

.. code-block:: shell

    $ pip install evo-featureflags-client grpclib

Development
~~~~~~~~~~~

Run all this commands:

- ``lets postgres``
- ``lets apply-migrations-dev``
- ``lets web`` # in separate terminal
- ``lets rpc`` # in separate terminal, not required for web
- ``lets ui`` # in separate terminal

.. _sanic: https://github.com/channelcat/sanic/
.. _hiku: https://github.com/vmagamedov/hiku
.. _aiopg: https://github.com/aio-libs/aiopg
.. _grpclib: https://github.com/vmagamedov/grpclib
