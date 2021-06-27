FeatureFlags service and client library for Python.

See ``examples`` directory for complete examples for some major Web frameworks.

Overview
~~~~~~~~

This repository consists of three sub-projects:

- ``/client`` - client library
- ``/server`` - server application
- ``/protobuf`` - message types definition for talking between client and server
  using gRPC protocol

Client supports Python 2.7, >=3.5.

Server requires Python >= 3.6.

Server consists of two services:

- Web application:

  - sanic_ + hiku_ + aiopg_ on backend
  - `vue.js`_ + `protobuf.js`_ on frontend

- gRPC API handler:

  - grpclib_ + hiku_

Server requires ``taskqueue`` service to operate. Data is stored in regular
PostgreSQL database, to efficiently store time-series data timescale_ extension
for PostgreSQL is required.

.. _sanic: https://github.com/channelcat/sanic/
.. _hiku: https://github.com/vmagamedov/hiku
.. _aiopg: https://github.com/aio-libs/aiopg
.. _vue.js: https://vuejs.org
.. _grpclib: https://github.com/vmagamedov/grpclib
.. _protobuf.js: https://github.com/dcodeIO/protobuf.js
.. _timescale: https://www.timescale.com
