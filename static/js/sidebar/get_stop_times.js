import { time_tables } from "../../json/parse_json.js";

function dateToTimeString(date) {
  return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
}
function findClosestTime(
  targetTime,
  timesArray,
  timesArrayHasDateFormat = false,
  shouldBeLess
) {
  const targetDate = targetTime;

  const filtered = timesArray.filter((time) => {
    const date = timesArrayHasDateFormat
      ? new Date(time)
      : new Date(`1970-01-01T${time}`);

    return shouldBeLess ? date <= targetDate : date >= targetDate; // ❗ только меньшие
  });
  console.log("Разница");
  console.log(timesArray, filtered);

  if (filtered.length !== 0) {
    return filtered.reduce((closest, current) => {
      const currentDate = !timesArrayHasDateFormat
        ? new Date(`1970-01-01T${current}`)
        : current;
      const closestDate = !timesArrayHasDateFormat
        ? new Date(`1970-01-01T${closest}`)
        : closest;

      const diffCurrent = Math.abs(currentDate - targetDate);
      const diffClosest = Math.abs(closestDate - targetDate);

      return diffCurrent < diffClosest ? current : closest;
    });
  }

  return null;
}

function getStopTimes(
  cur_hour,
  cur_minutes,
  direction,
  route_name,
  table_index,
  station_buttons,
  active_button_index
) {
  const station_buttons_length = Array.from(station_buttons).length;
  const stations_names = Array.from(station_buttons).map((value) =>
    value.lastChild.textContent.trim()
  );
  const active_station_name = stations_names[active_button_index];

  const cur_time = new Date();
  cur_time.setHours(cur_hour, cur_minutes, 0, 0);
  console.log(cur_time);
  console.log(route_name);

  // Идем назад
  let hour = parseInt(cur_hour);
  for (let i = active_button_index - 1; i >= 0; i--) {
    const station_name = stations_names[i];
    console.log(station_name);
    const hours_date_object = {};
    for (let j = hour; j >= 0; j--) {
      let date_array = [];
      let all_minutes =
        time_tables[route_name][direction]["time_tables"][station_name][
          table_index
        ][j];
      if (all_minutes) {
        all_minutes = all_minutes
          .filter(
            (value) =>
              value.split("-")[1].toLowerCase() === route_name.toLowerCase()
          )
          .map((value) => value.split("-")[0]);
        for (const minute of all_minutes) {
          const newDate = new Date(cur_time);
          newDate.setHours(j, minute, 0, 0);
          date_array.push(newDate);
        }
      }
      hours_date_object[j] = date_array;
    }
    const closest_times = {};
    console.log(hours_date_object);
    for (const hour in hours_date_object) {
      const closest_time = findClosestTime(
        // --- Проблема здесь, не всегда берет самое близкое время
        cur_time,
        hours_date_object[hour],
        true,
        true
      );
      if (closest_time !== null) {
        closest_times[hour] = closest_time;
      }
    }
    const most_closest_time = findClosestTime(
      cur_time,
      Object.values(closest_times),
      true,
      true
    );
    console.log(most_closest_time);
  }
}

export { getStopTimes };
