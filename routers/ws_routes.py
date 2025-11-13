import time
import json
import asyncio
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter()
logger = logging.getLogger(__name__)

from ..config import latest_data, connected_clients

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.add(websocket)

    try:
        # Отправляем текущие данные при подключении
        if latest_data:
            await websocket.send_text(json.dumps({
                'type': 'update',
                'data': latest_data,
                'timestamp': time.time()
            }))

        # Поддерживаем соединение активным
        while True:
            await asyncio.sleep(10)
            await websocket.send_text(json.dumps({'type': 'ping'}))

    except WebSocketDisconnect:
        logger.info("Клиент отключился")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        connected_clients.remove(websocket)