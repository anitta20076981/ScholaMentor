// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/db');  // MySQL DB connection
const http = require('http');
const { Server } = require('socket.io'); // Socket.IO
const path = require("path");

const app = express();

app.use(cors());               // Allow requests from frontend
app.use(bodyParser.json());    // Parse JSON requests

//  Create HTTP server for Socket.IO 
const server = http.createServer(app); 

//  Initialize Socket.IO 
const io = new Server(server, {
    cors: {
        origin: "*",     
        origin: "http://localhost:3000",       // For development, allow all origins
        methods: ["GET", "POST"]
    }
});

//  SOCKET.IO EVENTS 
io.on("connection", (socket) => {
    if (socket.user && socket.user.username) {
        console.log(`User connected: ${socket.user.username}`);
    }
    // User joins a private room (based on their user ID)
    socket.on("join_room", (userId) => {
        socket.join(`room_${userId}`);
        console.log(`User ${userId} joined room_${userId}`);
    });

    socket.on("send_message", async (data) => {       
        // Emit to sender and receiver
        io.to(`room_${receiverId}`).emit("receive_message", data);
    });
    // Fires when client disconnects
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});


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


const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const studentRoutes = require('./routes/studentRoutes');
const sponsorRoutes = require('./routes/sponsorRoutes');
const mentorRoutes = require('./routes/mentorRoutes');


app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/sponsor', sponsorRoutes);
app.use('/api/mentor', mentorRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 

const chatRoutes = require("./routes/chatRoutes");
app.use("/api/chat", chatRoutes);

// Start server 
const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
