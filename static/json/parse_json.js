async function parse_json(file_path) {
  try {
    const response = await fetch(file_path);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error("Ошибка:", error);
    return null;
  }
}

let time_tables = null;

await parse_json("/static/json/routes_time_tables.json").then((data) => {
  if (data) {
    time_tables = data;
    console.log("Данные загружены!");
  }
});

console.log(time_tables);

export { time_tables };
