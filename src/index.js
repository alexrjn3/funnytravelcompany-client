import { loadCards } from "./controllers/controllerLoadCards/loadCards.js";
import { changeOferte } from "./controllers/controllerChangeOferte/changeOferte.js";
import { afiseazaCard } from "./controllers/controllerAfiseazaCard/afiseazaCard.js";
import { afiseazaToate } from "./controllers/controllerAfiseazaToate/afiseazaToate.js";
import { showAdminLogin } from "./controllers/controllerShowAdminLogin/showAdminLogin.js";
import { afiseazaTipuri } from "./controllers/controllerAfiseazaTipuri/afiseazaTipuri.js";

const cards_list = document.querySelector(".cards-list");

const select_zona = document.querySelector(".select-zona");
const arrow_right = document.querySelector(".arrow-right");
const arrow_left = document.querySelector(".arrow-left");
const select_zona_ro = document.querySelector(".select-zona-ro");
const select_zona_str = document.querySelector(".select-zona-str");
const app_logo = document.querySelector(".app-logo");
const vezi_toate = document.querySelector(".vezi-toate");
const not_selected = document.querySelector(".not-selected");
const navList = document.querySelector(".nav-list");

let card_listLength;
let isRightArrowLocked = false;
let isLeftArrowLocked = false;
const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu");

//load card-list
//load recenzii sau locatie
//load resources(asta sa fie statica?)
document.addEventListener("DOMContentLoaded", async (e) => {
  const path = window.location.pathname;

  if (path === "/login") {
    // ADMIN LOGIN SPA
    showAdminLogin(); // funcție nouă pentru formular + fetch login admin
    return; // oprim codul clientului
  }

  //aici pare cam dry. Sa avem o functie si
  //sa trimitem argument(cards,recenzii,resource)?
  await loadCards(); //vom avea un max de oferte in wrapper ca butonul vezi toate sa aibe sens
  mapaLeaflet();
  setupEventListeners();

  window.addEventListener("DOMContentLoaded", () => {
    // dacă nu există un state curent, îl setăm pe "home"
    if (!history.state) {
      history.replaceState({ page: "home" }, "", "/");
    }
  });
  //loadRecenzii();
  //loadResources();
  /*
 fara dry:
 loadAll(
        loadCards,
        //loadRecenzii,
        //loadResources
    );
  */
});

//click logo
function setupEventListeners() {
  app_logo.addEventListener("click", () => {
    window.location.href = "/";
  });

  hamburger.addEventListener("click", () => {
    mobileMenu.classList.toggle("show");
    hamburger.classList.toggle("hamburger-on");
  });

  //click nav-bar
  setupNavList(navList);
  setupNavList(document.querySelector(".mobile-menu"));

  //click pe select-zona
  select_zona.addEventListener("click", (e) => {
    const target = e.target.closest(".select-zona-ro, .select-zona-str");
    if (!target) return;

    const classes = [...target.classList];
    const mainClass = classes.find((c) => c !== "not-selected");
    const zona = mainClass === "select-zona-str" ? "International" : "Romania";

    if (target.classList.contains("not-selected")) {
      target.classList.remove("not-selected");

      // cealaltă zonă devine inactivă
      const other =
        target === select_zona_ro ? select_zona_str : select_zona_ro;
      other.classList.add("not-selected");
      cards_list.style.transform = `translateX(${0}px)`;

      changeOferte(zona);
    }
  });

  //click pe card
  cards_list.addEventListener("click", (e) => {
    const target = e.target.closest(".card");

    // adaugăm în istoric
    history.pushState(
      { page: "oferta", id: target.dataset.id },
      "",
      `#oferta-${target.dataset.id}`
    );
    afiseazaCard(target.dataset.id);
  });

  //click pe sageata card
  arrow_right.addEventListener("click", (e) => {
    //debounce:
    if (isRightArrowLocked) return; // ignore if locked
    isRightArrowLocked = true;
    //cod:
    card_listLength = cards_list.children.length;

    const card = document.querySelector(".card");

    const width_card = Math.floor(card.getBoundingClientRect().width);

    const cards_wrapper = document.querySelector(".cards-list-wrapper");
    const width_card_wrapper =
      Math.floor(cards_wrapper.getBoundingClientRect().width) - 200;

    const translateX = parseFloat(
      getComputedStyle(cards_list).transform.split(", ")[4]
    );

    const conditie_max_arrowRight =
      width_card * (card_listLength - 1) + 48 * (card_listLength - 1); //280 width card, 48 gap
    // dintre card(sunt mai mici cu 1 decat card in total(stanga nu are gap))

    if (translateX > -conditie_max_arrowRight)
      //tre luat cate card-uri avem
      cards_list.style.transform = `translateX(${
        translateX - width_card_wrapper
      }px)`; //1300=width pentru a sari peste 4 carduri

    //debounce:
    setTimeout(() => {
      isRightArrowLocked = false;
    }, 1000);
  });

  arrow_left.addEventListener("click", (e) => {
    //debounce:
    if (isLeftArrowLocked) return;
    isLeftArrowLocked = true;

    const cards_wrapper = document.querySelector(".cards-list-wrapper");
    const width_card_wrapper =
      Math.floor(cards_wrapper.getBoundingClientRect().width) - 200;

    //cod:
    const translateX = parseFloat(
      getComputedStyle(cards_list).transform.split(", ")[4]
    );

    if (translateX < 0)
      cards_list.style.transform = `translateX(${
        translateX + width_card_wrapper
      }px)`;

    //debounce:
    setTimeout(() => {
      isLeftArrowLocked = false;
    }, 1000);
  });

  //click pe Vezi toate
  vezi_toate.addEventListener("click", () => {
    //ce este selectat.. romania sau international
    let choice_select;
    if (select_zona_ro.classList.contains("not-selected")) {
      choice_select = "International";
    } else {
      choice_select = "Romania";
    }

    // adaugăm în istoric
    history.pushState(
      { page: "vezi-toate", choice: choice_select },
      "",
      `#vezi-toate-${choice_select}`
    );

    //aici puteam lua ofertele direct din js care sunt afisate in wrapper card, dar am zis ca nu vom afisa toate acolo
    //daca sunt 50 nu. doar cele recente. si pe afiseaza toate facem alt apel la db si luam tot
    afiseazaToate(choice_select);
  });

  window.addEventListener("popstate", (event) => {
    const page = event.state?.page;
    const hash = location.hash.slice(1); // scoate '#'

    if (!page) {
      // fallback: parcurge hash-ul
      if (hash.startsWith("vezi-toate")) {
        afiseazaToate(hash.split("-").slice(2).join("-"));
      } else if (hash.startsWith("oferta")) {
        afiseazaCard(hash.split("-")[1]);
      } else {
        window.location.reload(); // home
      }
    } else if (page === "home") {
      window.location.reload();
    } else if (page === "vezi-toate") {
      afiseazaToate(event.state.choice);
    } else if (page === "oferta") {
      afiseazaCard(event.state.id);
    } else if (page === "vezi-tipuri") {
      afiseazaTipuri(event.state.choice);
    }
  });
}

//click pe mapa
function mapaLeaflet() {
  // index.js

  // Coordonatele locației tale
  const lat = 44.8476599; // exemplu: Pitesti
  const lng = 24.8792528;

  // Creăm harta Leaflet în div-ul #map
  const map = L.map("map").setView([lat, lng], 18);

  // Folosim OpenStreetMap tiles (gratuit)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "",
  }).addTo(map);

  // Adăugăm marker
  const marker = L.marker([lat, lng]).addTo(map);

  // Adăugăm marker (fără click acum)
  L.marker([lat, lng]).addTo(map);

  // === Buton custom Google Maps în dreapta sus ===
  const GoogleMapsControl = L.Control.extend({
    options: { position: "topright" },
    onAdd: function () {
      const button = L.DomUtil.create("button", "button-googleMaps");
      button.innerText = "Deschide Google Maps";

      // evită să tragă harta când dai click pe buton
      L.DomEvent.disableClickPropagation(button);

      button.onclick = () => {
        window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
      };

      return button;
    },
  });
  map.addControl(new GoogleMapsControl());
  map.removeControl(map.attributionControl);
}

function setupNavList(listElement) {
  listElement.addEventListener("click", (e) => {
    const target = e.target.closest("li");
    if (!target) return;

    const choice = target.textContent;
    switch (choice) {
      case "Romania":
        history.pushState(
          { page: "vezi-toate", choice: "Romania" },
          "",
          `#vezi-toate-${"Romania"}`
        );
        afiseazaToate();
        break;
      case "International":
        history.pushState(
          { page: "vezi-toate", choice: "International" },
          "",
          `#vezi-toate-${"International"}`
        );
        afiseazaToate("International");
        break;
      case "City Break":
        history.pushState(
          { page: "vezi-tipuri", choice: "City Break" },
          "",
          `#vezi-tipuri-${"City Break"}`
        );
        afiseazaTipuri("City Break");
        break;
      case "Tur Montan":
        history.pushState(
          { page: "vezi-tipuri", choice: "Tur Montan" },
          "",
          `#vezi-tipuri-${"Tur Montan"}`
        );
        afiseazaTipuri("Tur Montan");
        break;

      default:
    }

    if (listElement.classList.contains("mobile-menu")) {
      mobileMenu.classList.toggle("show");
      hamburger.classList.toggle("hamburger-on");
    }
  });
}
