Server
======

This guide will help you get started with the FeatureFlags server

Installation
------------

.. code-block:: shell

    $ pip install evo-featureflags-server

Running the Server Locally
--------------------------

Using Docker
~~~~~~~~~~~~

We recommend using `Lets <https://lets-cli.org/>`_, a CLI task runner for developers, as an alternative to Docker. Lets provides a simple YAML-based configuration for running development tasks.

First, install Lets https://lets-cli.org/

Then run the server using Lets:

.. code-block:: shell

    # Clone the repository
    $ git clone https://github.com/evo-company/featureflags
    $ cd featureflags

    # Start PostgreSQL
    $ lets postgres

    # Apply database migrations
    $ lets apply-migrations-dev

    # Start the web server for UI
    $ lets web

    # Start the http api to which the client will connect
    $ lets http

    # Start the UI dev server
    $ lets ui

The server will be available at `http://localhost:8080`.
The api will be available at `http://localhost:8081`.

To create a project for development purposes you can run:

``lets http``

and then execute this command:

.. code-block:: shell
    curl -X POST http://localhost:8080/flags/load -H "Content-Type: application/json" \
    -d '{"project": "test", "version": 1, "variables": [{"name": "user.id", "type": 2}], "flags": ["TEST_FLAG"], "values": [["TEST_VALUE", 1]]}'

Configuration
~~~~~~~~~~~~~

The server uses YAML configuration files. You can specify the configuration file path using the `CONFIG_PATH` environment variable.

Basic config is in `configs/local.yaml` file.
