import json
from datetime import datetime
from uuid import uuid4

import httpx
import pytest
from prometheus_client import REGISTRY

from featureflags.graph.types import Action, Changes, ValueAction, ValuesChanges
from featureflags.models import Operator
from featureflags.services import auth
from featureflags.services.notifications import (
    GREEN,
    GREY,
    RED,
    CheckInfo,
    ConditionInfo,
    NotificationsService,
    render_check_value,
    render_deleted_message,
    render_flag_message,
    render_test_message,
    render_value_message,
)
from featureflags.tests.state import (
    mk_auth_user,
    mk_check,
    mk_condition,
    mk_flag,
    mk_notification_channel,
    mk_project,
    mk_project_notification_channel,
    mk_value,
    mk_variable,
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
        "Flag `MY_FLAG`: *true*\n"
        "Conditions:\n"
        "user.email eq x@y.com\n"
        "user.company_id eq 3150894 and user.is_staff eq true\n"
        "Updated by: editor@example.com"
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
        "Flag `MY_FLAG`: *false*\nUpdated by: editor@example.com"
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
    assert att["text"].startswith("Flag `MY_FLAG`: *false*")


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
        "Flag `MY_FLAG`: *reset*\nUpdated by: editor@example.com"
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
        "Flag `MY_FLAG`: *deleted*\nUpdated by: editor@example.com"
    )


def test_render_test_message():
    payload = render_test_message(
        name="alerts",
        username="editor@example.com",
    )

    att = attachment(payload)
    assert att["color"] == GREEN
    assert att["text"] == (
        "Test notifaction from featureflags service\n"
        "Flag `alerts`: *true*\n"
        "Updated by: editor@example.com"
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
        'Value `MY_VALUE`: *enabled*, override: "42" (default: "10")\n'
        "Conditions:\n"
        'user.email eq x@y.com → "99"\n'
        "Updated by: editor@example.com"
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
        'Value `MY_VALUE`: *disabled*, override: "42" (default: "10")'
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
        "Value `MY_VALUE`: *reset*\nUpdated by: editor@example.com"
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


# ---------------------------------------------------------------------------
# NotificationsService tests
# ---------------------------------------------------------------------------


def make_service(requests):
    def handler(request):
        requests.append(request)
        return httpx.Response(200)

    return NotificationsService(transport=httpx.MockTransport(handler))


def sent_error_count(channel_name):
    return (
        REGISTRY.get_sample_value(
            "slack_notification_errors_total", {"channel": channel_name}
        )
        or 0
    )


@pytest.mark.asyncio
async def test_dispatch_flag_changes_sends_message(db_engine):
    project = await mk_project(db_engine)
    channel = await mk_notification_channel(
        db_engine, webhook_url="https://hooks.example.com/abc"
    )
    await mk_project_notification_channel(
        db_engine, project=project, channel=channel
    )
    user = await mk_auth_user(db_engine, username="editor@example.com")
    variable = await mk_variable(db_engine, project=project, name="user.email")
    flag = await mk_flag(
        db_engine, name="MY_FLAG", enabled=True, project=project
    )
    check = await mk_check(db_engine, variable=variable, value_string="x@y.com")
    await mk_condition(db_engine, flag=flag, project=project, checks=[check.id])

    requests = []
    service = make_service(requests)
    changes = Changes()
    changes.add(flag.id, Action.ENABLE_FLAG)

    service.dispatch_flag_changes(
        db_engine, auth.TestSession(user=user.id), changes
    )
    await service.wait_idle()

    [request] = requests
    assert str(request.url) == "https://hooks.example.com/abc"
    body = json.loads(request.content)
    assert body == {
        "attachments": [
            {
                "color": "#36a64f",
                "text": (
                    "Flag `MY_FLAG`: *true*\n"
                    "Conditions:\n"
                    "user.email eq x@y.com\n"
                    "Updated by: editor@example.com"
                ),
                "mrkdwn_in": ["text"],
            }
        ]
    }


@pytest.mark.asyncio
async def test_dispatch_flag_changes_fans_out_to_all_channels(db_engine):
    project = await mk_project(db_engine)
    channel_1 = await mk_notification_channel(
        db_engine, webhook_url="https://hooks.example.com/one"
    )
    channel_2 = await mk_notification_channel(
        db_engine, webhook_url="https://hooks.example.com/two"
    )
    await mk_project_notification_channel(
        db_engine, project=project, channel=channel_1
    )
    await mk_project_notification_channel(
        db_engine, project=project, channel=channel_2
    )
    user = await mk_auth_user(db_engine)
    flag = await mk_flag(db_engine, enabled=True, project=project)

    requests = []
    service = make_service(requests)
    changes = Changes()
    changes.add(flag.id, Action.ENABLE_FLAG)

    service.dispatch_flag_changes(
        db_engine, auth.TestSession(user=user.id), changes
    )
    await service.wait_idle()

    assert {str(r.url) for r in requests} == {
        "https://hooks.example.com/one",
        "https://hooks.example.com/two",
    }


@pytest.mark.asyncio
async def test_dispatch_without_channels_sends_nothing(db_engine):
    project = await mk_project(db_engine)
    user = await mk_auth_user(db_engine)
    flag = await mk_flag(db_engine, enabled=True, project=project)

    requests = []
    service = make_service(requests)
    changes = Changes()
    changes.add(flag.id, Action.ENABLE_FLAG)

    service.dispatch_flag_changes(
        db_engine, auth.TestSession(user=user.id), changes
    )
    await service.wait_idle()

    assert requests == []


@pytest.mark.asyncio
async def test_dispatch_value_changes_sends_message(db_engine):
    project = await mk_project(db_engine)
    channel = await mk_notification_channel(
        db_engine, webhook_url="https://hooks.example.com/val"
    )
    await mk_project_notification_channel(
        db_engine, project=project, channel=channel
    )
    user = await mk_auth_user(db_engine, username="editor@example.com")
    value = await mk_value(
        db_engine,
        name="MY_VALUE",
        enabled=True,
        value_default="10",
        value_override="42",
        project=project,
    )

    requests = []
    service = make_service(requests)
    changes = ValuesChanges()
    changes.add(value.id, ValueAction.ENABLE_VALUE)

    service.dispatch_value_changes(
        db_engine, auth.TestSession(user=user.id), changes
    )
    await service.wait_idle()

    [request] = requests
    body = json.loads(request.content)
    assert body["attachments"][0]["text"] == (
        'Value `MY_VALUE`: *enabled*, override: "42" (default: "10")\n'
        "Updated by: editor@example.com"
    )


@pytest.mark.asyncio
async def test_dispatch_flag_deleted_sends_message(db_engine):
    project = await mk_project(db_engine)
    channel = await mk_notification_channel(
        db_engine, webhook_url="https://hooks.example.com/del"
    )
    await mk_project_notification_channel(
        db_engine, project=project, channel=channel
    )
    user = await mk_auth_user(db_engine, username="editor@example.com")

    requests = []
    service = make_service(requests)

    # the flag row does not exist anymore at dispatch time
    service.dispatch_flag_deleted(
        db_engine, auth.TestSession(user=user.id), "GONE_FLAG", project.id
    )
    await service.wait_idle()

    [request] = requests
    body = json.loads(request.content)
    assert body["attachments"][0]["color"] == "#aaaaaa"
    assert body["attachments"][0]["text"] == (
        "Flag `GONE_FLAG`: *deleted*\nUpdated by: editor@example.com"
    )


@pytest.mark.asyncio
async def test_send_test_notification_sends_message(db_engine):
    user = await mk_auth_user(db_engine, username="editor@example.com")

    requests = []
    service = make_service(requests)

    await service.send_test_notification(
        db_engine,
        auth.TestSession(user=user.id),
        "alerts",
        "https://hooks.example.com/test",
    )

    [request] = requests
    assert str(request.url) == "https://hooks.example.com/test"
    body = json.loads(request.content)
    assert body == {
        "attachments": [
            {
                "color": "#36a64f",
                "text": (
                    "Test notifaction from featureflags service\n"
                    "Flag `alerts`: *true*\n"
                    "Updated by: editor@example.com"
                ),
                "mrkdwn_in": ["text"],
            }
        ]
    }


@pytest.mark.asyncio
async def test_send_test_notification_failure_raises_and_counts(db_engine):
    user = await mk_auth_user(db_engine)
    channel_name = "broken-test"

    def handler(request):
        return httpx.Response(500, text="nope")

    service = NotificationsService(transport=httpx.MockTransport(handler))
    errors_before = sent_error_count(channel_name)

    with pytest.raises(RuntimeError, match="unexpected response status 500"):
        await service.send_test_notification(
            db_engine,
            auth.TestSession(user=user.id),
            channel_name,
            "https://hooks.example.com/test",
        )

    assert sent_error_count(channel_name) == errors_before + 1


@pytest.mark.asyncio
async def test_send_failure_is_swallowed_and_counted(db_engine):
    project = await mk_project(db_engine)
    channel = await mk_notification_channel(
        db_engine,
        name="broken-channel",
        webhook_url="https://hooks.example.com/broken",
    )
    await mk_project_notification_channel(
        db_engine, project=project, channel=channel
    )
    user = await mk_auth_user(db_engine)
    flag = await mk_flag(db_engine, enabled=True, project=project)

    def handler(request):
        return httpx.Response(500)

    service = NotificationsService(transport=httpx.MockTransport(handler))
    changes = Changes()
    changes.add(flag.id, Action.ENABLE_FLAG)

    errors_before = sent_error_count("broken-channel")
    service.dispatch_flag_changes(
        db_engine, auth.TestSession(user=user.id), changes
    )
    await service.wait_idle()  # must not raise

    assert sent_error_count("broken-channel") == errors_before + 1


@pytest.mark.asyncio
async def test_dispatch_missing_flag_sends_nothing(db_engine):
    user = await mk_auth_user(db_engine)

    requests = []
    service = make_service(requests)
    changes = Changes()
    changes.add(uuid4(), Action.ENABLE_FLAG)

    service.dispatch_flag_changes(
        db_engine, auth.TestSession(user=user.id), changes
    )
    await service.wait_idle()

    assert requests == []
