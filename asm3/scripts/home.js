"use strict";

const loginModal = document.querySelector("#login-modal");
const message = document.querySelector("#welcome-message");
const main = document.querySelector("#main-content");

const btnLogout = document.querySelector("#btn-logout");

// Render UI based on isLogin
if (!curUser) {
  main.style.display = "none";
} else {
  loginModal.style.display = "none";
  message.innerText = `Welcome back, ${curUser.firstName}`;
}

// Event handler for LOGOUT button
btnLogout.addEventListener("click", (e) => {
  e.preventDefault();

  localStorage.removeItem(CUR_USER);

  setTimeout(() => window.location.reload(), 300);
});
