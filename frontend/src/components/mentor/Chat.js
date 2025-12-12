import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import "./Chat.css";

// const socket = io("http://localhost:5000"); // backend URL
const socket = io(process.env.REACT_APP_API_URL, {
  transports: ["websocket"]  // forces WebSocket, avoids CORS polling issues
});


function Chat({ userId, receiverId, receiverName }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Join room for real-time
    socket.emit("join_room", userId);

    // Listen for new messages
    const handleReceiveMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };
    socket.on("receive_message", handleReceiveMessage);

    // Fetch old messages from backend
    const fetchOldMessages = async () => {
      try {
        // const res = await axios.get(
        //   `http://localhost:5000/api/chat/messages/${userId}/${receiverId}`
        // );

        const res = await axios.get(
  `${process.env.REACT_APP_API_URL}/api/chat/messages/${userId}/${receiverId}`
);
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to fetch old messages:", err);
      }
    };
    fetchOldMessages();

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [userId, receiverId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const messageData = {
      senderId: userId,
      receiverId,
      message: newMessage,
      timestamp: new Date().toISOString(),
    };

    socket.emit("send_message", messageData);
    setMessages((prev) => [...prev, messageData]);
    setNewMessage("");
  };

  return (
    <div className="chat-box">
      <h4>Chat with {receiverName}</h4>
      <div className="messages">
        {messages.map((m, i) => (
          <div
            key={i}
            className={m.sender_id === userId || m.senderId === userId ? "message-sent" : "message-received"}
          >
            {m.message}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;
