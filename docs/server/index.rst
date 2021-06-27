Server
======

To configure server edit `config.yaml` file. See this project for more
information: https://github.com/vmagamedov/strictconf

To create database:

.. code-block:: sql

    CREATE DATABASE featureflags;

To init empty database:

.. code-block:: shell

    $ python -m featureflags.server config.yaml@dev init

To start Web application:

.. code-block:: shell

    $ python -m featureflags.server config.yaml@dev web

To start gRPC handler:

.. code-block:: shell

    $ python -m featureflags.server config.yaml@dev rpc
