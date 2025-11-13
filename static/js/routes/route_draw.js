import { map } from "../map/map.js";
import { new_routes } from "./routes.js";

let waypoints = [];
let routingControl = null;
let old_coords_size = 0;

function areCoordinatesEqual(coord1, coord2, precision = 0.0001) {
  return (
    Math.abs(coord1.lat - coord2.lat) < precision &&
    Math.abs(coord1.lng - coord2.lng) < precision
  );
}

map.on("click", function (e) {
  const latlng = L.latLng(e.latlng["lat"], e.latlng["lng"]);
  const index = waypoints.findIndex((wp) => areCoordinatesEqual(wp, latlng));

  if (index !== -1) {
    if (waypoints.length <= 2) {
      waypoints = [];
      console.log("Массив очищен!");
    } else {
      waypoints.splice(index, 1);
      console.log("Точка была удалена");
    }
  } else {
    waypoints.push(latlng);
  }

  if (routingControl !== null) {
    if (routingControl._routes) {
      old_coords_size = routingControl._routes[0].coordinates.length;
    }
    map.removeControl(routingControl);
  }

  routingControl = L.Routing.control({
    waypoints: waypoints,
    routeWhileDragging: true,
    fitSelectedRoutes: false,
    lineOptions: {
      styles: [{ color: "blue", opacity: 0.6, weight: 4 }],
    },
    show: false,
    router: L.Routing.osrmv1({
      serviceUrl: "https://router.project-osrm.org/route/v1",
    }),
  }).addTo(map);

  // Убираем контейнер с текстом о маршруте
  const routingContainer = document.querySelector(".leaflet-routing-container");
  if (routingContainer) {
    routingContainer.style.display = "none";
  }
});

const save_button = document.querySelector(".save-btn");
save_button.addEventListener("click", () => {
  if (routingControl && waypoints.length >= 2) {
    save_button.textContent = "Маршрут сохранен";
    save_button.className = "btn btn-info save-btn";

    const coords = routingControl._routes[0].coordinates;
    console.log(coords);
    // const compressed = JSON.stringify(coords);
    const polyline = L.polyline(coords, { color: "#c92828ff" }).addTo(map);

    map.removeControl(routingControl);

    console.log(`Маршрут сохранен!`);
  }
});

const hand_mode_button = document.querySelector(".hand-mode");
hand_mode_button.addEventListener("click", () => {
  console.log(`Нужно удалить элемент c ${old_coords_size - 1} до 
    ${routingControl._routes[0].coordinates.length - 1} индекса`);
});

// const routeLine = L.polyline(new_routes[9]["m1"]["trajectory"], {
//   color: "red", // цвет линии
//   weight: 4, // толщина
//   opacity: 0.8, // прозрачность (0–1)
//   dashArray: "5, 2", // пунктир (можно убрать)
//   lineJoin: "round", // сглаженные стыки
// }).addTo(map);

// const input = document.querySelector(".form input");

// map.on("click", function (e) {
//   let markerL = e.latlng;
//   let marker = L.marker(markerL, {
//     title: "Marker",
//   });
//   if (input.value !== "") {
//     marker.addTo(map);
//     const station = [
//       input.value,
//       [e.latlng["lat"].toFixed(8), e.latlng["lng"].toFixed(8)],
//     ];
//     stations.push(station);
//     input.value = "";
//     console.log(stations);
//   } else {
//     console.log("Поле названия остановки пустое");
//   }
// });
