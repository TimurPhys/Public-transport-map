import { map } from "./map.js";
import { stationIcon } from "./style/markers.js";
import { new_routes } from "../routes/routes.js";
import { getCorrectTrajectory } from "./correct_trajectory_choice.js";

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

function showOnlyChosenTransport(
  routeState,
  all_vehicles = [],
  showAll = false
) {
  const chosenTransportNumber = routeState.currentNumber;
  const chosenTransportMarker = all_vehicles.find(
    (vehicle) => vehicle.number === chosenTransportNumber
  )["marker"];
  const all_markers = all_vehicles.map((vehicle) => vehicle.marker);
  for (const marker of all_markers) {
    if (!showAll) {
      if (marker !== chosenTransportMarker) {
        map.removeLayer(marker);
      }
    } else {
      if (marker !== chosenTransportMarker) {
        marker.addTo(map);
      }
    }
  }
}

function showMarkersRoute(routeState, totalState) {
  deletePolyline(routeState);
  showOnlyChosenTransport(routeState, totalState.map_vehicles);

  const route = routeState.currentRoute;
  routeState.currentPolyline = L.polyline(
    new_routes[route][getCorrectTrajectory(routeState)]["trajectory"],
    {
      color: "red",
      weight: 3,
      opacity: 0.7,
      lineJoin: "round",
    }
  ).addTo(map);
  const stations = new_routes[route]["m1"]["stations"];
  clearMarkers(routeState);
  for (const station of stations) {
    const marker = L.marker(station.coords, {
      icon: stationIcon,
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
