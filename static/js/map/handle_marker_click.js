import { map } from "./map.js";
import { new_routes } from "../routes/routes.js";

function showMarkersRoute(marker) {
  const route = marker["route"];
  const polyline = L.polyline(new_routes[route]["m1"]["trajectory"], {
    color: "red",
    weight: 3,
    opacity: 0.7,
    lineJoin: "round",
  }).addTo(map);
}

export { showMarkersRoute };
