import { map } from "./map/map.js";
import { hideTransportsList } from "./transports/script.js";

const geo_button = document.querySelector(".find-station-btn");

geo_button.addEventListener(
  "click",
  () => {
    console.log("click");

    if (!navigator.geolocation) {
      alert("Геолокация не поддерживается вашим браузером");
      return;
    }
    let userMarker = null;

    navigator.geolocation.getCurrentPosition(
      // Success callback
      function (position) {
        const station_search = document.querySelector(".station-search");
        if (station_search.classList.contains("show")) {
          hideTransportsList(station_search);
        } else {
          station_search.classList.add("show");
          station_search.style.animation = "slideDown 0.3s ease forwards";
        }

        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;
        // Обновляем текст кнопки

        // Центрируем карту на пользователе
        map.setView([lat, lng], 13);

        // Добавляем новый маркер
        userMarker = L.marker([lat, lng])
          .addTo(map)
          .bindPopup("Вы здесь!")
          .openPopup();

        console.log("Координаты:", lat, lng);
        console.log("Точность:", accuracy, "метров");
      }
    );
  },
  // Error callback
  function (error) {
    geo_button.textContent = "📍 Моё местоположение";

    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert(
          "Доступ к геолокации запрещен. Разрешите доступ в настройках браузера."
        );
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Информация о местоположении недоступна.");
        break;
      case error.TIMEOUT:
        alert("Время запроса геолокации истекло.");
        break;
      default:
        alert("Произошла неизвестная ошибка.");
    }
  },
  // Options
  {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60000,
  }
);

$(document).ready(function () {
  console.log("jQuery version:", $.fn.jquery);
  console.log("Select2 available:", typeof $.fn.select2 !== "undefined");

  // Инициализация Select2
  $("#stationSelect").select2({
    language: "en",
    placeholder: "Выберите или найдите остановку...",
    allowClear: true,
    width: "100%",
    minimumResultsForSearch: 1,
  });

  // Обработчик выбора
  $("#stationSelect").on("change", function () {
    console.log(
      "Выбрано:",
      $(this).val(),
      $(this).find("option:selected").text()
    );
  });
});
