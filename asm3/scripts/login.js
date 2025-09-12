"use strict";

let userArr = Array.from(getFromStorage(KEY)).map((el) => User.from(el)) ?? [];

const inputUsername = document.querySelector("#input-username");
const inputPassword = document.querySelector("#input-password");

const btnLogin = document.querySelector("#btn-submit");

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();

  const username = inputUsername.value;
  const password = inputPassword.value;

  if (validate(username, password)) {
    const currentUser = userArr.find((el) => el.username == username);

    saveToStorage("CUR_USER", currentUser);
    console.log(currentUser);

    setTimeout(() => (window.location.href = "../index.html"), 300);
  }
});

function validate(username, password) {
  const userAcc = new Map(Array.from(userArr).map((el) => [el.username, el.password]));

  if (!username) {
    printErr(inputUsername, "Input fiedls cannot be empty");
    return false;
  }

  if (!password) {
    printErr(inputPassword, "Input fiedls cannot be empty");
    return false;
  }

  if (userAcc.get(username) != password) {
    printErr(null, "Username or password maybe wrong");
    return false;
  }

  return true;
}

function printErr(selector, message) {
  selector?.focus();
  console.log(message);
}
