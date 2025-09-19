// import { API_URL } from "../../../util/config";
import { createForm } from "./createForm.js";

let app_logo = document.querySelector(".app-logo");
let main = document.querySelector(".main");
let resource = document.querySelector(".resources");
let footer = document.querySelector(".footer");
// export const getAllOferte = async function () {
//   const url = `http://127.0.0.1:3000/api/v1/oferte/`;

//   try {
//     // Use fetch to send the GET request to the server
//     const response = await fetch(url);

//     if (response.ok) {
//       // Parse the JSON response and store it in a const
//       const jsonResponse = await response.json();

//       // Now jsonResponse contains the data, for example:
//       console.log(jsonResponse); // This logs the entire response to the console
//       return jsonResponse.data.oferte;
//     } else {
//       throw error("Error fetching data:", response.statusText);
//     }
//   } catch (error) {
//     console.error("Error:", error);
//   }
// };

// function afiseazaOferte(data) {
//   cardsList.innerHTML = data
//     .map(
//       (card) => `
//      <div class="card">
//         <p class="new-added">${card.new_Oferta}</p>
//         <p class="type">${card.type_oferta}</p>
//         <p class="perioada">${card.data}</p>
//         <p class="zona">${card.location}</p>
//         <p class="suma">${card.price}</p>
//         <p class="tara">${card.country}</p>
//         <p class="oras">${card.city}</p>
//         <img src="${API_URL}${card.poster_path}" alt="*no-photo"/>
//       </div> `
//     )
//     .join("");
// }

function hideMainElem() {
  main.innerHTML = "";
  resource.classList.add("hidden");
  footer.classList.add("hidden");
}

function createLoginForm() {
  // div container
  let login_form = document.createElement("div");
  login_form.classList.add("login_form");
  main.appendChild(login_form);

  // form
  let form_l = document.createElement("form");
  form_l.classList.add("login_form_inner");
  form_l.action = "#"; // sau action=""
  form_l.method = "POST"; // metoda contează doar pentru fallback nativ
  login_form.appendChild(form_l);

  return form_l;
}

export async function showAdminLogin() {
  //ascundem ce era
  hideMainElem();

  //cream login form
  const form_l = createLoginForm();

  const rez = createForm(form_l);
  const input_email = rez.input_email;
  const input_pass = rez.input_pass;

  form_l.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = input_email.value.trim();
    const password = input_pass.value;

    const res = await fetch("http://localhost:3000/api/v1/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include", // IMPORTANT pt cookie JWT
    });

    if (res.ok) {
      window.location.href = "http://localhost:3000/admin/dashboard";
    } else {
      alert("Login failed");
    }
  });

  app_logo.addEventListener("click", () => {
    window.location.href = "/";
  });
}
