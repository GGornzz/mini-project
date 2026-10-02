const taskForm = document.getElementById("taskForm");
const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
const taskList = document.getElementById("taskList");
const filterInput = document.getElementById("filter");

let currentTasks = [];

// GET
async function loadTasks() {
    const filter = filterInput.value;

    let url = "/api/tasks";

    if (filter !== "all") {
        url += `?done=${filter}`;
    }

    const response = await fetch(url);
    currentTasks = await response.json();

    displayTasks(currentTasks);
}

// แสดงรายการ
function displayTasks(tasks) {
    taskList.innerHTML = "";

    if (tasks.length === 0) {
        taskList.innerHTML = `
      <div class="empty">
        No tasks found 🌷
      </div>
    `;
        return;
    }

    tasks.forEach(task => {

        const div = document.createElement("div");
        div.className = "task";

        div.innerHTML = `
      <div class="task-info">
        <div class="task-title ${task.done ? "completed" : ""}">
          ${task.title}
        </div>

        <div class="task-category">
          ${task.category} · ${task.done ? "Completed" : "Not completed"}
        </div>
      </div>

      <div class="actions">

        <button
          class="edit"
          onclick="editTask(${task.id})">
          Edit
        </button>

        <button
          class="delete"
          onclick="deleteTask(${task.id})">
          Delete
        </button>

      </div>
    `;

        taskList.appendChild(div);
    });
}

// POST
taskForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const title = titleInput.value.trim();
    const category = categoryInput.value;

    if (!title) {
        alert("Please enter a task.");
        return;
    }

    const response = await fetch("/api/tasks", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            title,
            category,
            done: false
        })
    });

    if (response.ok) {
        titleInput.value = "";
        await loadTasks();
    } else {
        alert("Failed to add task.");
    }
});

// PATCH
async function editTask(id) {

    const task = currentTasks.find(task => task.id === id);

    if (!task) return;

    const newTitle = prompt("Edit task:", task.title);

    if (newTitle === null || newTitle.trim() === "") {
        return;
    }

    const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            title: newTitle.trim(),
            done: !task.done
        })
    });

    if (response.ok) {
        await loadTasks();
    }
}

// DELETE
async function deleteTask(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE"
    });

    if (response.status === 204) {
        await loadTasks();
    }
}

filterInput.addEventListener("change", loadTasks);

// โหลดข้อมูลตอนเปิดเว็บ
loadTasks();