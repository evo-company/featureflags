import logging
import os

from featureflags_client.http.client import FeatureFlagsClient
from featureflags_client.http.managers.requests import RequestsManager
from featureflags_client.http.types import Variable, VariableType
from flask import Flask, request

log = logging.getLogger(__name__)

app = Flask(__name__)

# config
FF_PROJECT = os.getenv("FEATUREFLAGS_PROJECT", "test.test")
FF_URL = os.getenv("FEATUREFLAGS_URL", "http://localhost:8081")
APP_HOST = os.getenv("APP_HOST", "127.0.0.1")
APP_PORT = int(os.getenv("APP_PORT", "5000"))

# flags
REQUEST_QUERY = Variable("request.query", VariableType.STRING)


class Flags:
    TEST = False


# client
manager = RequestsManager(
    url=FF_URL,
    project=FF_PROJECT,
    variables=[REQUEST_QUERY],
    defaults=Flags,
    request_timeout=5,
    refresh_interval=10,
)
ff_client = FeatureFlagsClient(manager)

try:
    ff_client.preload()
except Exception:
    log.exception(
        "Unable to preload feature flags, application will "
        "start working with defaults and retry later"
    )


@app.route("/")
def index():
    query_string = request.query_string.decode("utf-8")
    context = {REQUEST_QUERY.name: query_string}

    with ff_client.flags(context) as ff:
        if ff.TEST:
            return "TEST: True\n"
        return "TEST: False\n"


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    logging.getLogger("featureflags").setLevel(logging.DEBUG)

    app.run(host=APP_HOST, port=APP_PORT)
