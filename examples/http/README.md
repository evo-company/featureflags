# HTTP Flask example

Simple Flask app using the Python FeatureFlags HTTP client.

Based on `/Users/max/code/evo/featureflags-py/examples/http/requests_client.py`.

## Requirements

Install `uv`.

## Configure

The example reads configuration from environment variables:

- `FEATUREFLAGS_URL` — FeatureFlags HTTP server URL, default: `http://localhost:8081`
- `FEATUREFLAGS_PROJECT` — project name, default: `test.test`
- `APP_HOST` — Flask bind host, default: `127.0.0.1`
- `APP_PORT` — Flask bind port, default: `5000`

Example:

```bash
export FEATUREFLAGS_URL=http://localhost:8081
export FEATUREFLAGS_PROJECT=test.test
```

## Server-side setup

In the FeatureFlags server create:

- project: `test.test`
- variable: `request.query` with type `string`
- flag: `TEST`

You can then add a condition on `request.query`, for example:

- `request.query eq enabled=1`

## Run

```bash
uv run --no-project --with requests --with flask --with evo-featureflags-client \
  examples/http/flask_server.py
# or
lets run-example-client
```

## Try it

```bash
curl 'http://127.0.0.1:5000/'
curl 'http://127.0.0.1:5000/?enabled=1'
```

If the `TEST` flag matches the request context, the app returns:

```text
TEST: True
```

Otherwise it returns:

```text
TEST: False
```
