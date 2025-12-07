import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./Chat.css"; // optional styling

const socket = io("http://localhost:5000"); // replace with your backend URL

function Chat({ userId, receiverId, receiverName }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Join room for the logged-in user
    socket.emit("join_room", userId);

    // Listen for messages
    socket.on("receive_message", (msg) => {
    console.log("New message:", msg);

      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [userId]);

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
          <div key={i} className={m.senderId === userId ? "message-sent" : "message-received"}>
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
