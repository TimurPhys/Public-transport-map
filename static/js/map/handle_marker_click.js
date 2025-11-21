import { map, showStations } from "./map.js";
import { getStationIcon } from "./style/markers.js";
import { new_routes } from "../routes/routes.js";
import { getCorrectTrajectory } from "./correct_trajectory_choice.js";
import {
  checkboxes,
  show_stations_checkbox,
} from "../transports/filter_transport.js";

function deletePolyline(routeState) {
  if (routeState.currentPolyline !== null) {
    map.removeLayer(routeState.currentPolyline);
    routeState.currentPolyline = null;
  }
}

function clearMarkers(routeState) {
  if (routeState.currentMarkers.length > 0) {
    for (const marker of routeState.currentMarkers) {
      map.removeLayer(marker);
    }
    routeState.currentMarkers.length = 0;
  }
}

function disableCheckboxes(onOff) {
  checkboxes.forEach((checkbox) => {
    checkbox.disabled = onOff;
  });
  show_stations_checkbox.disabled = onOff;
}

function showOnlyChosenTransport(
  routeState,
  all_vehicles = [],
  filter_after_what = "number",
  showAll = false
) {
  let chosenTransportsMarkers = null;
  if (filter_after_what === "number") {
    const chosenTransportNumber = routeState.currentNumber;
    chosenTransportsMarkers = all_vehicles
      .filter((vehicle) => vehicle.number === chosenTransportNumber)
      .map((value) => value["marker"]);
  } else if (filter_after_what === "route_name") {
    const chosenTransportNumber = routeState.currentRoute;
    chosenTransportsMarkers = all_vehicles
      .filter((vehicle) => vehicle.route === chosenTransportNumber)
      .map((value) => value["marker"]);
  }
  const all_markers = all_vehicles.map((vehicle) => vehicle.marker);
  for (const marker of all_markers) {
    if (!showAll) {
      if (!chosenTransportsMarkers.includes(marker)) {
        map.removeLayer(marker);
      }
    } else {
      if (!chosenTransportsMarkers.includes(marker)) {
        marker.addTo(map);
      }
    }
  }
  if (!showAll) {
    showStations(false);
    disableCheckboxes(true);
  } else {
    showStations(show_stations_checkbox.checked);
    disableCheckboxes(false);
  }
}

function showMarkersRoute(
  routeState,
  totalState,
  direction = getCorrectTrajectory(routeState),
  filter_after_what = "number"
) {
  deletePolyline(routeState);
  showOnlyChosenTransport(
    routeState,
    totalState.map_vehicles,
    filter_after_what
  );
  const route = routeState.currentRoute;
  console.log(route);

  let direction_option = null;
  if (filter_after_what === "number") {
    direction_option = direction;
  } else if (filter_after_what === "route_name") {
    direction_option = getCorrectRouteOption(routeState, direction);
  }

  routeState.currentPolyline = L.polyline(
    new_routes[route][direction_option]["trajectory"],
    {
      color: "red",
      weight: 3,
      opacity: 0.7,
      lineJoin: "round",
    }
  ).addTo(map);
  map.fitBounds(routeState.currentPolyline.getBounds());
  attachNewMarkers(routeState, direction_option);
}

function getCorrectRouteOption(routeState, direction) {
  const route = routeState.currentRoute;
  const firstStation = direction.split(" - ")[0];
  const lastStation = direction.split(" - ")[1];

  let correct_route_option = null;
  for (const route_option in new_routes[route]) {
    const stations = new_routes[route][route_option]["stations"];
    const stations_length = stations.length;
    if (
      stations[0]["name"] === firstStation &&
      stations[stations_length - 1]["name"] === lastStation
    ) {
      correct_route_option = route_option;
      break;
    }
  }
  return correct_route_option;
}

function attachNewMarkers(routeState, route_option) {
  const route = routeState.currentRoute;
  const stations = new_routes[route][route_option]["stations"];
  clearMarkers(routeState);
  for (const station of stations) {
    const marker = L.marker(station.coords, {
      icon: getStationIcon("stationIcon", 1),
    }).addTo(map);
    marker.bindPopup(`<b>${station.name}</b>`);
    routeState.currentMarkers.push(marker);
  }
}

export {
  showMarkersRoute,
  showOnlyChosenTransport,
  deletePolyline,
  clearMarkers,
};
