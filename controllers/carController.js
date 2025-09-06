// controllers/carController.js
const express = require('express');
const router = express.Router();
const db = require('../models/database');

// GET request to render the main cars page with initial data
router.get('/cars', (req, res) => {
    const sql = `SELECT * FROM cars`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.render('cars', { cars: [], error: 'Error retrieving cars' });
        } else {
            res.render('cars', { cars: rows });
        }
    });
});

// API endpoint to get all cars (for AJAX)
router.get('/api/cars', (req, res) => {
    const sql = `SELECT * FROM cars`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// API endpoint to get a single car (for Edit)
router.get('/api/cars/:id', (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM cars WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(row);
    });
});

// API endpoint to add a new car
router.post('/api/cars', (req, res) => {
    console.log(req.body);
    const { make, model, year } = req.body;
    const sql = `INSERT INTO cars (make, model, year) VALUES (?, ?, ?)`;
    db.run(sql, [make, model, year], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, make, model, year });
    });
});

// API endpoint to edit a car
router.put('/api/cars/:id', (req, res) => {
    const { id } = req.params;
    const { make, model, year } = req.body;
    const sql = `UPDATE cars SET make = ?, model = ?, year = ? WHERE id = ?`;
    db.run(sql, [make, model, year, id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id, make, model, year });
    });
});

// API endpoint to delete a car
router.delete('/api/cars/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM cars WHERE id = ?`;
    db.run(sql, [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Car deleted successfully' });
    });
});

// Existing welcome route
router.get('/', (req, res) => {
    res.render('welcome');
});

module.exports = router;