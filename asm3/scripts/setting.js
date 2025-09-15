"use strict";

const inputPage = document.querySelector("#input-page-size");
const inputCategory = document.querySelector("#input-category");

const btnSubmit = document.querySelector("#btn-submit");

const form = document.querySelector("form");

if (!getFromStorage("CUR_USER")) window.location.href = "login.html";

inputPage.value = User.PAGE_SIZE;
inputCategory.value = User.CATEGORY;

btnSubmit.addEventListener("click", (e) => {
  e.preventDefault();

  const [page, category] = validate();

  User.CATEGORY = (category + "").toLowerCase();
  User.PAGE_SIZE = +page;

  alert("Success");

  saveToStorage("settings", [page, category]);
});

form.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    e.preventDefault();

    btnSubmit.click();
  }
});

function validate() {
  let page = inputPage.value;
  let category = inputCategory.value;

  if (!page) page = 10;

  return [page, category];
}
