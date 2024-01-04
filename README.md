FeatureFlags service

Overview
--------

Server requires Python >= 3.11.
Server consists of actual web application and API handlers (HTTP, gRPC):

- Web application:

    - `fastapi_` + `hiku_` + `aiopg_` on backend
    - `react.js`_ + `Apollo`_ on frontend

- gRPC API handler:

    - `grpclib_` + `hiku_`

- HTTP API handler:

    - `fastapi_` + `hiku_`

ADR
---

Check important architecture decisions in ``adr/`` directory.


Installation
------------
TODO: update after deploy configuration 

On PyPi: https://pypi.org/project/evo-featureflags-client

To install client library for synchronous app:

.. code-block:: shell

    $ pip install evo-featureflags grpcio

To install client library for asynchronous app:

.. code-block:: shell

    $ pip install evo-featureflags grpclib

Development
-----------

Run all this commands:

- ``lets postgres``
- ``lets apply-migrations-dev``
- ``lets apply-seeds-dev``  # if you have data in ``seeds/`` directory
- ``lets web`` # in separate terminal
- ``lets ui`` # in separate terminal

to start API handlers (not required for web application):

- ``lets http`` # in separate terminal
- ``lets rpc`` # in separate terminal

.. _fastapi: https://github.com/tiangolo/fastapi
.. _hiku: https://github.com/vmagamedov/hiku
.. _aiopg: https://github.com/aio-libs/aiopg
.. _grpclib: https://github.com/vmagamedov/grpclib
