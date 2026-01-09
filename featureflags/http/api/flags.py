from dependency_injector.wiring import Provide, inject
from fastapi import APIRouter, Depends
from prometheus_client import Counter

from featureflags.http.container import Container
from featureflags.http.repositories.flags import FlagsRepository
from featureflags.http.types import (
    PreloadFlagsRequest,
    PreloadFlagsResponse,
    SyncFlagsRequest,
    SyncFlagsResponse,
)

router = APIRouter(prefix="/flags", tags=["flags"])


http_request_total_per_project = Counter(
    "http_request_total_per_project",
    "Total number of requests by handler and project.",
    labelnames=["handler", "project"],
)


@router.post("/load")
@inject
async def load_flags(
    request: PreloadFlagsRequest,
    flags_repo: FlagsRepository = Depends(Provide[Container.flags_repo]),
) -> PreloadFlagsResponse:
    """
    Init flags for project and load flags.
    """

    http_request_total_per_project.labels("/load", request.project).inc()
    return await flags_repo.load(request)


@router.post("/sync")
@inject
async def sync_flags(
    request: SyncFlagsRequest,
    flags_repo: FlagsRepository = Depends(Provide[Container.flags_repo]),
) -> SyncFlagsResponse:
    """
    Sync flags for project.
    """

    http_request_total_per_project.labels("/sync", request.project).inc()
    return await flags_repo.sync(request)
