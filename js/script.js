// DOM elements
const inputEl = document.getElementById("todo-input");
const formEl = document.getElementById("form");
const todoListEl = document.getElementById("todo-list");
const editPopup = document.getElementById("edit-popup");
const editInput = document.getElementById("edit-input");
const saveEditButton = document.getElementById("save-edit");
const cancelEditButton = document.getElementById("cancel-edit");

// Todos array
let todos = [];
let currentEditingTodo = null;

// Load todos from localStorage at start
window.addEventListener("DOMContentLoaded", () => {
  const stored = localStorage.getItem("todos");
  if (stored) {
    todos = JSON.parse(stored);
    todos.forEach(addTodoToDOM);
  }
});

// Handle form submit
formEl.addEventListener("submit", (e) => {
  e.preventDefault();

  const todoText = inputEl.value.trim();
  if (!todoText) return;

  const newTask = {
    id: Date.now().toString(),
    text: todoText,
    done: false,
  };

  todos.push(newTask);
  saveToLocalStorage();
  addTodoToDOM(newTask);
  inputEl.value = "";
});

// Handle checkbox and delete button
todoListEl.addEventListener("click", function (e) {
  if (e.target.closest(".delete-button")) {
    const button = e.target.closest(".delete-button");
    const id = button.getAttribute("data-id");
    todos = todos.filter((todo) => todo.id !== id);
    saveToLocalStorage();
    deleteTodoFromDOM(id);
  }

  if (e.target.closest(".edit-button")) {
    const button = e.target.closest(".edit-button");
    const id = button.getAttribute("data-id");
    openEditPopup(id);
  }

  if (e.target.type === "checkbox") {
    const checkbox = e.target;
    const todoItem = checkbox.closest(".todo-item");
    const id = todoItem.getAttribute("data-id");

    const todo = todos.find((t) => t.id === id);
    if (todo) {
      todo.done = checkbox.checked;
      saveToLocalStorage();
      todoItem.classList.toggle("completed", todo.done);
    }
  }
});

// Functions

function addTodoToDOM(task) {
  const html = `
    <li class="todo-item ${task.done ? "completed" : ""}" data-id="${task.id}">
      <input type="checkbox" ${task.done ? "checked" : ""}>
      <span class="todo-text">${task.text}</span>
      <div class="actions">
        <button type="button" class="delete-button" data-id="${task.id}">
          <i class="fa-solid fa-trash"></i>
        </button>
        <button type="button" class="edit-button" data-id="${task.id}">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
      </div>
    </li>
  `;
  todoListEl.insertAdjacentHTML("afterbegin", html);
}

function deleteTodoFromDOM(id) {
  const taskEl = document.querySelector(`.todo-item[data-id="${id}"]`);
  if (taskEl) {
    taskEl.remove();
  }
}

function saveToLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Open edit popup with the current todo
function openEditPopup(id) {
  currentEditingTodo = todos.find((todo) => todo.id === id);
  if (currentEditingTodo) {
    editInput.value = currentEditingTodo.text;
    editPopup.style.display = "flex";
  }
}

// Save edited todo
saveEditButton.addEventListener("click", () => {
  const newText = editInput.value.trim();
  if (newText && currentEditingTodo) {
    currentEditingTodo.text = newText;
    saveToLocalStorage();
    updateTodoInDOM(currentEditingTodo);
    closeEditPopup();
  }
});

cancelEditButton.addEventListener("click", () => {
  closeEditPopup();
});

function closeEditPopup() {
  editPopup.style.display = "none";
  currentEditingTodo = null;
}

function updateTodoInDOM(todo) {
  const todoItem = document.querySelector(`.todo-item[data-id="${todo.id}"]`);
  if (todoItem) {
    const span = todoItem.querySelector(".todo-text");
    span.textContent = todo.text;
  }
}
