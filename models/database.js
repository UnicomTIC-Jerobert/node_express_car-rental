// models/database.js

const sqlite3 = require('sqlite3').verbose();

// Connect to the database
const db = new sqlite3.Database('./cars.db', (err) => {
    if (err) {
        console.error("Error opening database " + err.message);
    } else {
        console.log("Connected to the SQLite database.");
        // Create the 'cars' table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS cars (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            make TEXT NOT NULL,
            model TEXT NOT NULL,
            year INTEGER NOT NULL
        )`, (err) => {
            if (err) {
                console.error("Error creating table " + err.message);
            } else {
                console.log("Cars table created or already exists.");
            }
        });
    }
});

module.exports = db;