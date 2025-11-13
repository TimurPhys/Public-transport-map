import createLayers from "./style/map_styles.js";
import { createCustomIcon } from "./style/markers.js";
import { allowed_transports } from "../transports/script.js";
import { showPanel } from "../transports/show_labels.js";
import { showMarkersRoute } from "./handle_marker_click.js";
import { routes, polylines, buses, minibuses } from "../routes/routes.js";

const map = L.map("map").setView([56.49, 21.02], 15);

const tiles = createLayers().google_maps;
tiles.addTo(map);

let map_vehicles = [];

function vehicle_init(vehicle) {
  let type = null;
  let icon = null;
  if (buses.includes(vehicle["route"])) {
    type = "Автобус";
    icon = createCustomIcon("bus", vehicle["route"], vehicle["azimuth"]);
  } else if (minibuses.includes(vehicle["route"])) {
    type = "Маршрутка";
    icon = createCustomIcon("minibus", vehicle["route"], vehicle["azimuth"]);
  } else {
    type = "Трамвай";
    icon = createCustomIcon("tram", vehicle["route"], vehicle["azimuth"]);
  }
  return {
    type: type,
    icon: icon,
  };
}
let currentIds = new Set();

function updateMap(vehicles) {
  document.getElementById(
    "count"
  ).textContent = `Транспортов: ${vehicles.length}`;

  // Обновляем маркеры
  vehicles.forEach((vehicle) => {
    if (vehicle["route"] !== "") {
      const latlng = [vehicle["long"], vehicle["lat"]];

      if (
        !map_vehicles.find(
          (map_vehicle) => map_vehicle["number"] === vehicle["number"]
        )
      ) {
        const settings = vehicle_init(vehicle);
        const marker = L.marker(latlng, {
          title: `Транспорт ${vehicle["route"]}`,
          icon: settings["icon"],
        });
        vehicle["type"] = settings["type"];
        vehicle["marker"] = marker;

        if (allowed_transports.includes(vehicle["type"])) {
          // Рисую
          currentIds.add(vehicle["number"]);
          map_vehicles.push(vehicle); // Добавляю в массив
          vehicle["marker"].addTo(map); // Добавляем маркер на карте

          vehicle["marker"].bindPopup(`
                                <b>Номер: ${vehicle["number"]}</b><br>
                                Тип: ${vehicle["type"]}<br>
                                Маршрут: ${vehicle["route"]}
                            `); // Добавляем всплывающее окно
          vehicle["marker"].on("click", () => {
            // Привязываю обработчик нажатий
            showMarkersRoute(vehicle);
            showPanel(map, vehicle);
          });
        }
      } else {
        const vehicle_to_update = map_vehicles.find(
          (map_vehicle) => map_vehicle["number"] === vehicle["number"]
        );
        if (vehicle_to_update["route"] == "T") {
          updatePosition(vehicle_to_update, latlng);
        } else {
          vehicle_to_update["marker"].setLatLng(latlng);
        }
      }
    }
  });
  // Удаляем старые маркеры
  for (let i = map_vehicles.length - 1; i >= 0; i--) {
    const map_vehicle = map_vehicles[i];

    if (!currentIds.has(map_vehicle["number"])) {
      map.removeLayer(map_vehicle["marker"]);
      map_vehicles.splice(i, 1); // Удаляем текущий элемент
    }
  }
}

function updatePosition(vehicle_to_update, new_latlng) {
  const latlng = L.latLng(new_latlng[0], new_latlng[1]);
  // Находим ближайшую точку на маршруте
  const closestPoint = L.GeometryUtil.closest(
    map,
    polylines[vehicle_to_update["route"]],
    latlng
  );

  // Ставим маркер на ближайшую точку
  vehicle_to_update["marker"].setLatLng(closestPoint);
}

function refreshTransports() {
  for (let i = map_vehicles.length - 1; i >= 0; i--) {
    const map_vehicle = map_vehicles[i];
    const transport_type = map_vehicle["type"];

    if (!allowed_transports.includes(transport_type)) {
      map.removeLayer(map_vehicle["marker"]);
      map_vehicles.splice(i, 1); // Удаляем текущий элемент
    }
  }
}
// -----------------------------------------------------------------------

export { map };
export { updateMap };
export { refreshTransports };
