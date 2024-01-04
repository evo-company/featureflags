from fastapi import APIRouter
from fastapi.responses import ORJSONResponse

router = APIRouter(prefix="/~health", tags=["health"])


@router.get("")
async def health() -> ORJSONResponse:
    return ORJSONResponse(content={"status": "ok"})
