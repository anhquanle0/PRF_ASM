"use strict";

const containerTodoList = document.querySelector("#todo-list");
const inputTask = document.querySelector("#input-task");
const btnAdd = document.querySelector("#btn-add");

class Todo {
  constructor(task, owner, isDone = false) {
    this.task = task;
    this.owner = owner;
    this.isDone = isDone;
  }

  static from(o) {
    if (!o) return null;
    return new Todo(o.task, o.owner, o.isDone);
  }
}

// If isn't logged in yet, navigate to LOGIN page
if (!curUser) window.location.href = "login.html";

// Initial data
let todoArr = getFromStorage(TODO_KEY) ?? [
  new Todo("Meet George", "johndoe"),
  new Todo("Buy eggs", "minhnguyen"),
  new Todo("Read a book", "linhtran"),
  new Todo("Organize office", "janesmith"),
  new Todo("Meet George", "quanle", true),
  new Todo("Buy eggs", "johndoe"),
  new Todo("Read a book", "minhnguyen"),
  new Todo("Organize office", "quanle"),
];
todoArr = [...todoArr].map((el) => Todo.from(el));
saveToStorage(TODO_KEY, todoArr);

// Render curUser's todo list
renderTodoList(getMyList());

// Add new task event handler
btnAdd.addEventListener("click", (e) => {
  e.preventDefault();

  // Retrieve data from inputs fieldd
  const task = inputTask.value;
  if (!task) {
    alert("Enter your task name");
    return;
  }

  const existedTask = [...getMyList()].find((el) => el.task.toLowerCase() == task.toLowerCase());

  if (existedTask) {
    alert("Task existed! PLease try again");
    return;
  }

  const newTask = new Todo(task, curUser.username);

  todoArr.push(newTask);

  saveToStorage(TODO_KEY, todoArr);

  renderTodoList(getMyList());

  inputTask.value = "";
});

// FORM submit event handler
document.querySelector(".todo-list-header").addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    e.preventDefault();

    btnAdd.click();
  }
});

// Render list function
function renderTodoList(list) {
  // Clear container
  containerTodoList.innerHTML = "";

  [...list].map(({ task, isDone }) => {
    const html = `
        <li class="${isDone ? "checked" : ""}">${task}<span class="close">×</span></li>
    `;

    containerTodoList.insertAdjacentHTML("beforeend", html);
  });
}

// Toggle taks isDone state
containerTodoList.addEventListener("click", (e) => {
  const todo = e.target.closest("li");

  if (e.target && e.target.matches("li")) {
    todo?.classList.toggle("checked");

    const [i, { task, owner, isDone }] = findTodo(e.target);

    todoArr.fill(new Todo(task, owner, !isDone), i, i + 1);

    saveToStorage(TODO_KEY, todoArr);
  }
});

// REMOVE taks event handler
containerTodoList.addEventListener("click", (e) => {
  if (e.target && e.target.closest(".close")) {
    const [i, { task, owner, isDone }] = findTodo(e.target);

    todoArr.splice(i, 1);

    renderTodoList(getMyList());

    saveToStorage(TODO_KEY, todoArr);
  }
});

// Find task & its index
function findTodo(eventTarget) {
  const todo = eventTarget?.closest("li");

  const taskName = Array.from(todo.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent.trim())
    .join("");

  const i = todoArr.findIndex(({ owner, task }) => owner == curUser.username && task == taskName);
  const curTask = todoArr.find(({ owner, task }) => owner == curUser.username && task == taskName);

  return [i, curTask];
}

// Get curUser todo list
function getMyList() {
  return todoArr.filter(({ owner }) => owner == curUser.username);
}
