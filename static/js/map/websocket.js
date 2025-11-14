import { updateMap } from "./map.js";

let ws = null;
let reconnectTimeout = null;

const connection_info_block = document.querySelectorAll(
  ".connection-info-block div"
);
const connection_state = connection_info_block[0].querySelector("span");

function connectWebSocket() {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const wsUrl = `ws://${window.location.host}/ws`;

  ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    connection_state.textContent = "Подключено";
    connection_state.style.color = "green";
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "update") {
      // console.log(data);
      updateMap(data.data);
    }
  };

  ws.onclose = () => {
    connection_state.textContent = "Отключено ✗";
    connection_state.style.color = "red";
    reconnect();
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
    reconnect();
  };
}

function reconnect() {
  if (reconnectTimeout) clearTimeout(reconnectTimeout);
  reconnectTimeout = setTimeout(() => {
    connection_state.textContent = "Переподключение...";
    connectWebSocket();
  }, 3000);
}

connectWebSocket();
