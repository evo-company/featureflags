from dependency_injector.wiring import Provide, inject
from fastapi import APIRouter, Depends

from featureflags.http.container import Container
from featureflags.http.repositories.flags import FlagsRepository
from featureflags.http.types import (
    PreloadFlagsRequest,
    PreloadFlagsResponse,
    SyncFlagsRequest,
    SyncFlagsResponse,
)

router = APIRouter(prefix="/flags", tags=["flags"])


@router.post("/load")
@inject
async def load_flags(
    request: PreloadFlagsRequest,
    flags_repo: FlagsRepository = Depends(Provide[Container.flags_repo]),
) -> PreloadFlagsResponse:
    """
    Init flags for project and load flags.
    """

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

    return await flags_repo.sync(request)
