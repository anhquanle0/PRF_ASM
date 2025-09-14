"use strict";

const TODO_KEY = "todo";

const containerTodoList = document.querySelector("#todo-list");

class Todo {
  constructor(task, owner, isDone = false) {
    this.task = task;
    this.owner = owner;
    this.isDone = isDone;
  }

  static from({ task, owner, isDone }) {
    return new Todo(task, owner, isDone);
  }
}

if (!getFromStorage("CUR_USER")) window.location.href = "login.html";

const { username } = getFromStorage("CUR_USER");

let todoArr = [
  new Todo("Meet George", "johndoe"),
  new Todo("Buy eggs", "minhnguyen"),
  new Todo("Read a book", "linhtran"),
  new Todo("Organize office", "janesmith"),
  new Todo("Meet George", "quanle", true),
  new Todo("Buy eggs", "johndoe"),
  new Todo("Read a book", "minhnguyen"),
  new Todo("Organize office", "quanle"),
];

if (!getFromStorage(TODO_KEY)) {
  saveToStorage(TODO_KEY, todoArr);
} else {
  todoArr = [...getFromStorage(TODO_KEY)]?.map((el) => Todo.from(el));
}

renderTodoList(getMyList());

function renderTodoList(list) {
  containerTodoList.innerHTML = "";

  [...list]?.map(({ task, isDone }) => {
    const html = `
        <li class="${isDone ? "checked" : ""}">${task}<span class="close">×</span></li>
    `;

    containerTodoList.insertAdjacentHTML("beforeend", html);
  });
}

containerTodoList.addEventListener("click", (e) => {
  const todo = e.target.closest("li");

  if (e.target && e.target.matches("li")) {
    todo?.classList.toggle("checked");

    const [i, { task, owner, isDone }] = findTodo(e.target);

    todoArr.fill(new Todo(task, owner, !isDone), i, i + 1);

    saveToStorage(TODO_KEY, todoArr);
  }
});

containerTodoList.addEventListener("click", (e) => {
  if (e.target && e.target.closest(".close")) {
    const [i, { task, owner, isDone }] = findTodo(e.target);

    todoArr.splice(i, 1);

    renderTodoList(getMyList());

    saveToStorage(TODO_KEY, todoArr);
  }
});

function findTodo(target) {
  const todo = target?.closest("li");

  const existedTask = Array.from(todo?.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent.trim())
    .join("");

  const i = todoArr.findIndex(({ owner, task }) => owner == username && task == existedTask);
  const existedTodo = todoArr.find(({ owner, task }) => owner == username && task == existedTask);

  return [i, existedTodo];
}

function getMyList() {
  return todoArr.filter(({ owner }) => owner == username);
}
