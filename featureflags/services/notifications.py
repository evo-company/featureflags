import logging
from dataclasses import dataclass
from datetime import datetime

from featureflags.graph.types import Action, ValueAction
from featureflags.models import Operator

log = logging.getLogger(__name__)

GREEN = "#36a64f"
RED = "#d63232"
GREY = "#aaaaaa"

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
    lines.append(f"Updated: {username}")
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
            GREY, _render_text(f"Flag `{name}`: reset", [], username)
        )
    state = "true" if enabled is True else "false"
    color = GREEN if enabled is True else RED
    return _payload(
        color, _render_text(f"Flag `{name}`: {state}", conditions, username)
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
            GREY, _render_text(f"Value `{name}`: reset", [], username)
        )
    state = "enabled" if enabled is True else "disabled"
    color = GREEN if enabled is True else RED
    title = (
        f"Value `{name}`: {state},"
        f' override: "{value_override}" (default: "{value_default}")'
    )
    return _payload(color, _render_text(title, conditions, username))


def render_deleted_message(kind: str, name: str, username: str) -> dict:
    return _payload(
        GREY, _render_text(f"{kind} `{name}`: deleted", [], username)
    )
