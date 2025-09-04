// controllers/carController.js

const express = require('express');
const router = express.Router();
const db = require('../models/database');

// GET request for the welcome page
router.get('/', (req, res) => {
    res.render('welcome');
});

// GET request for the add car page
router.get('/add', (req, res) => {
    res.render('add_car');
});

// POST request to add a new car
router.post('/add', (req, res) => {
    const { make, model, year } = req.body;
    const sql = `INSERT INTO cars (make, model, year) VALUES (?, ?, ?)`;

    db.run(sql, [make, model, year], function(err) {
        if (err) {
            console.error(err.message);
            res.render('add_car', { error_message: "Error adding car." });
        } else {
            console.log(`A row has been inserted with rowid ${this.lastID}`);
            res.render('add_car', { success_message: "Car added successfully!" });
        }
    });
});

// GET request for the list cars page
router.get('/list', (req, res) => {
    const sql = `SELECT * FROM cars`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.render('list_cars', { error_message: "Error retrieving cars." });
        } else {
            res.render('list_cars', { cars: rows });
        }
    });
});

module.exports = router;