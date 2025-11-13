import { updateMap } from "./map.js";

let ws = null;
let reconnectTimeout = null;

function connectWebSocket() {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const wsUrl = `ws://${window.location.host}/ws`;

  ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    document.getElementById("status").textContent = "Подключено ✓";
    document.getElementById("status").style.color = "green";
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === "update") {
      // console.log(data);
      updateMap(data.data);
    }
  };

  ws.onclose = () => {
    document.getElementById("status").textContent = "Отключено ✗";
    document.getElementById("status").style.color = "red";
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
    document.getElementById("status").textContent = "Переподключение...";
    connectWebSocket();
  }, 3000);
}

connectWebSocket();
