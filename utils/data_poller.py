import asyncio
import json
import logging
from ..services.site_parser import parse_website
import time

logger = logging.getLogger(__name__)


async def data_poller(latest_data, connected_clients):
    while True:
        try:
            new_data = await parse_website(int(time.time()))
            latest_data.clear()
            latest_data.extend(new_data)

            if new_data and connected_clients:
                message = json.dumps({
                    'type': 'update',
                    'data': new_data,
                    'timestamp': time.time()
                })

                tasks = [client.send_text(message) for client in connected_clients]
                await asyncio.gather(*tasks, return_exceptions=True) # Собираем все задачи, т.е. отпраялем сообщение каждому клиенту, gather делает именно это, а мы ждем когда он завершится

            logger.info(f"Данные обновлены: {len(new_data)} транспортов")
        
        except Exception as e:
            logger.error(f"Ошибка при получении данных: {e}")
    
        await asyncio.sleep(3)