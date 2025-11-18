import { showStationTimetable, createSchedule } from "./show_schedule.js";
import { time_tables } from "../../json/parse_json.js";

function dateToTimeString(date) {
  return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
}

function setHandlerOnButtons(row_div, direction, route_name, station_buttons) {
  if (station_buttons.length !== 0) {
    station_buttons.forEach((station_button) => {
      station_button.addEventListener("click", (e) => {
        station_buttons.forEach((btn) => {
          btn.className = "list-group-item list-group-item-action";
        });
        station_button.className =
          "list-group-item list-group-item-action active";

        const station_name = e.target.lastChild.textContent.trim();
        showStationTimetable(
          row_div,
          direction,
          route_name,
          station_name,
          station_buttons
        );
      });
    });
  }
}

function setHandlersOnLinks(route_name, direction, station_buttons) {
  let minutes_links = document.querySelectorAll(
    `a#route_${route_name.toLowerCase()}`
  );
  minutes_links.forEach((minute_link) => {
    minute_link.addEventListener("click", (e) => {
      minutes_links.forEach((each_minute_link) => {
        each_minute_link.style = "";
      });
      minute_link.style =
        "font-weight: 700; color: blue; border: 1px solid blue; border-radius: 20%; padding: 1px";
      const cur_hour =
        minute_link.parentElement.previousElementSibling.textContent;
      const cur_minutes = minute_link.textContent;
      const active_cur_time = new Date();
      active_cur_time.setHours(cur_hour, cur_minutes, 0, 0);

      let active_button_index = null;
      station_buttons.forEach((station_button) => {
        if (station_button.classList.contains("active")) {
          active_button_index =
            Array.from(station_buttons).indexOf(station_button);
        }
      });

      const station_buttons_length = Array.from(station_buttons).length;
      const cur_time = new Date(active_cur_time);
      let times = [];
      const differences = time_tables[route_name][direction]["differences"];
      // Идем от active_button_index до 0
      for (let i = active_button_index - 1; i >= 0; i--) {
        cur_time.setMinutes(cur_time.getMinutes() - differences[i]);
        const time = dateToTimeString(cur_time);
        times.push(time);
      }
      times = times.reverse();
      cur_time.setTime(active_cur_time.getTime());
      times.push(dateToTimeString(active_cur_time));

      // Идем от active_button_index до station_buttons_length - 1
      for (let i = active_button_index; i < station_buttons_length - 1; i++) {
        cur_time.setMinutes(cur_time.getMinutes() + differences[i]);
        const time = dateToTimeString(cur_time);
        times.push(time);
      }

      let i = 0;
      station_buttons.forEach((station_button) => {
        const strong = station_button.querySelector("strong");
        strong.textContent = times[i];
        // station_button.innerHTML = `${strong.outerHTML}${station_button.textContent}`;
        i += 1;
      });
    });
  });
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

export { setHandlerOnButtons, setHandlerOnSelect, setHandlersOnLinks };
