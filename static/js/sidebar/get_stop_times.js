import { time_tables } from "../../json/parse_json.js";

function getCircularTimeDifference(time1, time2, totalMinutes) {
  const directDiff = Math.abs(time1 - time2);
  const wrapAroundDiff = totalMinutes - directDiff;

  // Возвращаем минимальную из двух разниц
  return Math.min(directDiff, wrapAroundDiff);
}

// Преобразование времени в минуты
function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

function findClosestTimesBefore(targetTime, timesArray, direction) {
  const targetMinutes = timeToMinutes(targetTime);
  const totalMinutesInDay = 24 * 60;

  // Фильтруем только времена, которые меньше или равны целевому
  let validTimes = null;
  if (timesArray.length !== 0) {
    if (direction === "before") {
      // Ищем времена ДО целевого (включая переход через полночь)
      validTimes = timesArray.filter((time) => {
        const timeMinutes = timeToMinutes(time);

        // Если время меньше целевого - ок
        if (timeMinutes <= targetMinutes) return true;

        // Если время больше целевого, проверяем переход через полночь
        // Например: target=00:05, time=23:55 → 23:55 считается как "меньше" 00:05
        const diffThroughMidnight = timeMinutes - targetMinutes;
        return diffThroughMidnight > totalMinutesInDay / 2;
      });
    } else if (direction === "after") {
      // Ищем времена ПОСЛЕ целевого (включая переход через полночь)
      validTimes = timesArray.filter((time) => {
        const timeMinutes = timeToMinutes(time);

        // Если время больше целевого - ок
        if (timeMinutes >= targetMinutes) return true;

        // Если время меньше целевого, проверяем переход через полночь
        // Например: target=23:55, time=00:05 → 00:05 считается как "больше" 23:55
        const diffThroughMidnight = targetMinutes - timeMinutes;
        return diffThroughMidnight > totalMinutesInDay / 2;
      });
    } else {
      throw new Error('Direction must be "before" or "after"');
    }
  } else {
    return null;
  }

  // Если нет подходящих времен, возвращаем пустой массив
  if (validTimes.length === 0) return null;

  // Создаем массив объектов с временем и разницей
  const timesWithDiff = validTimes.map((time) => {
    const timeMinutes = timeToMinutes(time);
    const diff = getCircularTimeDifference(
      timeMinutes,
      targetMinutes,
      totalMinutesInDay
    );
    return { time, diff, minutes: timeMinutes };
  });

  // Находим минимальную разницу
  const minDiff = Math.min(...timesWithDiff.map((item) => item.diff));

  // Возвращаем все времена с минимальной разницей
  return timesWithDiff
    .filter((item) => item.diff === minDiff)
    .map((item) => item.time);
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

  const cur_time = `${cur_hour}:${cur_minutes}`;
  const closest_times = [];

  let hour = parseInt(cur_hour);
  let most_closest_time = null;
  // Идем назад
  const closest_times_left = [];
  for (let i = active_button_index; i >= 0; i--) {
    const station_name = stations_names[i];
    const hours_date_object = {};
    const station_time_table_max_hour = Math.max(
      ...Object.keys(
        time_tables[route_name][direction]["time_tables"][station_name][
          table_index
        ]
      ).map((value) => Number(value))
    );
    let threshold = 0;
    if (hour <= 4) {
      // Если уже поздно
      threshold = -4; // Данное значение настраивается
    }
    for (let j = hour; j >= threshold; j--) {
      let date_array = [];
      let all_minutes = null;
      all_minutes =
        time_tables[route_name][direction]["time_tables"][station_name][
          table_index
        ][j >= 0 ? j : station_time_table_max_hour + 1 + j];

      if (all_minutes) {
        all_minutes = all_minutes
          .filter(
            (value) =>
              value.split("-")[1].toLowerCase() === route_name.toLowerCase()
          )
          .map((value) => value.split("-")[0]);
        for (const minute of all_minutes) {
          const newDate = `${
            j >= 0 ? j : station_time_table_max_hour + 1 + j
          }:${minute}`;
          date_array.push(newDate);
        }
      }
      hours_date_object[j >= 0 ? j : station_time_table_max_hour + 1 + j] =
        date_array;
    }
    const closest_times = {};
    for (const hour in hours_date_object) {
      const closest_time = findClosestTimesBefore(
        // --- Проблема здесь, не всегда берет самое близкое время
        most_closest_time !== null ? most_closest_time : cur_time,
        hours_date_object[hour],
        "before"
      );
      if (closest_time !== null) {
        closest_times[hour] = closest_time[0];
      }
    }
    most_closest_time = findClosestTimesBefore(
      most_closest_time !== null ? most_closest_time : cur_time,
      Object.values(closest_times),
      "before"
    )[0];
    closest_times_left.push(most_closest_time);
  }
  closest_times.push(...closest_times_left.reverse());

  // Идем вперед
  most_closest_time = null;
  const closest_times_right = [];

  for (let i = active_button_index + 1; i < station_buttons_length; i++) {
    const station_name = stations_names[i];
    const hours_date_object = {};
    const station_time_table_max_hour = Math.max(
      ...Object.keys(
        time_tables[route_name][direction]["time_tables"][station_name][
          table_index
        ]
      ).map((value) => Number(value))
    );
    let threshold = station_time_table_max_hour;
    if (hour >= 22) {
      // Если уже поздно
      threshold = hour + 8; ///// Прибавляемое значение настраивается
    }
    for (let j = hour; j <= threshold; j++) {
      let date_array = [];
      let all_minutes = null;
      all_minutes =
        time_tables[route_name][direction]["time_tables"][station_name][
          table_index
        ][
          j <= station_time_table_max_hour
            ? j
            : j - station_time_table_max_hour - 1
        ];
      if (all_minutes) {
        all_minutes = all_minutes
          .filter(
            (value) =>
              value.split("-")[1].toLowerCase() === route_name.toLowerCase()
          )
          .map((value) => value.split("-")[0]);
        for (const minute of all_minutes) {
          const newDate = `${
            j <= station_time_table_max_hour
              ? j
              : j - station_time_table_max_hour - 1
          }:${minute}`;
          date_array.push(newDate);
        }
      }
      hours_date_object[
        j <= station_time_table_max_hour
          ? j
          : j - station_time_table_max_hour - 1
      ] = date_array;
    }
    const closest_times = {};
    for (const hour in hours_date_object) {
      const closest_time = findClosestTimesBefore(
        // --- Проблема здесь, не всегда берет самое близкое время
        most_closest_time !== null ? most_closest_time : cur_time,
        hours_date_object[hour],
        "after"
      );
      if (closest_time !== null) {
        closest_times[hour] = closest_time[0];
      }
    }
    most_closest_time = findClosestTimesBefore(
      most_closest_time !== null ? most_closest_time : cur_time,
      Object.values(closest_times),
      "after"
    )[0];
    closest_times_right.push(most_closest_time);
  }

  closest_times.push(...closest_times_right);

  return closest_times;
}

export { getStopTimes };
