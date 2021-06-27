Variables
=========

Feature flags are more useful if they can be turned on and off only in some
conditions. This allows you to test features in production, when your feature
is turned on only for you, or only for some subset of your users. And you can
specify this subset by region, by user IP, by user ID or any other criteria.

You can specify such criteria by defining your variables:

.. code-block:: python

    from featureflags.client.flags import Variable, Types

    NOW = Variable('now', Types.TIMESTAMP)

    REQUEST_HOST = Variable('request.host', Types.STRING)
    REQUEST_PATH = Variable('request.path', Types.STRING)
    REQUEST_QUERY = Variable('request.query', Types.STRING)
    REQUEST_REMOTE = Variable('request.remote', Types.STRING)

    USER_ID = Variable('user.id', Types.STRING)
    USER_EMAIL = Variable('user.email', Types.STRING)
    USER_CREATED = Variable('user.created', Types.TIMESTAMP)
    USER_TAGS = Variable('user.tags', Types.SET)

``NOW`` variable can be used to turn on feature for some durations of time.

``REQUEST_*`` variables can be used to turn on feature for specific requests.

``USER_*`` variables can be used to turn on feature for specific users.

Here is how to setup flags with these variables:

.. code-block:: python

    class Defaults:
        FEATURE_NAME = False

    manager = AsyncIOManager(
        'project.name',
        [
            NOW,
            REQUEST_HOST,
            REQUEST_PATH,
            REQUEST_QUERY,
            REQUEST_REMOTE,
            USER_ID,
            USER_EMAIL,
            USER_CREATED,
            USER_TAGS,
        ],
        channel,
        loop=loop,
    )
    client = Client(Defaults, manager)

And here is an example of how to wrap your code with a context:

.. code-block:: python

    ctx = {
        NOW.name: datetime.utcnow(),
        REQUEST_HOST.name: request.host,
        REQUEST_PATH.name: request.path,
        REQUEST_QUERY.name: request.query_string,
        REQUEST_REMOTE.name: request.remote,
    }
    user = await get_auth_user()
    if user is not None:
        ctx.update({
            USER_ID.name: str(user.id),
            USER_EMAIL.name: user.email,
            USER_CREATED.name: user.created,
            USER_TAGS.name: user.tags,
        })
    with client.flags(ctx) as flags:
        response = await your_request_handler(request, flags)

After all of this work is done and your application is deployed, feature
flags manager will notify Server about all these variables, and then you
will be able to use them in the Server's UI to build conditions for your flags.
