from featureflags_client.http.types import Variable, VariableType

REQUEST_QUERY = Variable("request.query", VariableType.STRING)


class Flags:
    TEST = False
