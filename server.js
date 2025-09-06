// server.js

const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const app = express();
const port = 3000;

// Middleware to parse URL-encoded bodies (from forms)
app.use(express.urlencoded({ extended: true }));

// ADD THIS LINE to parse JSON request bodies from AJAX calls
app.use(express.json());

// Serve static files (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Configure Express-Handlebars
app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials')
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Import and use routes
const carRoutes = require('./controllers/carController');
app.use('/', carRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});