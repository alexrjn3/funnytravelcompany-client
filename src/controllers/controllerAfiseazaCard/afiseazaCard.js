let cardsList = document.querySelector(".cards-list");
let select_zona = document.querySelector(".select-zona");
let card_list = document.querySelector(".card-list");
let locatie = document.querySelector(".locatie");
let main = document.querySelector(".main");
let main_photo = document.querySelector(".main-photo");

function hideMainElem() {
  select_zona.classList.add("hidden");
  card_list.classList.add("hidden");
  locatie.classList.add("hidden");
  main_photo.classList.add("main-photo-cardPage");
  main_photo.classList.remove("main-photo");
}

export const getOferta = async function (id) {
  const url = `${process.env.server_url}/api/v1/oferte/id/${id}`;

  try {
    // Use fetch to send the GET request to the server
    const response = await fetch(url);

    if (response.ok) {
      // Parse the JSON response and store it in a const
      const jsonResponse = await response.json();

      // Now jsonResponse contains the data, for example:

      return jsonResponse.data.oferta;
    } else {
      throw error("Error fetching data:", response.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

function aranjatCard(elem_parinte, card) {
  const dateOnly = card.data ? card.data.split("T")[0] : "";
  let imgSection = "";

  if (card.images.length > 1) {
    imgSection = `
      <div class="card-v-img-sec">
        <!-- Top photo -->
        <p class="more-photos-text">Poze</p>
        <img src="${card.images[1]}" alt="photo"/>

        <!-- Bottom photo -->
        <div class="bottom-photo-container" style="position: relative;">
          <img src="${card.images[2] || card.images[1]}" alt="photo"/>

          ${
            card.images.length > 1
              ? `
                <div class="more-photos-overlay" 
                     data-images='${JSON.stringify(card.images)}'
                     style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
                            display: flex; justify-content: center; align-items: center;
                            background: rgba(0,0,0,0.8); color: white; font-size: 24px; cursor: pointer;">
                  <span>+${card.images.length}</span>
                </div>
              `
              : ""
          }
        </div>
      </div>
    `;
  }

  // 1️⃣ creezi toată structura
  elem_parinte.innerHTML = `
    <div class="header-card_v">
      <p class="card-item zona">${card.location},
          <span class="card-item oras">${card.city},</span>
          <span class="card-item tara">${card.country}</span>
      </p>

      <span class="card-item adresa">${card.adress}</span>
      <p class="card-item tip_oferta">Tip: ${card.type_oferta}</p>
    </div>
    <div class="body-card_v">
      <div class="card-v-img-main">
        <img src="${card.images[0]}" alt="*no-photo"/>
      </div>

      ${imgSection}

      <div class="first-col-detalii">
        <div class="data-price">
          <p class="time"><strong>Plecare:</strong><i> ${dateOnly}</i>, <strong>Nopti:</strong> 3</p>
          <p class="pret"><strong>Pret:</strong> ${card.price}€ / persoană</p>
        </div>
        <div class="container-gps">
          <p class="locatie-title-gps-card">Locatie</p>
          <div class="map-container">
            <button class="map-button">Vezi mapa</button>
          </div>
        </div>

      </div>

    </div>
    <div class="footer-card_v">
      <div class="descriere_footer">
        <p class="details"><strong>Detalii</strong></p>
        <p class="text-details">${
          card.description_1
        }. Bran Castle (Romanian: Castelul Bran; German: Schloss Bran or Die Törzburg; Hungarian: Törcsvári kastély) is a castle in Bran, 25 kilometres (16 mi) southwest of Brașov. The castle was built by Saxons in 1377 who were given the privilege by Louis I of Hungary. It is a national monument and landmark in Transylvania. The fortress is on the Transylvanian side of the historical border with Wallachia, on road DN73.

Marketed outside Romania as Dracula's Castle, it is presented as the home of the title character in Bram Stoker's Dracula. There is no evidence that Stoker knew anything about this castle, which has only tangential associations with Vlad the Impaler, voivode of Wallachia, whose byname 'Drăculea' resembles that of Dracula.[1] Stoker's description of Dracula's crumbling fictional castle also bears no resemblance to Bran Castle.</p>
        <p class="text-details">${card.description_2}</p>
      </div>
      <div class="servici_footer">
         <p class="details"><strong>Servicii</strong></p>
          <ul class="text-details_footer">
            ${(Array.isArray(card.servici)
              ? card.servici.join(",") // if it's an array, join into a string
              : card.servici
            ) // if it's already a string, use as-is
              .split(",") // split by commas
              .map((item) => `<li>${item.trim()}</li>`) // trim and wrap in <li>
              .join("")}
          </ul>
      </div>
    </div>
  `;

  // 2️⃣ abia acum există body-card_v → îi schimbi grid-ul dacă e nevoie
  if (card.images.length > 1) {
    const body = elem_parinte.querySelector(".body-card_v");
    if (body) body.classList.add("mai-multe-img");
  }
}

function deschidePoza(e) {
  const overlay = e.target.closest(".more-photos-overlay");
  if (overlay) {
    const images = JSON.parse(overlay.dataset.images);
    const lightbox = document.getElementById("photos-lightbox");
    const content = lightbox.querySelector(".lightbox-content");

    // umplem lightbox-ul
    content.innerHTML = images
      .map((img) => `<img src="${img}" alt="photo" />`)
      .join("");

    lightbox.classList.remove("hidden");
  }

  if (e.target.classList.contains("lightbox-close")) {
    document.getElementById("photos-lightbox").classList.add("hidden");
  }
}

export async function afiseazaCard(card_id) {
  //Totusi e ciudat ca country sa fie romania si international. acesta e mai mult un type, ne va trebui si country la cele internationale
  //pe moment lasam asa
  document.querySelector(".main").innerHTML = "";
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  hideMainElem();
  let card_vizualizare = document.createElement("div");
  card_vizualizare.classList.add("card-vizualizare");
  main.appendChild(card_vizualizare);
  main.classList.add("main-card-vizualizare-page");
  let card = await getOferta(card_id);

  aranjatCard(card_vizualizare, card);
  document.addEventListener("click", (e) => {
    deschidePoza(e);
  });
  document.querySelector(".map-button").addEventListener("click", () => {
    window.open(
      `https://www.google.com/maps?q=${card.coord.x},${card.coord.y}`,
      "_blank"
    );
  });
  //dupa vom avea si o functie similare, care afiseaza jos o lista cu card-uri similare bazate pe oras/country. Daca nu exista nu apare. Apare
  //atunci default celelalte card-uri mai populare si aici avem titlul alte oferte populare, iar la cele similare oferte similare
}
