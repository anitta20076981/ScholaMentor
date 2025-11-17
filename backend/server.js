const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/db');  // DB connection

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

// Import route files
const authRoutes = require('./routes/authRoutes');
// const adminRoutes = require('./routes/adminRoutes');
// const studentRoutes = require('./routes/studentRoutes');

// // Add routes to the app
app.use('/api/auth', authRoutes);
// app.use('/api/admin', adminRoutes);
// app.use('/api/student', studentRoutes);



// Start server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
