let cardsList = document.querySelector(".cards-list");

export const getSomeOferte = async function (type = "Romania") {
  const url = `${process.env.server_url}/api/v1/oferte/load/type/${type}`;

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

function afiseazaOferte(data) {
  cardsList.innerHTML = data
    .map((card) => {
      const dateOnly = card.data.split("T")[0];
      return `
 <div class="card" data-id="${card.id}">
    ${card.new_Oferta ? `<span class="new-badge">Nou</span>` : ""}
    <img src="${card.images[0]}" alt="no-img" class="card-img" />
    <span class="card-title">${card.country}</span>
    <div class="card-content">
      <div class="card-header">
        <div class="date-duration">
          <span class="date">${dateOnly}</span>
        </div>
        <p class="zile">3 zile</p>
      </div>
      <div class="card-body">



        <span class="card-desc">${
          card.location
        },         <span class="card-city">${card.city}</span></span>

        <p class="descriere">${card.description_1}. ${card.description_2}</p>

        <p class="type">Tip: ${card.type_oferta}</p>
      </div>

      <div class="card-footer">
        <span class="price">${card.price} € / persoană</span>
      </div>
    </div>
  </div>
    `;
    })
    .join("");
}

export async function loadCards() {
  //1. ne conectam la db si luam oferte RO, max 12
  const oferte = await getSomeOferte();

  //2. luam ofertele salvate(trimitem zona(Romania sau Strainatate))
  //-pasul asta si 1 sunt aceleasi. Trebuie sa filtram in db in functie de ce choice avem. Sau stai la load sunt cele din romania, dar
  //la select trimitem choice. deci actiune diferita care incepe de la index.js sau sa fie trimisa si aia aici la loadCards, iar getOferte
  //daca nu are argument,choice sunt scenarii diferite. Iar in ruta avem una simpla si una cu :id
  //-se va ocupa de filtrare db
  //STAAAAAAAAAAAAAAAAAAI. Cred ca mai bine am lua toate ofertele, sa nu facem atat de multe apeluri intre db si client, mai ales ca db
  //nu are asa de multe oferte
  //Filtrarea va fi pe server, la load cu romania, daca se apasa pe strainatate se vor retine si acelea intr-un vector pe client si apoi
  //le avem pe ambele

  //3. Afisam ofertele in cards list
  afiseazaOferte(oferte);
  //-daca sunt mai mult de 4 -> realizam buton scroll dreapta
  //
  return oferte;
}
