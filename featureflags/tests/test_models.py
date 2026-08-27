import pytest

from featureflags.models import Flag, Value


@pytest.mark.parametrize(
    "model, column",
    [
        (Flag, "created_timestamp"),
        (Flag, "reported_timestamp"),
        (Value, "created_timestamp"),
        (Value, "reported_timestamp"),
    ],
)
def test_timestamp_default_is_callable(model, column):
    # Column(default=utcnow()) calls utcnow once, while the module is
    # imported, so every row written by the process shares that timestamp.
    # The column has to receive the function itself.
    default = model.__table__.c[column].default
    assert default.is_callable, f"{model.__name__}.{column} default is frozen"
