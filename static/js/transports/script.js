import { refreshTransports } from "../map/map.js";

const show_transports_button = document.querySelector(".show-transports");

function hideTransportsList(list) {
  list.style.animation = "slideUp 0.3s ease forwards";
  setTimeout(() => {
    list.classList.remove("show");
    list.style.animation = "";
  }, 300);
}

show_transports_button.addEventListener("click", (e) => {
  const transports_list = document.querySelector(".transports-list");
  if (transports_list.classList.contains("show")) {
    hideTransportsList(transports_list);
  } else {
    transports_list.classList.add("show");
    transports_list.style.animation = "slideDown 0.3s ease forwards";
  }
});

function selectTransport(item) {
  if (item.classList.contains("active-item")) {
    item.classList.remove("active-item");
  } else {
    item.style.backgroundColor = "";
    item.classList.add("active-item");
  }

  transport_items.forEach((item) => {
    const type = item.getAttribute("data-transport");
    if (
      item.classList.contains("active-item") &&
      !allowed_transports.includes(type)
    ) {
      allowed_transports.push(item.getAttribute("data-transport"));
    } else if (
      allowed_transports.includes(type) &&
      !item.classList.contains("active-item")
    ) {
      allowed_transports.splice(allowed_transports.indexOf(type), 1);
    }
  });
  // Можно добавить дополнительную логику здесь
}

const transport_items = document.querySelectorAll(
  ".transports-list .list-group-item"
);
let allowed_transports = ["Трамвай", "Автобус", "Маршрутка"];

transport_items.forEach((item) => {
  const transports_type = item.getAttribute("data-transport");
  // Наведение курсора
  item.addEventListener("mouseenter", function () {
    if (!this.classList.contains("active-item")) {
      this.style.backgroundColor = "#85aeffff";
    } else {
      this.style.backgroundColor = "#5670a5ff";
    }
  });

  // Уход курсора
  item.addEventListener("mouseleave", function () {
    // if (!this.classList.contains("active-item")) {
    this.style.backgroundColor = "";
    // } else {}
  });

  // Клик на элемент
  item.addEventListener("click", function () {
    selectTransport(this);
    refreshTransports();
  });
});

export { allowed_transports, hideTransportsList };
