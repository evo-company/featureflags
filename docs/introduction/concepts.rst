Concepts
========

This section explains the core concepts of the FeatureFlags system and how they work together.

Flags
-----

A **flag** is a boolean feature toggle that can be either `true` or `false`. Flags are used to enable or disable features in your application.

Flags are defined with:

- **Name**: A unique identifier for the flag (e.g., `NEW_UI_FEATURE`, `BETA_MODE`)
- **Default value**: The fallback value when conditions are not met
- **Conditions**: Rules that determine when the flag should be enabled
- **Enabled state**: Whether the flag is active in the system

Example flag usage:

.. code-block:: python

    from featureflags_client.http.client import FeatureFlagsClient
    from featureflags_client.http.managers.requests import RequestsManager
    
    # Define your flags with default values
    class Flags:
        NEW_UI_FEATURE = False
        BETA_MODE = False
        PREMIUM_FEATURES = False
    
    # Initialize client
    manager = RequestsManager(
        url="http://localhost:8080",
        project="my-project",
        variables=[],
        defaults=Flags,
        request_timeout=5,
        refresh_interval=10,
    )
    client = FeatureFlagsClient(manager)

    # Preload flags and values from server
    client.preload()
    
    # Use flags in your application
    with client.flags({"user.id": "123"}) as flags:
        if flags.NEW_UI_FEATURE:
            show_new_ui()
        else:
            show_old_ui()

Values
------

A **value** is a configurable parameter that can be of different types (string, integer, etc.). Values are used for A/B testing, dynamic configuration, and feature customization.

Values can be:

- **Strings**: Text values like configuration settings
- **Integers**: Numeric values like pagination limits, prices, or timeouts
- **Timestamps**: Date/time values
- **Sets**: Collections of values

Example value usage:

.. code-block:: python

    # Define your values with default values
    class Values:
        PAGINATION_LIMIT = 10
        PRODUCT_PRICE = 99.99
        FEATURE_MESSAGE = "Welcome to our new feature!"

    # Initialize client
    manager = RequestsManager(
        url="http://localhost:8080",
        project="my-project",
        variables=[],
        values_defaults=Values,
        request_timeout=5,
        refresh_interval=10,
    )
    client = FeatureFlagsClient(manager)

    # Preload values from server
    client.preload()
    
    # Use values in your application
    with client.values({"user.id": "123"}) as values:
        items_per_page = values.PAGINATION_LIMIT
        price = values.PRODUCT_PRICE
        message = values.FEATURE_MESSAGE

Common use cases for values:

- **A/B Testing**: Different prices, messages, or configurations
- **Dynamic Configuration**: Pagination limits, timeouts, feature limits
- **Personalization**: User-specific content or settings
- **Feature Customization**: Different behavior based on user segments

Evaluation
~~~~~~~~~~

The FeatureFlags system uses a **client-side evaluation** architecture to minimize server requests and provide fast, responsive feature flag checking.

**How it works:**

1. **Server Storage**: All flags, values, and their conditions are stored in the server database
2. **Client Synchronization**: The client periodically syncs with the server to download:
   - Flag definitions and their conditions
   - Value definitions and their conditions
   - Variable definitions
   - All evaluation rules and logic
3. **Client-Side Evaluation**: When checking a flag or value, the client evaluates the conditions locally using the synced data
4. **Context-Based**: Evaluation uses the provided context (user attributes, request data, etc.)

**Benefits:**

- **Low Latency**: No network requests during flag evaluation
- **High Performance**: Fast feature flag checks
- **Reduced Server Load**: Minimal RPS to the server
- **Offline Capability**: Works even when server is temporarily unavailable

**Synchronization:**

- Clients sync with the server at regular intervals (configurable)
- Changes to flags/values are propagated to clients within the sync interval
- Clients can preload data on startup for immediate availability

Variables
~~~~~~~~~

**Variables** are the building blocks of conditions. They represent attributes or context that can be used to make decisions about flags and values.

Variables have:

- **Name**: Identifier like `user.id`, `user.email`, `request.ip`
- **Type**: STRING, NUMBER, TIMESTAMP, or SET
- **Value**: The actual data from your application context

These are the examples of variables that you may need to define in your project (featureflags client does not define any variables for you):

**User Variables:**

- `user.id`: Unique user identifier
- `user.email`: User's email address
- `user.role`: User's role (admin, premium, etc.)
- `user.country`: User's location

**Request Variables:**

- `request.ip`: Client's IP address
- `request.user_agent`: Browser/device information
- `request.path`: Current URL path
- `request.method`: HTTP method

On first application start, when client syncs with the server, client sends all variables to the server
and only then new variables can be used in flags UI.

Example variable usage:

.. code-block:: python

    from featureflags_client.http.types import Variable, VariableType
    
    # Define variables for your project
    USER_ID = Variable("user.id", VariableType.NUMBER)
    USER_EMAIL = Variable("user.email", VariableType.STRING)
    REQUEST_IP = Variable("request.ip", VariableType.STRING)
    
    # Use variables in conditions
    manager = RequestsManager(
        url="http://localhost:8080",
        project="my-project",
        variables=[USER_ID, USER_EMAIL, USER_ROLE, REQUEST_IP],
        defaults=Flags,
        request_timeout=5,
        refresh_interval=10,
    )

The system evaluates these conditions using the context you provide when checking flags and values.
