from collections import defaultdict
from dataclasses import dataclass
from enum import Enum
from typing import NamedTuple
from uuid import UUID


class GraphContext(Enum):
    DB_ENGINE = "DB_ENGINE"
    USER_SESSION = "USER_SESSION"
    LDAP_SERVICE = "LDAP_SERVICE"
    DIRTY_PROJECTS = "DIRTY_PROJECTS"
    CHANGES = "CHANGES"
    VALUES_CHANGES = "VALUES_CHANGES"
    CHECK_IDS = "CHECK_IDS"


class Operation(Enum):
    DISABLE_FLAG = "disable_flag"
    ENABLE_FLAG = "enable_flag"
    ADD_CHECK = "add_check"
    ADD_CONDITION = "add_condition"
    DISABLE_CONDITION = "disable_condition"
    DISABLE_VALUE = "disable_value"
    ENABLE_VALUE = "enable_value"
    ADD_VALUE_CONDITION = "add_value_condition"
    DISABLE_VALUE_CONDITION = "disable_value_condition"
    UPDATE_VALUE_VALUE_OVERRIDE = "update_value_value_override"


class Action(Enum):
    ENABLE_FLAG = 1
    DISABLE_FLAG = 2
    ADD_CONDITION = 3
    DISABLE_CONDITION = 4
    RESET_FLAG = 5
    DELETE_FLAG = 6


class ValueAction(Enum):
    ENABLE_VALUE = 1
    DISABLE_VALUE = 2
    ADD_CONDITION = 3
    DISABLE_CONDITION = 4
    RESET_VALUE = 5
    DELETE_VALUE = 6
    UPDATE_VALUE_VALUE_OVERRIDE = 7


class DirtyProjects:
    def __init__(self) -> None:
        self.by_flag: set[UUID] = set()
        self.by_value: set[UUID] = set()
        self.by_variable: set[UUID] = set()


class Changes:
    _data: dict[UUID, list[Action]]

    def __init__(self) -> None:
        self._data = defaultdict(list)

    def add(self, flag_id: UUID, action: Action) -> None:
        self._data[flag_id].append(action)

    def get_actions(self) -> list[tuple[UUID, list[Action]]]:
        return list(self._data.items())


class ValuesChanges:
    _data: dict[UUID, list[ValueAction]]

    def __init__(self) -> None:
        self._data = defaultdict(list)

    def add(self, value_id: UUID, action: ValueAction) -> None:
        self._data[value_id].append(action)

    def get_actions(self) -> list[tuple[UUID, list[ValueAction]]]:
        return list(self._data.items())


@dataclass
class LocalId:
    scope: str
    value: str

    def __hash__(self) -> int:
        return hash((self.scope, self.value))


@dataclass
class AddCheckOp:
    local_id: LocalId
    variable: str
    operator: int
    kind: str
    value_string: str | None = None
    value_number: int | float | None = None
    value_timestamp: str | None = None
    value_set: list | None = None

    def __init__(self, op: dict):
        self.local_id = LocalId(
            scope=op["local_id"]["scope"],
            value=op["local_id"]["value"],
        )
        self.variable = op["variable"]
        self.operator = int(op["operator"])
        self.kind = op["kind"]
        self.value_string = op.get("value_string")
        self.value_number = op.get("value_number")
        self.value_timestamp = op.get("value_timestamp")
        self.value_set = op.get("value_set")


@dataclass
class AddConditionOp:
    @dataclass
    class Check:
        local_id: LocalId | None = None
        id: str | None = None

    flag_id: str
    local_id: LocalId
    checks: list[Check]

    def __init__(self, op: dict):
        self.local_id = LocalId(
            scope=op["local_id"]["scope"],
            value=op["local_id"]["value"],
        )
        self.flag_id = op["flag_id"]
        self.checks = [
            self.Check(
                local_id=LocalId(
                    scope=check["local_id"]["scope"],
                    value=check["local_id"]["value"],
                )
                if "local_id" in check
                else None,
                id=check.get("id"),
            )
            for check in op["checks"]
        ]


@dataclass
class AddValueConditionOp:
    @dataclass
    class Check:
        local_id: LocalId | None = None
        id: str | None = None

    value_id: str
    local_id: LocalId
    checks: list[Check]

    def __init__(self, op: dict):
        self.local_id = LocalId(
            scope=op["local_id"]["scope"],
            value=op["local_id"]["value"],
        )
        self.value_id = op["value_id"]
        self.checks = [
            self.Check(
                local_id=LocalId(
                    scope=check["local_id"]["scope"],
                    value=check["local_id"]["value"],
                )
                if "local_id" in check
                else None,
                id=check.get("id"),
            )
            for check in op["checks"]
        ]


class AuthResult(NamedTuple):
    error: str | None = None


class SaveFlagResult(NamedTuple):
    errors: list[str] | None = None


class ResetFlagResult(NamedTuple):
    error: str | None = None


class DeleteFlagResult(NamedTuple):
    error: str | None = None


class SaveValueResult(NamedTuple):
    errors: list[str] | None = None


class ResetValueResult(NamedTuple):
    error: str | None = None


class DeleteValueResult(NamedTuple):
    error: str | None = None
