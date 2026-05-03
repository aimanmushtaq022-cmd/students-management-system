const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Initialize Database
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) console.error(err.message);
    else console.log("Database connected. Data will be saved to database.db");
});

// Create Table
db.run(`CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    regNo TEXT UNIQUE NOT NULL
)`);

// Routes
app.get('/students', (req, res) => {
    db.all("SELECT name, regNo FROM students", [], (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
    });
});

app.post('/add-student', (req, res) => {
    const { name, regNo } = req.body;
    db.run("INSERT INTO students (name, regNo) VALUES (?, ?)", [name, regNo], (err) => {
        if (err) return res.status(400).send("Error: Registration number already exists.");
        res.status(201).send("Student registered successfully!");
    });
});

app.put('/update-student', (req, res) => {
    const { regNo, newName } = req.body;
    db.run("UPDATE students SET name = ? WHERE regNo = ?", [newName, regNo], function(err) {
        if (this.changes === 0) return res.status(404).send("Registration Number not found.");
        res.send("Updated successfully!");
    });
});

app.delete('/delete-student/:id', (req, res) => {
    db.run("DELETE FROM students WHERE regNo = ?", [req.params.id], (err) => {
        res.send("Student deleted successfully.");
    });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));