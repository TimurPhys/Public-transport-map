import { time_tables } from "../../json/parse_json.js";
import {
  setHandlerOnButtons,
  setHandlersOnLinks,
  setHandlerOnSelect,
} from "./handlers.js";
import { routeState, totalState } from "../map/map.js";
import {
  showMarkersRoute,
  deletePolyline,
  clearMarkers,
  showOnlyChosenTransport,
} from "../map/handle_marker_click.js";

const secondOffcanvasDiv = document.getElementById("secondOffcanvas");
// const firstOffcanvasDiv = document.getElementById("sidebarRoutes");
const route_items = document.querySelectorAll("button.route-item");

route_items.forEach((route_item) => {
  route_item.addEventListener("click", (e) => {
    const route_name = route_item.querySelector("span.badge").textContent;
    const direction = route_item.querySelector("div .fw-semibold").textContent;
    openSecondOffcanvas();
    createSelect(route_name, direction);
    showCurrentRouteOnMap(route_name, direction);
  });
});

function showCurrentRouteOnMap(route_name, direction) {
  routeState.currentRoute = route_name;
  showMarkersRoute(routeState, totalState, direction, "route_name");
  const close_route_button = document
    .querySelector("#secondOffcanvas")
    .querySelector("button.btn-close");

  close_route_button.addEventListener("click", () => {
    removeCurrentRouteFromMap(routeState);
  });
}

function removeCurrentRouteFromMap(routeState) {
  console.log("Маршрут закрыт");
  deletePolyline(routeState);
  clearMarkers(routeState);
  showOnlyChosenTransport(
    routeState,
    totalState.map_vehicles,
    "route_name",
    true
  );
}

function openSecondOffcanvas() {
  setTimeout(() => {
    const secondOffcanvas = new bootstrap.Offcanvas(secondOffcanvasDiv);
    secondOffcanvas.show();
  }, 200);
}
// openSecondOffcanvas();

function showStationTimetable(
  row_div,
  direction,
  route_name,
  station_name,
  station_buttons
) {
  let tables_html = "";
  const tables =
    time_tables[route_name][direction]["time_tables"][station_name];
  let weekDay = "";
  let maxHoursAmount = null;
  let largestTable = null;
  if (tables.length > 1) {
    maxHoursAmount = Math.max(
      Object.keys(tables[0]).length,
      Object.keys(tables[1]).length
    );
    for (const table of tables) {
      if (Object.keys(table).length === maxHoursAmount) {
        largestTable = table;
      }
    }
  } else {
    largestTable = tables[0];
  }
  for (let i = 0; i < tables.length; i++) {
    if (i == 0) {
      weekDay = "Рабочие дни";
    } else if (i == 1) {
      weekDay = "Выходные дни";
    }
    const table = document.createElement("table");
    table.className = "table table-bordered mb-4 time-table custom-table";
    let rows = "";
    for (const hour of Object.keys(largestTable)) {
      const minutes = tables[i][hour];
      if (minutes) {
        let minutes_a = "";
        for (const minute of minutes) {
          const minute_a = document.createElement("a");
          minute_a.className =
            "link-opacity-100-hover link-underline link-underline-opacity-0 me-2";
          const route_name_from_table = minute
            .split("-")[1]
            .trim()
            .toLowerCase();
          minute_a.textContent = minute.split("-")[0];
          if (route_name_from_table === route_name.toLowerCase()) {
            minute_a.classList.add("link-dark");
          } else {
            minute_a.classList.add("link-primary");
          }
          minute_a.id = `route_${route_name_from_table}`;
          minute_a.href = "#";
          minutes_a += minute_a.outerHTML;
        }
        rows += `
            <tr>
                            <td style="font-weight: 600">${hour}</td>
                            <td>${minutes_a}</td>
                        </tr>
            `;
      } else {
        rows += `
            <tr>
                            <td style="font-weight: 900">-</td>
                            <td></td>
                        </tr>
            `;
      }
    }
    table.innerHTML = `<thead>
                        <tr>
                            <th colspan="2" style="font-weight: 600">${weekDay}</th>
                        </tr>
                        </thead>
                        <tbody>
                        ${rows}
                        </tbody>`;
    tables_html += table.outerHTML;
  }

  const route_description_html = `<div class="col-8">
        <div
          class="tab-content p-3"
          id="nav-tabContent"
          style="background-color: whitesmoke; border-radius: 2%"
        >
          <div
            class="tab-pane fade show active"
            id="list-home"
            role="tabpanel"
            aria-labelledby="list-home-list"
          >
            <div class="card mb-3">
              <div class="card-header" style="font-weight: 600">
                Также посещают:
              </div>
            </div>

            <div class="container d-flex justify-content-around">
             ${tables_html}
            </div>
            <div class="card mb-3">
              <div class="card-header">
                <strong style="font-weight: 600">Перевозчик:</strong> A/S
                "Liepājas autobusu parks"
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <strong style="font-weight: 600">Подсказки:</strong> Lorem ipsum
                dolor, sit amet consectetur adipisicing elit. Saepe, quod?
              </div>
            </div>
          </div>
        </div>
      </div>`;
  if (document.querySelector("table.time-table")) {
    row_div.removeChild(row_div.lastChild);
  }

  row_div.insertAdjacentHTML("beforeend", route_description_html);

  setHandlersOnLinks(route_name, direction, station_buttons);
}

function createSelect(my_route_name, my_direction) {
  secondOffcanvasDiv.innerHTML = "";
  const header = `<div class="offcanvas-header border-bottom">
    <h5 class="offcanvas-title">Расписание маршрута</h5>
    <button
      type="button"
      class="btn-close"
      data-bs-dismiss="offcanvas"
    ></button>
  </div>
  `;
  const offcanvas_body_div = document.createElement("div");
  offcanvas_body_div.className = "offcanvas-body py-1";

  const select_direction = document.createElement("select");
  select_direction.className = "form-select direction-select";
  select_direction.ariaLabel = ".form-select";

  for (const direction of Object.keys(time_tables[my_route_name])) {
    const option = document.createElement("option");
    option.value = direction;
    option.text = direction;
    select_direction.options.add(option);
  }

  offcanvas_body_div.insertAdjacentHTML(
    "beforeend",
    `
  <div class="container d-flex mb-2 border-bottom py-2">
      <span
        class="badge bg-primary me-2 d-inline-flex align-items-center justify-content-center badge-custom"
        style="width: auto; font-size: 18px"
        >${my_route_name}</span>
        ${select_direction.outerHTML}
    </div>`
  );
  secondOffcanvasDiv.insertAdjacentHTML("afterbegin", header);
  secondOffcanvasDiv.appendChild(offcanvas_body_div);

  const added_select_direction = document.querySelector(
    "select.direction-select"
  );
  added_select_direction.value = my_direction;
  setHandlerOnSelect(added_select_direction, my_route_name, offcanvas_body_div);
  createSchedule(my_route_name, my_direction, offcanvas_body_div);
}

function createSchedule(my_route_name, my_direction, offcanvas_body_div) {
  const old_row_div = offcanvas_body_div.querySelector("div.row");
  if (old_row_div) {
    offcanvas_body_div.removeChild(old_row_div);
  }
  const row_div = document.createElement("div");
  row_div.className = "row";

  let buttonsListHtml = "";
  let i = 0;
  let state = "";
  for (const station_name of Object.keys(
    time_tables[my_route_name][my_direction]["time_tables"]
  )) {
    if (i === 0) {
      state = "active";
    } else {
      state = "";
    }
    const button = `<button
            type="button"
            class="list-group-item list-group-item-action ${state} station-button"
            aria-current="true"
            style="height: auto; font-size: 15px"
            data-station-name=${station_name.replaceAll(" ", "_")}
          >
            <strong class="me-2"></strong>${station_name}</button>`;
    buttonsListHtml += button;
    i += 1;
  }

  const buttonsListDiv = `<div class="col-4 pe-0">
        <div class="list-group">
          ${buttonsListHtml}
        </div>
      </div>`;
  row_div.innerHTML = buttonsListDiv;
  offcanvas_body_div.appendChild(row_div);
  secondOffcanvasDiv.appendChild(offcanvas_body_div);

  const station_buttons = document.querySelectorAll("button.station-button");

  setHandlerOnButtons(row_div, my_direction, my_route_name, station_buttons);
  showStationTimetable(
    row_div,
    my_direction,
    my_route_name,
    station_buttons[0].textContent.trim(),
    station_buttons
  );
}

export {
  showStationTimetable,
  createSchedule,
  createSelect,
  showCurrentRouteOnMap,
  removeCurrentRouteFromMap,
};
