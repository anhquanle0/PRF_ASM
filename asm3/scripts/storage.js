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
