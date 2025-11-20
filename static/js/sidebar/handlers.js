import {
  showStationTimetable,
  createSchedule,
  createSelect,
} from "./show_schedule.js";
import { time_tables } from "../../json/parse_json.js";
import { getStopTimes } from "./get_stop_times.js";

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
        const cur_time = e.target.querySelector("strong").textContent.trim();
        if (cur_time) {
          const cur_hour = cur_time.split(":")[0];
          const cur_minutes = cur_time.split(":")[1];
          const cur_minute_link = findNewMinuteLink(cur_hour, cur_minutes);
          cur_minute_link.click();
        }
      });
    });
  }
}

function setHandlersOnLinks(route_name, direction, station_buttons) {
  let minutes_links = document.querySelectorAll('a[id^="route_"]');
  minutes_links.forEach((minute_link) => {
    minute_link.addEventListener("click", (e) => {
      let active_button_index = null;
      let active_station_name = null;
      station_buttons.forEach((station_button) => {
        if (station_button.classList.contains("active")) {
          active_station_name = station_button.lastChild.textContent.trim();
          active_button_index =
            Array.from(station_buttons).indexOf(station_button);
        }
      });

      const cur_hour =
        minute_link.parentElement.previousElementSibling.textContent;
      const cur_minutes = minute_link.textContent;

      const table = minute_link.closest("table");
      const tables = table.closest("div").querySelectorAll("table");
      const table_index = Array.from(tables).indexOf(table);

      const stop_times = getStopTimes(
        cur_hour,
        cur_minutes,
        direction,
        route_name,
        table_index,
        station_buttons,
        active_button_index
      );

      let i = 0;
      station_buttons.forEach((station_button) => {
        const strong = station_button.querySelector("strong");
        strong.textContent = stop_times[i];
        i += 1;
      });

      const other_route_name = minute_link.id.split("_")[1];

      minutes_links.forEach((each_minute_link) => {
        each_minute_link.style = "";
      });
      minute_link.style =
        "font-weight: 700; color: blue; border: 1px solid blue; border-radius: 20%; padding: 1px"; // делаю выделение

      if (other_route_name !== route_name.toLowerCase()) {
        const other_route_directions = Object.keys(
          time_tables[
            !other_route_name.includes("s")
              ? other_route_name.toUpperCase()
              : other_route_name
          ]
        );
        let direction_for_redirect = null;
        for (const other_route_direction of other_route_directions) {
          if (
            other_route_direction.split(" - ")[0] === direction.split(" - ")[0]
          ) {
            direction_for_redirect = other_route_direction;
          } else if (
            other_route_direction.split(" - ")[1] === direction.split(" - ")[1]
          ) {
            direction_for_redirect = other_route_direction;
          }
        }
        createSelect(
          !other_route_name.includes("s")
            ? other_route_name.toUpperCase()
            : other_route_name,
          direction_for_redirect
        );
        const my_station_button = document.querySelector(
          `[data-station-name="${active_station_name.replaceAll(" ", "_")}"]`
        );
        my_station_button.click();
        const newMinuteLink = findNewMinuteLink(cur_hour, cur_minutes);
        newMinuteLink.click();
      }
    });
  });
}

function findNewMinuteLink(hourValue, minutesValue) {
  const rows = document.querySelectorAll("tr");
  for (let row of rows) {
    const firstTd = row.querySelector("td:first-child");
    const links = row.querySelectorAll('a[id^="route_"]');

    if (firstTd && links) {
      for (let link of links) {
        const hour = firstTd.textContent.trim();
        const minutes = link.textContent.trim();

        if (hour === hourValue && minutes === minutesValue) {
          return link;
        }
      }
    }
  }
  return null;
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
