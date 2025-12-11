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
//error correction : https://chatgpt.com/share/693a9f21-16c8-8001-aca6-2d59bd88c239
//  Initialize Socket.IO 
const io = new Server(server, {
    cors: {
        origin: "*",     
        origin: "http://localhost:3000",     
        methods: ["GET", "POST"]
    }
});

//  SOCKET.IO EVENTS 
io.on("connection", (socket) => {
     if (socket.user && socket.user.username) {
    console.log("User connected:", socket.id);
     }

    // User joins a private room (based on their user ID)
    socket.on("join_room", (userId) => {
        socket.join(`room_${userId}`);
        console.log(`User ${userId} joined room_${userId}`);
    });

    socket.on("send_message", async (data) => {
    const { senderId, receiverId, message } = data;

        if (!receiverId) {
            console.error("receiverId missing in send_message payload");
            return;
        }

        try {
            const insertQuery = `
                INSERT INTO messages (sender_id, receiver_id, message)
                VALUES (?, ?, ?)
            `;
            await db.execute(insertQuery, [senderId, receiverId, message]);

            // Send message to receiver only (ONE TIME)
            io.to(`room_${receiverId}`).emit("receive_message", {
                senderId,
                receiverId,
                message,
            });

            console.log(`Message saved & sent from ${senderId} to ${receiverId}`);
        } catch (err) {
            console.error("DB Insert Error (send_message):", err);
        }
    });

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
