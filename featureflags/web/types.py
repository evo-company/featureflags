from typing import Any

from pydantic import BaseModel


class GraphQueryRequest(BaseModel):
    query: str
    operationName: str | None = None  # noqa: N815
    variables: dict[str, Any] | None = None
