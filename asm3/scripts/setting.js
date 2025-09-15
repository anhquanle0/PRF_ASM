"use strict";

const inputPage = document.querySelector("#input-page-size");
const inputCategory = document.querySelector("#input-category");

const btnSubmit = document.querySelector("#btn-submit");

if (!getFromStorage("CUR_USER")) window.location.href = "login.html";

inputPage.value = User.PAGE_SIZE;
inputCategory.value = User.CATEGORY;

btnSubmit.addEventListener("click", (e) => {
  e.preventDefault();

  const [page, category] = validate();

  User.CATEGORY = (category + "").toLowerCase();
  User.PAGE_SIZE = +page;

  saveToStorage("settings", [page, category]);
});

function validate() {
  let page = inputPage.value;
  let category = inputCategory.value;

  if (!page) page = 10;

  return [page, category];
}
