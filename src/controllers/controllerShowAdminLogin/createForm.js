export function createForm(form_l) {
  // email label + input
  let label_email = document.createElement("label");
  label_email.innerText = "Email:";
  label_email.setAttribute("for", "email");
  form_l.appendChild(label_email);

  let input_email = document.createElement("input");
  input_email.type = "email";
  input_email.id = "email";
  input_email.name = "email";
  input_email.required = true;
  input_email.placeholder = "ex: user@email.com";
  form_l.appendChild(input_email);

  // password label + input
  let label_pass = document.createElement("label");
  label_pass.innerText = "Password:";
  label_pass.setAttribute("for", "password");
  form_l.appendChild(label_pass);

  let input_pass = document.createElement("input");
  input_pass.type = "password";
  input_pass.id = "password";
  input_pass.name = "password";
  input_pass.required = true;
  input_pass.placeholder = "••••••••";
  form_l.appendChild(input_pass);

  // login button
  let btn_login = document.createElement("button");
  btn_login.type = "submit";
  btn_login.innerText = "Login";
  btn_login.classList.add("login_btn");
  form_l.appendChild(btn_login);

  return { input_email, input_pass, btn_login };
}
