"use strict";

const inputUsername = document.querySelector("#input-username");
const inputPassword = document.querySelector("#input-password");

const btnLogin = document.querySelector("#btn-submit");
const form = document.querySelector("form");

const userArr = [...initialUsers];

// Btn LOGIN event handler
btnLogin.addEventListener("click", (e) => {
  const username = inputUsername.value;
  const password = inputPassword.value;

  if (!validate(username, password)) return;

  const currentUser = userArr.find((user) => user.username == username);

  saveToStorage(CUR_USER, currentUser);

  setTimeout(() => (window.location.href = "../index.html"), 300);
});

// FORM submit event handler (Enter key)
form.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    e.preventDefault();

    btnLogin.click();
  }
});

// Validate input fields
function validate(username, password) {
  const userAcc = new Map(userArr.map(({ username, password }) => [username, password]));

  if (!username || !password) {
    alert("Input fields cannot be empty");
    inputUsername.focus();
    return false;
  }

  if (!password) {
    alert("Input fields cannot be empty");
    inputPassword.focus();
    return false;
  }

  if (userAcc.get(username) != password) {
    alert("Username or password maybe wrong");
    return false;
  }

  return true;
}
