// DOM elements

const inputEl = document.getElementById("todo-input");
const addButtonEl = document.getElementById("add-button");
const formEl = document.getElementById("form");
const todoListEl = document.getElementById("todo-list");

const todos = [];

// Event Listeners

formEl.addEventListener("click", (e) => {
  e.preventDefault();

  const todoText = inputEl.value.trim();

  if (!todoText) return;

  const newTask = {
    id: Date.now(),
    text: todoText,
    done: false,
  };

  addTodo(newTask);
  inputEl.value = "";
});

todoListEl.addEventListener("click", function (e) {
  if (e.target.closest(".delete-button")) {
    const button = e.target.closest(".delete-button");
    const id = button.getAttribute("data-id");
    deleteTodo(id);
  }
});

// Functions

function addTodo(task) {
  const html = `
    <li class="todo-item" data-id="${task.id}">
      <input type="checkbox">
      <span class="todo-text">${task.text}</span>
      <button type="button" class="delete-button" data-id="${task.id}">
        <i class="fa-solid fa-trash"></i>
      </button>
    </li>
  `;
  todoListEl.insertAdjacentHTML("afterbegin", html);
}

function deleteTodo(id) {
  const taskEl = document.querySelector(`.todo-item[data-id="${id}"]`);
  if (taskEl) {
    taskEl.remove();
  }
}
