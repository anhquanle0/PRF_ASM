"use strict";

const inputUsername = document.querySelector("#input-username");
const inputPassword = document.querySelector("#input-password");

const btnLogin = document.querySelector("#btn-submit");

// Form submit event handle
btnLogin.addEventListener("click", (e) => {
  const username = inputUsername.value;
  const password = inputPassword.value;

  if (validate(username, password)) {
    const currentUser = userArr.find((el) => el.username == username);

    saveToStorage("CUR_USER", currentUser);

    setTimeout(() => (window.location.href = "../index.html"), 300);
  }
});

// Event handler from 'ENTER' keydown
document.querySelector("form").addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    e.preventDefault();
    btnLogin.click();
  }
});

// Validate input fields
function validate(username, password) {
  const userAcc = new Map(Array.from(userArr).map((el) => [el.username, el.password]));

  if (!username) {
    warning(inputUsername, "Input fiedls cannot be empty");
    return false;
  }

  if (!password) {
    warning(inputPassword, "Input fiedls cannot be empty");
    return false;
  }

  if (userAcc.get(username) != password) {
    warning(null, "Username or password maybe wrong");
    return false;
  }

  return true;
}

// Annoucement
function warning(selector, message) {
  selector?.focus();
  alert(message);
}
