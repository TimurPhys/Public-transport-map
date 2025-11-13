from fastapi import FastAPI
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from .utils.data_poller import data_poller
from .routers import views, ws_routes
from .config import latest_data, connected_clients
import asyncio
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager # Запускаем поллер при старте приложения
async def lifespan(app: FastAPI):
    asyncio.create_task(data_poller(latest_data, connected_clients)) # Создаем задачу, для поллинга даннных и отправки данных каждому клиенту
    logger.info("Сервер запущен")
    yield
    logger.info("Сервер остановлен")

app = FastAPI(title="Real Time Transport Tracker", lifespan=lifespan)

app.mount("/static", StaticFiles(directory="app/static"), name="static")

app.include_router(views.router)
app.include_router(ws_routes.router)
