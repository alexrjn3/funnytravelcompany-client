let cardsList = document.querySelector(".cards-list");
let cardTitle = document.querySelector(".card-list-title");
import { API_URL } from "../../../util/config";
import { getSomeOferte } from "../controllerLoadCards/loadCards";

export async function changeOferte(choice) {
  //Totusi e ciudat ca country sa fie romania si international. acesta e mai mult un type, ne va trebui si country la cele internationale
  //pe moment lasam asa
  let data = await getSomeOferte(choice);
  cardsList.innerHTML = "";
  cardsList.innerHTML = data
    .map((card) => {
      const dateOnly = card.data.split("T")[0];
      return `
 <div class="card" data-id="${card.id}">
    ${card.new_Oferta ? `<span class="new-badge">Nou</span>` : ""}
    <img src="${API_URL}/posters/${card.images[0]}" alt="${
        card.title
      }" class="card-img" />
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
        },         <span class="card-city">${card.city}</span> </span>

                <p class="descriere">${card.description_1}. ${
        card.description_2
      }</p>
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

  cardTitle.scrollIntoView({ behavior: "smooth" });
}
