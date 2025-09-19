import { API_URL } from "../../../util/config";
import { afiseazaCard } from "../controllerAfiseazaCard/afiseazaCard.js";

let select_zona = document.querySelector(".select-zona");
let card_list = document.querySelector(".card-list");
let locatie = document.querySelector(".locatie");
let main = document.querySelector(".main");
let carduri_vizualizare;
let main_photo = document.querySelector(".main-photo");

// let sortAscending = true; // ordine crescatoare initial
// let currentSortBy = "pret"; // criteriu default
// let currentData = []; // datele afisate

const getOferte = async function (type = "Romania") {
  const url = `http://localhost:3000/api/v1/oferte/type/${type}`;

  try {
    // Use fetch to send the GET request to the server
    const response = await fetch(url);

    if (response.ok) {
      // Parse the JSON response and store it in a const
      const jsonResponse = await response.json();

      // Now jsonResponse contains the data, for example:

      return jsonResponse.data.oferte;
    } else {
      throw error("Error fetching data:", response.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

export function hideMainElem() {
  select_zona.classList.add("hidden");
  card_list.classList.add("hidden");
  locatie.classList.add("hidden");
  main_photo.classList.add("main-photo-cardPage");
  main_photo.classList.remove("main-photo");
}

async function createDiv() {
  carduri_vizualizare = document.createElement("div");
  carduri_vizualizare.classList.add("carduri-vizualizare");
  main.classList.add("main-card-vizualizare-page");
  main.appendChild(carduri_vizualizare);

  /* pentru sort in viitor
  const sortElem = `<div class="sort-controls">
        <select id="sort-by">
          <option value="pret">Pret</option>
          <option value="time">Time</option>
          <option value="location">Locatie</option>
        </select>
        <button id="sort-order">↑</button>
      </div>`;

  main.insertAdjacentHTML("afterbegin", sortElem);
  */
}

export async function afiseazaOferte(data) {
  document.querySelector(".main").innerHTML = "";
  await createDiv();

  carduri_vizualizare.innerHTML = data
    .map((card) => {
      const dateOnly = card.data ? card.data.split("T")[0] : "";
      return `
       <div class="carduri_v" data-id="${card.id}">
          <div class="left-carduri-v">
            <img src="${API_URL}/posters/${card.images[0]}" alt="*no-photo"/>
          </div>
          <div class="right-carduri-v">
            <div class="top-info">
                <p class="carduri-item locatie-tara-carduri">${card.location}, ${card.country}</p>
                <p class="carduri-item tip_oferta-carduri"><strong>Tip:</strong> ${card.type_oferta}</p>
                <p class="carduri-item pret-carduri"><strong>Pret:</strong> ${card.price}€ / persoană, <strong>Plecare:</strong> ${dateOnly}</p>
            </div>
            <div class="bottom-info">
               <button class="detalii-btn">Detalii</button>
            </div>
          </div>
        </div> `;
    })
    .join("");
}

export async function afiseazaToate(choice) {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  const oferte = await getOferte(choice); //luam by choice si toate ofertele

  await hideMainElem();
  afiseazaOferte(oferte);

  //aici trebuie sa avem si un click event pe card ca in cealalta parte, dar cred ca trebuie sa existe in index.js(cu event prop, fiindca div nu
  //va exista la inceput)
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".detalii-btn");
    if (!btn) return;

    // găsește cardul părinte
    const card = btn.closest(".carduri_v");
    const id = card.dataset.id; // obține data-id

    afiseazaCard(id);
    carduri_vizualizare.innerHTML = "";
    carduri_vizualizare.style.display = "none";
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  //poate in josul pagini ne trebuie un ... cauti oferte internationale/romane buton. Sa se afiseze si celelalte
}
