import { refreshTransports, showStations } from "../map/map.js";

let allowed_transports = ["Трамвай", "Автобус", "Маршрутка"];

const checkboxes = document
  .querySelector(".transports-show")
  .querySelectorAll("input");

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", (e) => {
    switch (checkbox.id) {
      case "filterBus":
        if (checkbox.checked) {
          allowed_transports.push("Автобус");
        } else {
          allowed_transports.splice(allowed_transports.indexOf("Автобус"), 1);
        }
        break;
      case "filterTram":
        if (checkbox.checked) {
          allowed_transports.push("Трамвай");
        } else {
          allowed_transports.splice(allowed_transports.indexOf("Трамвай"), 1);
        }
        break;
      case "filterMinibus":
        if (checkbox.checked) {
          allowed_transports.push("Маршрутка");
        } else {
          allowed_transports.splice(allowed_transports.indexOf("Маршрутка"), 1);
        }
        break;
    }

    console.log(allowed_transports);
    refreshTransports();
  });
});

const show_stations_checkbox = document.querySelector(".show-stations input");

show_stations_checkbox.addEventListener("change", (e) => {
  showStations(show_stations_checkbox.checked);
});

export { allowed_transports, show_stations_checkbox, checkboxes };
