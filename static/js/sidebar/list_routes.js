import { new_routes, buses, minibuses } from "../routes/routes.js";

const routeLists = {
  bus: document.getElementById("busRouteList"),
  minibus: document.getElementById("minibusRouteList"),
  tram: document.getElementById("tramRouteList"),
};

Object.values(routeLists).forEach((list) => (list.innerHTML = ""));

const sorted_route_names = Object.keys(new_routes)
  .map((str) => {
    const numbersMatch = str.match(/\d+/g);
    const numbers = numbersMatch ? parseInt(numbersMatch[0]) : 0;
    const letters = (str.match(/[a-zA-Z]+/g) || [""])[0];
    return {
      numbers: numbers,
      letters: letters,
    };
  })
  .sort((a, b) => a.numbers - b.numbers)
  .map((obj) =>
    obj.numbers !== 0
      ? `${obj.numbers.toString()}${obj.letters}`
      : `${obj.letters}`
  );

for (const route_name of sorted_route_names) {
  let type = null;
  if (buses.includes(route_name)) {
    type = "bus";
  } else if (minibuses.includes(route_name)) {
    type = "minibus";
  } else {
    type = "tram";
  }
  const list = routeLists[type];

  const stationsArrayLength = new_routes[route_name]["m1"]["stations"].length;
  const first_station = new_routes[route_name]["m1"]["stations"][0]["name"];
  const last_station =
    new_routes[route_name]["m1"]["stations"][stationsArrayLength - 1]["name"];

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className =
    "list-group-item list-group-item-action d-flex align-items-center route-item";
  btn.dataset.routeId = route_name;

  btn.innerHTML = `
    <span class="badge bg-primary me-2 route-badge">${route_name}</span>
    <div class="flex-grow-1">
      <div class="fw-semibold">${first_station} - ${last_station}</div>
    </div>
    <span class="ms-2 text-muted small">&rsaquo;</span>
  `;

  list.appendChild(btn);
}

const route_items = document.querySelectorAll("button.route-item");
route_items.forEach((route_item) => {
  route_item.addEventListener("click", (e) => {
    const route_name = route_item.querySelector("span.badge").textContent;
    console.log(route_name);
  });
});
