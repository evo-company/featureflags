FeatureFlags service
====================

|project|_ |documentation|_ |version|_ |tag|_ |license|_

FeatureFlags is a client/server solution for feature flags integration

Installation
------------

Server
~~~~~~

.. code-block:: shell

  $ pip3 install evo-featureflags-server


Client
~~~~~~

* Python - https://github.com/evo-company/featureflags-py
* JavaScript - https://github.com/evo-company/featureflags-js

Documentation
-------------

Read documentation_


Development
-----------

Run all this commands:

- ``lets postgres``
- ``lets apply-migrations-dev``
- ``lets apply-seeds-dev``  if you have data in ``seeds/`` directory
- ``lets web`` in separate terminal
- ``lets ui`` in separate terminal, this will start vite dev server

.. note:: You might need to install npm dependencies: ``cd ui && npm install``

- `http://localhost:8080` - web application with `lets ui`
- `http://localhost:3001` - web application with `lets ui-build-dev`
- `http://localhost:8081` - http api
- `localhost:50051` - grpc api

To create a project for development purposes you can run:

``lets http``

and then execute this command:

.. code-block:: shell

    curl -X POST http://localhost:8080/flags/load -H "Content-Type: application/json" \
    -d '{"project": "test", "version": 1, "variables": [{"name": "user.id", "type": 2}], "flags": ["TEST_FLAG"], "values": [["TEST_VALUE", 1]]}'

Default username is ``admin`` and password is ``admin`` if you run with `configs/local.yaml` configuration file (default)

To start API handlers (not required for web application):

- ``lets http`` in separate terminal (this will start http server on ``http://localhost:8080``)
- ``lets rpc`` in separate terminal (this will start grpc server on ``localhost:50051``)

To build UI and copy it to ``web/static`` directory:

- ``lets ui-build-dev``

To release package:

- ``lets release 1.0.0 --message="Added feature"``

Pre-commit

``./scripts/enable-hooks.sh``

``./scripts/disable-hooks.sh``


Architecture
------------

Check important architecture decisions in ``adr/`` directory.


.. |project| image:: https://img.shields.io/badge/evo-company%2Ffeatureflags-blueviolet.svg?logo=github
.. _project: https://github.com/evo-company/featureflags
.. |documentation| image:: https://img.shields.io/badge/docs-featureflags.rtfd.io-blue.svg
.. _documentation: https://featureflags.readthedocs.io/en/latest/
.. |version| image:: https://img.shields.io/pypi/v/evo-featureflags-server.svg?label=stable&color=green
.. _version: https://pypi.org/project/featureflags/
.. |tag| image:: https://img.shields.io/github/tag/evo-company/featureflags.svg?label=latest
.. _tag: https://pypi.org/project/evo-featureflags-server/#history
.. |license| image:: https://img.shields.io/pypi/l/featureflags.svg
.. _license: https://github.com/evo-company/featureflags/blob/master/LICENSE.txt

