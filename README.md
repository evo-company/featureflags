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

On PyPi: https://pypi.org/project/evo-featureflags-server

To install with Sentry integration:
`pip3 install evo-featureflags-server[sentry]`

To install client library follow instructions
here: [evo-featureflags-client](https://github.com/evo-company/featureflags-py)

Development
-----------

Run all this commands:

- ``lets postgres``
- ``lets apply-migrations-dev``
- ``lets apply-seeds-dev``  # if you have data in ``seeds/`` directory
- ``lets web`` # in separate terminal
- ``lets ui`` # in separate terminal

To start API handlers (not required for web application):

- ``lets http`` # in separate terminal
- ``lets rpc`` # in separate terminal

To build UI and copy it to ``web/static`` directory:

- ``lets build-copy-ui-bundle``

To release package:

- ``lets release 1.0.0 --message="Added feature"``

Pre-commit

``./scripts/enable-hooks.sh``

``./scripts/disable-hooks.sh``

TODO:

- add docs, automate docs build
- add more tests

.. _fastapi: https://github.com/tiangolo/fastapi
.. _hiku: https://github.com/vmagamedov/hiku
.. _aiopg: https://github.com/aio-libs/aiopg
.. _grpclib: https://github.com/vmagamedov/grpclib
