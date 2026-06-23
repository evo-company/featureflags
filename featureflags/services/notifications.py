import asyncio
import logging
from collections.abc import Coroutine
from dataclasses import dataclass
from datetime import datetime
from uuid import UUID

import aiopg.sa
import httpx
from aiopg.sa import SAConnection
from prometheus_client import Counter
from sqlalchemy import select

from featureflags.graph.types import Action, Changes, ValueAction, ValuesChanges
from featureflags.models import (
    AuthUser,
    Check,
    Condition,
    Flag,
    NotificationChannel,
    Operator,
    ProjectNotificationChannel,
    Value,
    ValueCondition,
    Variable,
)
from featureflags.services.auth import BaseUserSession
from featureflags.utils import select_first, select_scalar

log = logging.getLogger(__name__)

GREEN = "#36a64f"
RED = "#d63232"
GREY = "#aaaaaa"

# Slack returns 2xx on success; treat anything >= this as a delivery failure.
HTTP_ERROR_STATUS = 300

SLACK_NOTIFICATIONS_COUNTER = Counter(
    "slack_notifications",
    "Slack notifications sent",
    ["channel"],
)
SLACK_NOTIFICATION_ERRORS_COUNTER = Counter(
    "slack_notification_errors",
    "Slack notification send errors",
    ["channel"],
)

OPERATOR_LABELS = {
    Operator.EQUAL: "eq",
    Operator.LESS_THAN: "<",
    Operator.LESS_OR_EQUAL: "<=",
    Operator.GREATER_THAN: ">",
    Operator.GREATER_OR_EQUAL: ">=",
    Operator.CONTAINS: "contains",
    Operator.PERCENT: "%",
    Operator.REGEXP: "regexp",
    Operator.WILDCARD: "wildcard",
    Operator.SUBSET: "subset",
    Operator.SUPERSET: "superset",
}


@dataclass
class CheckInfo:
    variable_name: str
    operator: Operator
    value: str


@dataclass
class ConditionInfo:
    checks: list[CheckInfo]
    value_override: str | None = None


def render_check_value(
    value_string: str | None,
    value_number: float | None,
    value_timestamp: datetime | None,
    value_set: list[str] | tuple[str, ...] | None,
) -> str:
    if value_string is not None:
        return value_string
    if value_number is not None:
        if value_number == int(value_number):
            return str(int(value_number))
        return str(value_number)
    if value_timestamp is not None:
        return value_timestamp.isoformat()
    if value_set is not None:
        return f"[{', '.join(value_set)}]"
    return ""


def _render_condition_line(condition: ConditionInfo) -> str:
    line = " and ".join(
        f"{check.variable_name}"
        f" {OPERATOR_LABELS[check.operator]}"
        f" {check.value}"
        for check in condition.checks
    )
    if condition.value_override is not None:
        line += f' → "{condition.value_override}"'
    return line


def _render_text(
    title: str,
    conditions: list[ConditionInfo],
    username: str,
) -> str:
    lines = [title]
    if conditions:
        lines.append("Conditions:")
        lines.extend(_render_condition_line(c) for c in conditions)
    lines.append(f"Updated by: {username}")
    return "\n".join(lines)


def _payload(color: str, text: str) -> dict:
    return {
        "attachments": [
            {
                "color": color,
                "text": text,
                "mrkdwn_in": ["text"],
            }
        ]
    }


def render_flag_message(
    name: str,
    enabled: bool | None,
    actions: list[Action],
    conditions: list[ConditionInfo],
    username: str,
) -> dict:
    if Action.RESET_FLAG in actions:
        return _payload(
            GREY, _render_text(f"Flag `{name}`: *reset*", [], username)
        )
    state = "true" if enabled is True else "false"
    color = GREEN if enabled is True else RED
    return _payload(
        color, _render_text(f"Flag `{name}`: *{state}*", conditions, username)
    )


def render_value_message(
    name: str,
    enabled: bool | None,
    value_default: str,
    value_override: str,
    actions: list[ValueAction],
    conditions: list[ConditionInfo],
    username: str,
) -> dict:
    if ValueAction.RESET_VALUE in actions:
        return _payload(
            GREY, _render_text(f"Value `{name}`: *reset*", [], username)
        )
    state = "enabled" if enabled is True else "disabled"
    color = GREEN if enabled is True else RED
    title = (
        f"Value `{name}`: *{state}*,"
        f' override: "{value_override}" (default: "{value_default}")'
    )
    return _payload(color, _render_text(title, conditions, username))


def render_deleted_message(kind: str, name: str, username: str) -> dict:
    return _payload(
        GREY, _render_text(f"{kind} `{name}`: *deleted*", [], username)
    )


def render_test_message(name: str, username: str) -> dict:
    return _payload(
        GREEN,
        _render_text(
            "Test notifiction from featureflags service\n"
            f"Flag `{name}`: *true*",
            [],
            username,
        ),
    )


async def _load_username(conn: SAConnection, user_id: UUID) -> str:
    username = await select_scalar(
        conn,
        select([AuthUser.username]).where(AuthUser.id == user_id),
    )
    return username or "unknown"


async def _load_channels(conn: SAConnection, project_id: UUID) -> list:
    result = await conn.execute(
        select([NotificationChannel.name, NotificationChannel.webhook_url])
        .select_from(
            NotificationChannel.__table__.join(
                ProjectNotificationChannel.__table__,
                ProjectNotificationChannel.channel == NotificationChannel.id,
            )
        )
        .where(ProjectNotificationChannel.project == project_id)
    )
    return await result.fetchall()


async def _build_conditions(
    conn: SAConnection,
    raw_conditions: list[tuple[tuple[UUID, ...], str | None]],
) -> list[ConditionInfo]:
    check_ids = {
        check_id for checks, _ in raw_conditions for check_id in checks
    }
    checks_by_id: dict[UUID, CheckInfo] = {}
    if check_ids:
        result = await conn.execute(
            select(
                [
                    Check.id,
                    Check.operator,
                    Check.value_string,
                    Check.value_number,
                    Check.value_timestamp,
                    Check.value_set,
                    Variable.name.label("variable_name"),
                ]
            )
            .select_from(
                Check.__table__.join(
                    Variable.__table__, Check.variable == Variable.id
                )
            )
            .where(Check.id.in_(check_ids))
        )
        for row in await result.fetchall():
            checks_by_id[row.id] = CheckInfo(
                variable_name=row.variable_name,
                operator=row.operator,
                value=render_check_value(
                    row.value_string,
                    row.value_number,
                    row.value_timestamp,
                    row.value_set,
                ),
            )

    conditions = []
    for checks, value_override in raw_conditions:
        infos = [
            checks_by_id[check_id]
            for check_id in checks
            if check_id in checks_by_id
        ]
        if infos:
            conditions.append(
                ConditionInfo(checks=infos, value_override=value_override)
            )
    return conditions


async def _load_flag_conditions(
    conn: SAConnection, flag_id: UUID
) -> list[ConditionInfo]:
    result = await conn.execute(
        select([Condition.checks])
        .where(Condition.flag == flag_id)
        .order_by(Condition.position)
    )
    rows = await result.fetchall()
    return await _build_conditions(
        conn, [(tuple(row.checks or ()), None) for row in rows]
    )


async def _load_value_conditions(
    conn: SAConnection, value_id: UUID
) -> list[ConditionInfo]:
    result = await conn.execute(
        select([ValueCondition.checks, ValueCondition.value_override])
        .where(ValueCondition.value == value_id)
        .order_by(ValueCondition.position)
    )
    rows = await result.fetchall()
    return await _build_conditions(
        conn,
        [(tuple(row.checks or ()), row.value_override) for row in rows],
    )


class NotificationsService:
    """
    Sends Slack webhook notifications for flag/value changes.

    Delivery is best-effort: sends run in background tasks, failures are
    logged and counted, the request path never waits on Slack.
    """

    def __init__(self, transport: httpx.BaseTransport | None = None) -> None:
        self._transport = transport
        self._client: httpx.AsyncClient | None = None
        self._tasks: set[asyncio.Task] = set()

    @property
    def client(self) -> httpx.AsyncClient:
        if self._client is None:
            self._client = httpx.AsyncClient(
                timeout=5.0,
                transport=self._transport,
            )
        return self._client

    async def close(self) -> None:
        if self._client is not None:
            await self._client.aclose()
            self._client = None

    async def wait_idle(self) -> None:
        """Await all in-flight notification tasks (used in tests)."""
        while self._tasks:
            await asyncio.gather(*list(self._tasks))

    def _spawn(self, coro: Coroutine) -> None:
        task = asyncio.create_task(coro)
        self._tasks.add(task)
        task.add_done_callback(self._tasks.discard)

    def dispatch_flag_changes(
        self,
        engine: aiopg.sa.Engine,
        session: BaseUserSession,
        changes: Changes,
    ) -> None:
        actions = changes.get_actions()
        if actions and session.user is not None:
            self._spawn(self._notify_flags(engine, session.user, actions))

    def dispatch_value_changes(
        self,
        engine: aiopg.sa.Engine,
        session: BaseUserSession,
        changes: ValuesChanges,
    ) -> None:
        actions = changes.get_actions()
        if actions and session.user is not None:
            self._spawn(self._notify_values(engine, session.user, actions))

    def dispatch_flag_deleted(
        self,
        engine: aiopg.sa.Engine,
        session: BaseUserSession,
        flag_name: str,
        project_id: UUID,
    ) -> None:
        if session.user is not None:
            self._spawn(
                self._notify_deleted(
                    engine, session.user, project_id, "Flag", flag_name
                )
            )

    def dispatch_value_deleted(
        self,
        engine: aiopg.sa.Engine,
        session: BaseUserSession,
        value_name: str,
        project_id: UUID,
    ) -> None:
        if session.user is not None:
            self._spawn(
                self._notify_deleted(
                    engine, session.user, project_id, "Value", value_name
                )
            )

    async def send_test_notification(
        self,
        engine: aiopg.sa.Engine,
        session: BaseUserSession,
        name: str,
        webhook_url: str,
    ) -> None:
        username = "unknown"
        if session.user is not None:
            async with engine.acquire() as conn:
                username = await _load_username(conn, session.user)
        await self._send_strict(
            name,
            webhook_url,
            render_test_message(name, username),
        )

    async def _notify_flags(
        self,
        engine: aiopg.sa.Engine,
        user_id: UUID,
        flag_actions: list[tuple[UUID, list[Action]]],
    ) -> None:
        try:
            async with engine.acquire() as conn:
                username = await _load_username(conn, user_id)
                for flag_id, actions in flag_actions:
                    flag = await select_first(
                        conn,
                        select([Flag.name, Flag.enabled, Flag.project]).where(
                            Flag.id == flag_id
                        ),
                    )
                    if flag is None:
                        continue
                    channels = await _load_channels(conn, flag.project)
                    if not channels:
                        continue
                    conditions = await _load_flag_conditions(conn, flag_id)
                    payload = render_flag_message(
                        flag.name,
                        flag.enabled,
                        actions,
                        conditions,
                        username,
                    )
                    await self._send_all(channels, payload)
        except Exception:
            log.exception("Failed to send flag change notifications")

    async def _notify_values(
        self,
        engine: aiopg.sa.Engine,
        user_id: UUID,
        value_actions: list[tuple[UUID, list[ValueAction]]],
    ) -> None:
        try:
            async with engine.acquire() as conn:
                username = await _load_username(conn, user_id)
                for value_id, actions in value_actions:
                    value = await select_first(
                        conn,
                        select(
                            [
                                Value.name,
                                Value.enabled,
                                Value.value_default,
                                Value.value_override,
                                Value.project,
                            ]
                        ).where(Value.id == value_id),
                    )
                    if value is None:
                        continue
                    channels = await _load_channels(conn, value.project)
                    if not channels:
                        continue
                    conditions = await _load_value_conditions(conn, value_id)
                    payload = render_value_message(
                        value.name,
                        value.enabled,
                        value.value_default,
                        value.value_override,
                        actions,
                        conditions,
                        username,
                    )
                    await self._send_all(channels, payload)
        except Exception:
            log.exception("Failed to send value change notifications")

    async def _notify_deleted(
        self,
        engine: aiopg.sa.Engine,
        user_id: UUID,
        project_id: UUID,
        kind: str,
        name: str,
    ) -> None:
        try:
            async with engine.acquire() as conn:
                username = await _load_username(conn, user_id)
                channels = await _load_channels(conn, project_id)
            if not channels:
                return
            payload = render_deleted_message(kind, name, username)
            await self._send_all(channels, payload)
        except Exception:
            log.exception("Failed to send delete notification")

    async def _send_all(self, channels: list, payload: dict) -> None:
        await asyncio.gather(
            *[
                self._send(channel.name, channel.webhook_url, payload)
                for channel in channels
            ]
        )

    async def _post(self, url: str, payload: dict) -> None:
        response = await self.client.post(url, json=payload)
        if response.status_code >= HTTP_ERROR_STATUS:
            raise RuntimeError(
                f"unexpected response status {response.status_code}:"
                f" {response.text}"
            )

    async def _send_strict(self, name: str, url: str, payload: dict) -> None:
        try:
            await self._post(url, payload)
        except Exception:
            SLACK_NOTIFICATION_ERRORS_COUNTER.labels(channel=name).inc()
            raise
        else:
            SLACK_NOTIFICATIONS_COUNTER.labels(channel=name).inc()

    async def _send(self, name: str, url: str, payload: dict) -> None:
        try:
            await self._send_strict(name, url, payload)
        except Exception as e:
            log.warning("Slack notification to channel %r failed: %s", name, e)
