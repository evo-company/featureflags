from datetime import datetime

import pytest

from featureflags.graph.types import Action, ValueAction
from featureflags.models import Operator
from featureflags.services.notifications import (
    CheckInfo,
    ConditionInfo,
    GREEN,
    GREY,
    RED,
    render_check_value,
    render_deleted_message,
    render_flag_message,
    render_value_message,
)


def attachment(payload):
    [att] = payload["attachments"]
    return att


def test_render_flag_message_enabled_with_conditions():
    payload = render_flag_message(
        name="MY_FLAG",
        enabled=True,
        actions=[Action.ENABLE_FLAG],
        conditions=[
            ConditionInfo(
                checks=[
                    CheckInfo("user.email", Operator.EQUAL, "x@y.com"),
                ]
            ),
            ConditionInfo(
                checks=[
                    CheckInfo("user.company_id", Operator.EQUAL, "3150894"),
                    CheckInfo("user.is_staff", Operator.EQUAL, "true"),
                ]
            ),
        ],
        username="editor@example.com",
    )

    att = attachment(payload)
    assert att["color"] == GREEN
    assert att["mrkdwn_in"] == ["text"]
    assert att["text"] == (
        "Flag `MY_FLAG`: true\n"
        "Conditions:\n"
        "user.email eq x@y.com\n"
        "user.company_id eq 3150894 and user.is_staff eq true\n"
        "Updated: editor@example.com"
    )


def test_render_flag_message_disabled_no_conditions():
    payload = render_flag_message(
        name="MY_FLAG",
        enabled=False,
        actions=[Action.DISABLE_FLAG],
        conditions=[],
        username="editor@example.com",
    )

    att = attachment(payload)
    assert att["color"] == RED
    assert att["text"] == (
        "Flag `MY_FLAG`: false\nUpdated: editor@example.com"
    )


def test_render_flag_message_enabled_none_renders_false():
    payload = render_flag_message(
        name="MY_FLAG",
        enabled=None,
        actions=[Action.ADD_CONDITION],
        conditions=[],
        username="editor@example.com",
    )

    att = attachment(payload)
    assert att["color"] == RED
    assert att["text"].startswith("Flag `MY_FLAG`: false")


def test_render_flag_message_reset():
    payload = render_flag_message(
        name="MY_FLAG",
        enabled=None,
        actions=[Action.RESET_FLAG],
        conditions=[],
        username="editor@example.com",
    )

    att = attachment(payload)
    assert att["color"] == GREY
    assert att["text"] == (
        "Flag `MY_FLAG`: reset\nUpdated: editor@example.com"
    )


def test_render_deleted_message():
    payload = render_deleted_message(
        kind="Flag",
        name="MY_FLAG",
        username="editor@example.com",
    )

    att = attachment(payload)
    assert att["color"] == GREY
    assert att["text"] == (
        "Flag `MY_FLAG`: deleted\nUpdated: editor@example.com"
    )


def test_render_value_message_enabled_with_condition_override():
    payload = render_value_message(
        name="MY_VALUE",
        enabled=True,
        value_default="10",
        value_override="42",
        actions=[ValueAction.ENABLE_VALUE],
        conditions=[
            ConditionInfo(
                checks=[CheckInfo("user.email", Operator.EQUAL, "x@y.com")],
                value_override="99",
            ),
        ],
        username="editor@example.com",
    )

    att = attachment(payload)
    assert att["color"] == GREEN
    assert att["text"] == (
        'Value `MY_VALUE`: enabled, override: "42" (default: "10")\n'
        "Conditions:\n"
        'user.email eq x@y.com → "99"\n'
        "Updated: editor@example.com"
    )


def test_render_value_message_disabled():
    payload = render_value_message(
        name="MY_VALUE",
        enabled=None,
        value_default="10",
        value_override="42",
        actions=[ValueAction.DISABLE_VALUE],
        conditions=[],
        username="editor@example.com",
    )

    att = attachment(payload)
    assert att["color"] == RED
    assert att["text"].startswith(
        'Value `MY_VALUE`: disabled, override: "42" (default: "10")'
    )


def test_render_value_message_reset():
    payload = render_value_message(
        name="MY_VALUE",
        enabled=None,
        value_default="10",
        value_override="10",
        actions=[ValueAction.RESET_VALUE],
        conditions=[],
        username="editor@example.com",
    )

    att = attachment(payload)
    assert att["color"] == GREY
    assert att["text"] == (
        "Value `MY_VALUE`: reset\nUpdated: editor@example.com"
    )


@pytest.mark.parametrize(
    "kwargs, expected",
    [
        ({"value_string": "abc"}, "abc"),
        ({"value_number": 3150894.0}, "3150894"),
        ({"value_number": 0.5}, "0.5"),
        (
            {"value_timestamp": datetime(2026, 6, 12, 10, 30)},
            "2026-06-12T10:30:00",
        ),
        ({"value_set": ["a", "b"]}, "[a, b]"),
        ({}, ""),
    ],
)
def test_render_check_value(kwargs, expected):
    defaults = {
        "value_string": None,
        "value_number": None,
        "value_timestamp": None,
        "value_set": None,
    }
    defaults.update(kwargs)
    assert render_check_value(**defaults) == expected


@pytest.mark.parametrize(
    "operator, label",
    [
        (Operator.EQUAL, "eq"),
        (Operator.LESS_THAN, "<"),
        (Operator.LESS_OR_EQUAL, "<="),
        (Operator.GREATER_THAN, ">"),
        (Operator.GREATER_OR_EQUAL, ">="),
        (Operator.CONTAINS, "contains"),
        (Operator.PERCENT, "%"),
        (Operator.REGEXP, "regexp"),
        (Operator.WILDCARD, "wildcard"),
        (Operator.SUBSET, "subset"),
        (Operator.SUPERSET, "superset"),
    ],
)
def test_operator_rendering(operator, label):
    payload = render_flag_message(
        name="F",
        enabled=True,
        actions=[Action.ENABLE_FLAG],
        conditions=[ConditionInfo(checks=[CheckInfo("var", operator, "v")])],
        username="u",
    )
    assert f"var {label} v" in attachment(payload)["text"]
