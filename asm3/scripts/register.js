"use strict";

const inputFirstName = document.querySelector("#input-firstname");
const inputLastName = document.querySelector("#input-lastname");
const inputUsername = document.querySelector("#input-username");
const inputPassword = document.querySelector("#input-password");
const inputPasswordConfirm = document.querySelector("#input-password-confirm");

const btnSubmit = document.querySelector("#btn-submit");
const form = document.querySelector("form");

const userArr = [...initialUsers];

// Btn REGISTER event handler
btnSubmit.addEventListener("click", (e) => {
  const fName = inputFirstName.value.trim();
  const lName = inputLastName.value.trim();
  const username = inputUsername.value;
  const password = inputPassword.value;
  const passwordC = inputPasswordConfirm.value;

  const newUser = new User(fName, lName, username, password);

  if (!validateUser(newUser, passwordC)) return;

  userArr.push(newUser);

  saveToStorage(USER_KEY, userArr);

  setTimeout(() => (window.location.href = "login.html"), 300);
});

// FORM submit event handler
form.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    e.preventDefault();

    btnSubmit.click();
  }
});

// Validate inputs fields
function validateUser({ firstName, lastName, username, password }, passwordC) {
  const namePattern = /^\p{L}+(?:[\s'\-]\p{L}+)*$/u;
  const passwordPattern = /^.{9,}$/;

  if (!firstName || !lastName || !username || !password || !passwordC) {
    warning("Inputs fields cannot be empty");
    return;
  }

  if (!namePattern.test(firstName)) {
    warning("Invalid first name", inputFirstName);
    return false;
  }

  if (!namePattern.test(lastName)) {
    warning("Invalid last name", inputLastName);
    return false;
  }

  if (userArr.find((e) => e.username == username)) {
    warning("Invalid username", inputUsername);
    return false;
  }

  if (!passwordPattern.test(password)) {
    warning("Invalid password", inputPassword);
    return false;
  }

  if (password != passwordC) {
    warning("Confirmed password not matched", inputPasswordConfirm);
    return false;
  }

  return true;
}

// Annoucement
function warning(message, selector) {
  alert(message);
  selector?.focus();
}
