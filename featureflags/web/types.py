from typing import Any

from pydantic import BaseModel


class GraphQueryRequest(BaseModel):
    operationName: str  # noqa: N815
    variables: dict[str, Any]
    query: str
