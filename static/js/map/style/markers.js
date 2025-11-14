const icons = {
  bus: {
    icon_url: "./static/img/bus/bus-icon-white.png",
    bg_url: "./static/img/bus/bus-bg.png",
    bg_color: "#5cd160",
    font_color: "#47a34a",
  },
  tram: {
    icon_url: "./static/img/tram/tram-icon-white.png",
    bg_url: "./static/img/tram/tram-bg.png",
    bg_color: "#ec945dff",
    font_color: "#d1753bff",
  },
  minibus: {
    icon_url: "./static/img/minibus/minibus-icon.png",
    bg_url: "./static/img/minibus/minibus-bg.png",
    bg_color: "#4993eeff",
    font_color: "#1b77e8ff",
  },
};

function createCustomIcon(type, route, azimuth = 0) {
  let width = 0;
  switch (route.length) {
    case 1:
      width = 70;
      break;
    case 2:
      width = 75;
      break;
    case 3:
      width = 85;
      break;
  }

  return L.divIcon({
    className: "",
    html: `
      <div class="parent">
      <div class="bg" style='background-color: ${icons[type].bg_color}'>
        <img src=${icons[type].icon_url} class="img-icon" alt="img-icon" />
      </div>
      <div class="center" style="transform: rotate(${azimuth}deg)">
        <img src=${icons[type].bg_url} class="img-arrow" alt="img" />
      </div>
      <div class="child" style="width: ${width}px;">
        <p style='color: ${icons[type].font_color};'>${route}</p>
      </div>
    </div>
                `,
    iconSize: [60, 60],
    iconAnchor: [30, 30], // Регулирует точку привзяки кнопки
  });
}

const stationIcon = L.divIcon({
  className: "custom-marker",
  html: `<div style="background-color: #3388ff; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

// Создаем иконку для выбранного состояния (красная)
const leftStationIcon = L.divIcon({
  className: "custom-marker selected",
  html: `<div style="background-color: #ff3333; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

export { stationIcon, leftStationIcon };
export { createCustomIcon };
