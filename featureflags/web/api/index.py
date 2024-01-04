from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates

from featureflags.web.constants import STATIC_DIR

router = APIRouter(tags=["index"])

templates = Jinja2Templates(directory=STATIC_DIR)


@router.get("/", response_model=None)  # TODO: check
async def index(request: Request) -> templates.TemplateResponse:
    return templates.TemplateResponse(
        name="index.html",
        context={"request": request},
    )
