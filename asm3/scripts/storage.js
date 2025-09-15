"use strict";

function saveToStorage(k, v) {
  if (v instanceof Map) {
    localStorage.setItem(k, JSON.stringify(Array.from(v.values())));
  } else {
    localStorage.setItem(k, JSON.stringify(v));
  }
}

function getFromStorage(k) {
  return JSON.parse(localStorage.getItem(k));
}

//////////////////////////////
//////////////////////////////
//////////////////////////////

if (!getFromStorage(KEY)) {
  saveToStorage(KEY, userArr);
} else {
  userArr = [...getFromStorage(KEY)]?.map((el) => User.from(el));
}

if (!getFromStorage("settings")) {
  User.PAGE_SIZE = 10;
  User.CATEGORY = "General";

  saveToStorage("settings", [User.PAGE_SIZE, User.CATEGORY]);
} else {
  User.PAGE_SIZE = +getFromStorage("settings")[0];
  User.CATEGORY = getFromStorage("settings")[1] + "";
}
