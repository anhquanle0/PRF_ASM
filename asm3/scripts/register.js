"use strict";

const inputFirstName = document.querySelector("#input-firstname");
const inputLastName = document.querySelector("#input-lastname");
const inputUsername = document.querySelector("#input-username");
const inputPassword = document.querySelector("#input-password");
const inputPasswordConfirm = document.querySelector("#input-password-confirm");

const btnSubmit = document.querySelector("#btn-submit");

const KEY = "USER_ARRAY";

class User {
  constructor(firstName, lastName, username, password) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.password = password;
  }

  static from({ firstName, lastName, username, password }) {
    return new User(firstName, lastName, username, password);
  }
}

let userArr = Array.from(getFromStorage(KEY)).map((el) => User.from(el)) ?? [
  new User("John", "Doe", "johndoe", "password123"),
  new User("Jane", "Smith", "janesmith", "mypassword"),
  new User("Minh", "Nguyen", "minhnguyen", "123456"),
  new User("Linh", "Tran", "linhtran", "linh@2024"),
  new User("Bao", "Pham", "baopham", "bao!secure"),
];

saveToStorage(KEY, userArr);

function validateUser({ firstName, lastName, username, password }, passwordC) {
  const namePattern = /^\p{L}+(?:[\s'\-]\p{L}+)*$/u;
  const passwordPattern = /^.{9,}$/;

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

window.warning = function (selector, message) {
  selector.focus();
  console.log(message);
};

/////////////////////////////////
/////////////////////////////////
/////////////////////////////////

btnSubmit.addEventListener("click", (e) => {
  e.preventDefault();

  const fName = inputFirstName.value.trim();
  const lName = inputLastName.value.trim();
  const username = inputUsername.value;
  const password = inputPassword.value;
  const passwordC = inputPasswordConfirm.value;

  const newUser = new User(fName, lName, username, password);

  if (!validateUser(newUser, passwordC)) {
    userArr.push(newUser);

    saveToStorage(KEY, userArr);

    setTimeout(() => (window.location.href = "login.html"), 300);
  }
});
