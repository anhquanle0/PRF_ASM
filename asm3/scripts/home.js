"use strict";

const loginModal = document.querySelector("#login-modal");
const main = document.querySelector("#main-content");

const message = document.querySelector("#welcome-message");

const btnLogout = document.querySelector("#btn-logout");

const curUser = getFromStorage("CUR_USER");

if (!curUser) {
  main.style.display = "none";
} else {
  loginModal.style.display = "none";

  message.innerText = `Welcome back, ${User.from(curUser).firstName}`;
}

btnLogout.addEventListener("click", (e) => {
  e.preventDefault();

  localStorage.removeItem("CUR_USER");

  setTimeout(() => window.location.reload(), 300);
});
