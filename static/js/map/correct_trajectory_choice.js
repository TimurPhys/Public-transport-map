import { map } from "./map.js";
import { new_routes } from "../routes/routes.js";

function distanceToPolyline(point, pointsArray) {
  const polyline = L.polyline(pointsArray, {
    color: "red",
    weight: 3,
    opacity: 0.7,
    lineJoin: "round",
  });

  const turfPoint = turf.point([point.lng, point.lat]);
  const turfLine = turf.lineString(
    polyline.getLatLngs().map((latlng) => [latlng.lng, latlng.lat])
  );

  return turf.nearestPointOnLine(turfLine, turfPoint).properties.dist;
}

function getCorrectTrajectory(routeState) {
  const d1 = distanceToPolyline(
    routeState.latlng,
    new_routes[routeState.currentRoute]["m1"]["trajectory"]
  );
  const d2 = distanceToPolyline(
    routeState.latlng,
    new_routes[routeState.currentRoute]["m2"]["trajectory"]
  );

  console.log(`${d1} метров`);
  console.log(`${d2} метров`);

  if (d2 >= d1 * 2) {
    // Если расстояние до второй линии много больше, чем до первой, то реальный маршрут m1
    return "m1";
  } else if (d1 >= d2 * 2) {
    // Если расстояние до первой линии много больше, чем до второй, то реальный маршрут m2
    return "m2";
  } else {
    return "m1";
  }
}

export { getCorrectTrajectory };
