const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

// ข้อมูลตัวอย่าง
let tasks = [
    {
        id: 1,
        title: "ทำ Mini Project",
        category: "University",
        done: false
    },
    {
        id: 2,
        title: "อ่านหนังสือ",
        category: "Study",
        done: true
    }
];

let nextId = 3;

// GET /api/tasks
// รองรับ filter เช่น ?category=Study หรือ ?done=true
app.get("/api/tasks", (req, res) => {
    let result = tasks;

    if (req.query.category) {
        result = result.filter(
            task =>
                task.category.toLowerCase() ===
                req.query.category.toLowerCase()
        );
    }

    if (req.query.done !== undefined) {
        const done = req.query.done === "true";
        result = result.filter(task => task.done === done);
    }

    res.json(result);
});

// GET /api/tasks/:id
app.get("/api/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    const task = tasks.find(task => task.id === id);

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    res.json(task);
});

// POST /api/tasks
app.post("/api/tasks", (req, res) => {
    const { title, category, done } = req.body;

    if (!title || !category) {
        return res.status(400).json({
            message: "title and category are required"
        });
    }

    const newTask = {
        id: nextId++,
        title,
        category,
        done: done ?? false
    };

    tasks.push(newTask);

    res.status(201).json(newTask);
});

// PATCH /api/tasks/:id
app.patch("/api/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    const task = tasks.find(task => task.id === id);

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    const { title, category, done } = req.body;

    if (title !== undefined) task.title = title;
    if (category !== undefined) task.category = category;
    if (done !== undefined) task.done = done;

    res.json(task);
});

// DELETE /api/tasks/:id
app.delete("/api/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = tasks.findIndex(task => task.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    tasks.splice(index, 1);

    res.status(204).send();
});

// เปิดหน้าเว็บไซต์
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});