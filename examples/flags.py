from featureflags.client.flags import Variable, Types


REQUEST_QUERY = Variable('request.query', Types.STRING)


class Defaults:
    TEST = False
