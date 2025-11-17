const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/db');  // make sure you have db.js

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Test API route
app.get('/', (req, res) => {
    res.send("Backend server is running!");
});

// Test database route
app.get('/test-db', (req, res) => {
    db.query('SELECT DATABASE() AS db_name', (err, results) => {
        if (err) {
            console.error('DB query error:', err);
            res.status(500).send('Database query failed');
        } else {
            res.send(results); // returns the database name
        }
    });
});

// Start server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
