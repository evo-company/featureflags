Development
===========

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

To create a project for development purposes you can run:

``lets http``

and then execute this command:

.. code-block:: shell

    curl -X POST http://localhost:8081/flags/load -H "Content-Type: application/json" \
    -d '{"project": "test", "version": 1, "variables": [{"name": "user.id", "type": 2}], "flags": ["TEST_FLAG"], "values": [["TEST_VALUE", 1]]}'

Default username is ``admin`` and password is ``admin`` if you run with `configs/local.yaml` configuration file (default)

To start API handlers (not required for web application):

- ``lets http`` in separate terminal (this will start http server on ``http://localhost:8081``)

To test the HTTP service with the example Flask client:

- make sure ``uv`` is installed
- run ``lets http`` in one terminal
- run ``lets run-example-client`` in another terminal
- open ``http://127.0.0.1:5000`` or call it with curl

``lets run-example-client`` uses ``uv run --no-project --with requests --with flask --with evo-featureflags-client`` so it ignores this repository's server dependencies and you do not need to create a virtualenv for the example.

The example client is in ``examples/http/`` and connects to the FeatureFlags HTTP API. You can use it to verify that flag evaluation works end-to-end against the local service.

To build UI and copy it to ``web/static`` directory:

- ``lets ui-build-dev``

To release package:

- ``lets release 1.0.0 --message="Added feature"``

This pushes a ``v*`` tag, which triggers the release workflow: the package is
published to PyPI and a GitHub Release is created automatically. Release notes
are taken from the version's section in ``CHANGELOG.md`` (or auto-generated
from merged PRs when the section is missing), so update the changelog before
releasing. Non-final versions (e.g. ``1.26.0rc1``) are marked as pre-releases.

Pre-commit

``./scripts/enable-hooks.sh``

``./scripts/disable-hooks.sh``

Architecture
------------

Check important architecture decisions in ``adr/`` directory.