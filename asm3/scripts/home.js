"use strict";

const loginModal = document.querySelector("#login-modal");
const main = document.querySelector("#main-content");

const message = document.querySelector("#welcome-message");

const curUser = getFromStorage("CUR_USER");

if (!curUser) {
  main.style.display = "none";
} else {
  loginModal.style.display = "none";

  message.innerText = `Welcome back, ${User.from(curUser).firstName}`;
}
