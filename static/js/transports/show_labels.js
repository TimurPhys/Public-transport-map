import { routeState, totalState } from "../map/map.js";
import {
  showOnlyChosenTransport,
  deletePolyline,
  clearMarkers,
} from "../map/handle_marker_click.js";

const image_from_type = {
  Трамвай: "tram/real_tram.png",
  Автобус: "bus/real_bus.jpg",
  Маршрутка: "minibus/real_minibus.png",
};

function showPanel(map, vehicle) {
  const type = vehicle["type"];

  card.style.display = "block"; // чтобы элемент был видим
  setTimeout(() => (card.style.opacity = "1"), 10);
  const image = document.querySelector(".transport-card .card-body img");
  image.src = `../static/img/${image_from_type[type]}`;

  const title = document.querySelector(
    ".transport-card .card-body .card-title"
  );
  title.innerHTML = "Тип: " + type;
  const route = document.querySelector(".transport-card .list-group .route");
  route.innerHTML = "Маршрут: " + `<b>${vehicle["route"]}</b>`;
  const number = document.querySelector(".transport-card .list-group .number");
  number.innerHTML = "Номер: " + `<b>${vehicle["number"]}</b>`;

  const lat = vehicle["marker"].getLatLng()["lat"];
  const lang = vehicle["marker"].getLatLng()["lng"];
  const latlng = [lat, lang];

  map.setView(latlng, map.getZoom());
}

const close_button = document.querySelector(".transport-card .close-button");
const card = document.querySelector(".transports-info-window");

if (close_button !== null) {
  close_button.addEventListener("click", () => {
    deletePolyline(routeState);
    clearMarkers(routeState);
    showOnlyChosenTransport(
      routeState,
      totalState.map_vehicles,
      "number",
      true
    );
    card.style.opacity = "0";
    setTimeout(() => (card.style.display = "none"), 500); // убрать из потока после анимации
  });
}

export { showPanel };
