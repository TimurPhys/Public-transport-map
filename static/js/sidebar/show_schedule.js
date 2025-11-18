import { time_tables } from "../../json/parse_json.js";

const secondOffcanvasDiv = document.getElementById("secondOffcanvas");
// const firstOffcanvasDiv = document.getElementById("sidebarRoutes");
const route_items = document.querySelectorAll("button.route-item");

route_items.forEach((route_item) => {
  route_item.addEventListener("click", (e) => {
    const route_name = route_item.querySelector("span.badge").textContent;
    openSecondOffcanvas();
    const direction = route_item.querySelector("div .fw-semibold").textContent;
    createSelect(route_name, direction);
  });
});

function openSecondOffcanvas() {
  setTimeout(() => {
    const secondOffcanvas = new bootstrap.Offcanvas(secondOffcanvasDiv);
    secondOffcanvas.show();
  }, 200);
}
// openSecondOffcanvas();

function setHandlerOnButtons(row_div, direction, route_name, station_buttons) {
  if (station_buttons.length !== 0) {
    station_buttons.forEach((station_button) => {
      station_button.addEventListener("click", (e) => {
        station_buttons.forEach((btn) => {
          btn.className = "list-group-item list-group-item-action";
        });
        station_button.className =
          "list-group-item list-group-item-action active";

        const station_name = e.target.textContent.trim();
        showStationTimetable(row_div, direction, route_name, station_name);
      });
    });
  }
}

function showStationTimetable(row_div, direction, route_name, station_name) {
  const table = document.createElement("table");
  table.className = "table table-bordered mb-4 time-table";
  table.style = "width: auto";
  let rows = "";
  for (const hour of Object.keys(
    time_tables[route_name][direction][station_name]
  )) {
    const minutes =
      time_tables[route_name][direction][station_name][hour].join(" ");
    rows += `
          <tr>
                        <td style="font-weight: 600">${hour}</td>
                        <td style="min-width: 170px">${minutes}</td>
                      </tr>
          `;
  }
  table.innerHTML = `<thead>
                      <tr>
                        <th colspan="2" style="font-weight: 600">Рабочие дни</th>
                      </tr>
                    </thead>
                    <tbody>
                    ${rows}
                    </tbody>`;

  const route_desctiption_html = `<div class="col-8">
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
             ${table.outerHTML}
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
  row_div.insertAdjacentHTML("beforeend", route_desctiption_html);
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

function setHandlerOnSelect(
  select_direction,
  my_route_name,
  offcanvas_body_div
) {
  select_direction.addEventListener("change", (e) => {
    const new_direction = e.target.value.trim();
    createSchedule(my_route_name, new_direction, offcanvas_body_div);
  });
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
    time_tables[my_route_name][my_direction]
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
          >
            ${station_name}
          </button>`;
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
    station_buttons[0].textContent.trim()
  );

  //   offcanvas_body_div.insertAdjacentHTML("beforeend", list);
}
