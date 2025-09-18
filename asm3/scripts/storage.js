"use strict";

function saveToStorage(k, v) {
  localStorage.setItem(k, JSON.stringify(v));
}

function getFromStorage(k) {
  return JSON.parse(localStorage.getItem(k));
}

//////////////////////////////
//////////////////////////////
//////////////////////////////
const [USER_KEY, SETTING_KEY, CUR_USER, TODO_KEY] = ["users", "settings", "curUser", "todo"];

// Init data
let initialUsers = getFromStorage(USER_KEY) ?? [
  new User("John", "Doe", "johndoe", "password123"),
  new User("Jane", "Smith", "janesmith", "mypassword"),
  new User("Minh", "Nguyen", "minhnguyen", "123456"),
  new User("Linh", "Tran", "linhtran", "linh@2024"),
  new User("Bao", "Pham", "baopham", "bao!secure"),
];
initialUsers = [...initialUsers].map((v) => User.from(v));
saveToStorage(USER_KEY, initialUsers);

let [page, category] = getFromStorage(SETTING_KEY) ?? [10, "General"];
saveToStorage(SETTING_KEY, [+page, category]);

User.PAGE_SIZE = +page;
User.CATEGORY = category;

let curUser = User.from(getFromStorage(CUR_USER));
