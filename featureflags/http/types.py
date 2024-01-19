from typing import Any

from pydantic import BaseModel, Field, model_validator

from featureflags.models import Operator, VariableType


class CheckVariable(BaseModel):
    name: str
    type: VariableType


# Possible value fields for different types of variables.
CHECK_VALUE_FIELDS = (
    "value_string",
    "value_number",
    "value_timestamp",
    "value_set",
)


class Check(BaseModel):
    variable: CheckVariable
    operator: Operator
    value: str | float | list | None = None

    @model_validator(mode="before")
    def check_and_assign_value(
        cls,  # noqa: N805
        values: dict[str, Any],
    ) -> dict[str, Any]:
        for field in CHECK_VALUE_FIELDS:
            if field in values and values[field] is not None:
                values["value"] = values[field]
                break
        return values


class Condition(BaseModel):
    checks: list[Check]


class Flag(BaseModel):
    name: str
    enabled: bool
    overridden: bool
    conditions: list[Condition]


class Variable(BaseModel):
    name: str
    type: VariableType


class PreloadFlagsRequest(BaseModel):
    project: str
    version: int
    variables: list[Variable] = Field(default_factory=list)
    flags: list[str] = Field(default_factory=list)


class PreloadFlagsResponse(BaseModel):
    flags: list[Flag] = Field(default_factory=list)
    version: int


class SyncFlagsRequest(BaseModel):
    project: str
    version: int
    flags: list[str] = Field(default_factory=list)


class SyncFlagsResponse(BaseModel):
    flags: list[Flag] = Field(default_factory=list)
    version: int
