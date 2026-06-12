Deployment
==========

Readonly replica mode
---------------------

featureflags can serve a second datacenter from a readonly Postgres
replica of the master database. Set in the server config:

.. code-block:: yaml

  readonly: true

In this mode the ``http`` server skips every client-triggered write:

* ``POST /flags/load`` does not register new
  projects/flags/variables/values and does not update report timestamps.
* Flags unknown to the replica are absent from responses; clients fall
  back to their in-code defaults — no client-side changes are needed.
* A project that has not been replicated yet is served as an empty state
  with ``version: 0`` instead of an error.

New flags reach readonly clients through the master: the same app deployed
in the master datacenter registers them, the rows replicate, and the first
configuration change in the admin UI bumps the project version, which
triggers the clients' normal sync.

Limitations:

* "Last reported" timestamps reflect only the traffic of the master
  datacenter.
* The admin web UI is not covered by ``readonly`` and should be deployed
  only against the master database.
