const input = document.getElementById("todoInput");
const list = document.getElementById("todoList");
const popup = document.getElementById("popup");
const title = document.getElementById("popupTitle");
const message = document.getElementById("popupMessage");
const popupInput = document.getElementById("popupInput");
const cancelBtn = document.getElementById("cancelBtn");
const confirmBtn = document.getElementById("confirmBtn");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let action = "";
let currentId = null;

function save() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

function showPopup(titleText, messageText, type, value = "", id = null) {
    title.textContent = titleText;
    message.textContent = messageText;
    popupInput.value = value;
    popupInput.style.display = type === "edit" ? "block" : "none";
    cancelBtn.style.display = type === "alert" ? "none" : "block";
    confirmBtn.textContent = type === "delete" ? "Delete" : type === "edit" ? "Update" : "OK";
    confirmBtn.className = type === "delete" ? "delete" : "";
    action = type;
    currentId = id;
    popup.classList.add("show");
    if(type === "edit") popupInput.focus();
}

function closePopup() {
    popup.classList.remove("show");
}

function render() {
    list.innerHTML = "";
    todos.forEach(todo => {
        const item = document.createElement("li");
        item.className = "todo-item";
        item.innerHTML = `
            <span class="todo-text"></span>
            <div class="todo-actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
        item.querySelector(".todo-text").textContent = todo.text;
        item.querySelector(".edit-btn").onclick = () =>
            showPopup("Update Task", "Edit your task:", "edit", todo.text, todo.id);
        item.querySelector(".delete-btn").onclick = () =>
            showPopup("Delete Task", "Are you sure you want to delete this task?", "delete", "", todo.id);
        list.appendChild(item);
    });
}

function addTodo() {
    const text = input.value.trim();
    if (!text) {
        showPopup("Empty Task", "Please enter a task.", "alert");
        return;
    }
    todos.push({ id: Date.now(), text });
    save();
    render();
    input.value = "";
    input.focus();
}

document.getElementById("addBtn").onclick = addTodo;

input.onkeydown = event => {
    if(event.key === "Enter") addTodo();
};

confirmBtn.onclick = () => {
    if(action === "edit") {
        const todo = todos.find(todo => todo.id === currentId);
        const text = popupInput.value.trim();
        if(todo && text) {
            todo.text = text;
            save();
            render();
            closePopup();
        }
    }

    if(action === "delete") {
        todos = todos.filter(todo => todo.id !== currentId);
        save();
        render();
        closePopup();
    }

    if(action === "alert") closePopup();
};

cancelBtn.onclick = closePopup;

popup.onclick = event => {
    if (event.target === popup) closePopup();
};

render();