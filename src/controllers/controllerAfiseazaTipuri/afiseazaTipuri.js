import { afiseazaCard } from "../controllerAfiseazaCard/afiseazaCard.js";
import {
  afiseazaOferte,
  hideMainElem,
} from "../controllerAfiseazaToate/afiseazaToate.js";

let main = document.querySelector(".main");
let carduri_vizualizare;

// let sortAscending = true; // ordine crescatoare initial
// let currentSortBy = "pret"; // criteriu default
// let currentData = []; // datele afisate

const getTipOferta = async function (tipOferta) {
  const url = `http://localhost:3000/api/v1/oferte/tipOferta/${tipOferta}`;

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

async function createDiv() {
  carduri_vizualizare = document.createElement("div");
  carduri_vizualizare.classList.add("carduri-vizualizare");
  main.classList.add("main-card-vizualizare-page");
  main.appendChild(carduri_vizualizare);
}

export async function afiseazaTipuri(choice) {
  document.querySelector(".main").innerHTML = "";
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  const oferte = await getTipOferta(choice); //luam by choice si toate ofertele

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
