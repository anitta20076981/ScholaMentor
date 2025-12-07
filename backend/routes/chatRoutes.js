// routes/chatRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET messages between two users
router.get("/messages/:userId/:receiverId", async (req, res) => {
  const { userId, receiverId } = req.params;
  try {
    const [rows] = await db.execute(
      "SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY timestamp ASC",
      [userId, receiverId, receiverId, userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

module.exports = router;
