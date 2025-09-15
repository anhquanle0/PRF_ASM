"use strict";

const inputFirstName = document.querySelector("#input-firstname");
const inputLastName = document.querySelector("#input-lastname");
const inputUsername = document.querySelector("#input-username");
const inputPassword = document.querySelector("#input-password");
const inputPasswordConfirm = document.querySelector("#input-password-confirm");

const btnSubmit = document.querySelector("#btn-submit");

// Form submit
btnSubmit.addEventListener("click", (e) => {
  const fName = inputFirstName.value.trim();
  const lName = inputLastName.value.trim();
  const username = inputUsername.value;
  const password = inputPassword.value;
  const passwordC = inputPasswordConfirm.value;
  const newUser = new User(fName, lName, username, password);

  if (validateUser(newUser, passwordC)) {
    userArr.push(newUser);

    saveToStorage(KEY, userArr);

    setTimeout(() => (window.location.href = "login.html"), 300);
  }
});

// Event handler from 'ENTER' keydown
document.querySelector("form").addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    e.preventDefault();
    btnSubmit.click();
  }
});

// Validate inputs fields
function validateUser(user, passwordC) {
  const namePattern = /^\p{L}+(?:[\s'\-]\p{L}+)*$/u;
  const passwordPattern = /^.{9,}$/;

  const { firstName, lastName, username, password } = user;

  if (!firstName || !namePattern.test(firstName)) {
    warning(inputFirstName, "Invalid first name");
    return false;
  }

  if (!lastName || !namePattern.test(lastName)) {
    warning(inputLastName, "Invalid last name");
    return false;
  }

  if (!username || userArr.some((e) => e.username == username)) {
    warning(inputUsername, "Invalid username");
    return false;
  }

  if (!password || !passwordPattern.test(password)) {
    warning(inputPassword, "Invalid password");
    return false;
  }

  if (password != passwordC) {
    warning(inputPasswordConfirm, "Confirmed password not matched");
    return false;
  }

  return true;
}

// Annoucement
function warning(selector, message) {
  selector?.focus();
  alert(message);
}
