from fastapi import Request
from fastapi.responses import FileResponse
from fastapi.templating import Jinja2Templates
from fastapi import APIRouter

router = APIRouter()

templates = Jinja2Templates(directory="app/templates")

@router.get("/", response_class=FileResponse)
async def get_html(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@router.get("/manifest.json", response_class=FileResponse)
async def get_manifest():
    return "app/manifest.json"

@router.get("/sw.js", response_class=FileResponse)
async def get_service_worker():
    return "/app/static/js/pwa/sw.js"