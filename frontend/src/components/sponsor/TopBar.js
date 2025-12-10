import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const TopBar = ({ sponsorId, studentId, sponsorStatus }) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications from backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/sponsor/${sponsorId}/notifications`
        );
        const data = await res.json();
        setNotifications(data || []);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };
    fetchNotifications();
  }, [sponsorId]);

  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  const handleNotificationClick = async (notificationId) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/sponsor/notifications/read/${notificationId}`, {
        method: "PUT",
      });

      setNotifications((prevNotifications) =>
        prevNotifications.map((n) =>
          n.id === notificationId ? { ...n, status: "read" } : n
        )
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  return (
    <header style={styles.header}>
      <div style={{ fontWeight: "600" }}>Welcome, Sponsor</div>

      {sponsorStatus == "inactive" && (
  <div className="inactive-warning">
    You are currently inactive. Please update your profile and wait for admin approval.
  </div>
)}

      {/* Right side: Notification + Avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px", marginLeft: "auto" }}>
        {/* Notification Icon */}
        <div style={{ position: "relative" }}>
          <span
            style={{
              cursor: "pointer",
              fontSize: "22px",
              position: "relative",
            }}
            onClick={() => setNotifOpen(!notifOpen)}
          >
            🔔
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-10px",
                  background: "red",
                  color: "white",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  fontSize: "12px",
                }}
              >
                {unreadCount}
              </span>
            )}
          </span>

          {notifOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "30px",
                background: "white",
                color: "black",
                width: "280px",
                borderRadius: "8px",
                padding: "10px",
                boxShadow: "0px 3px 12px rgba(0,0,0,0.25)",
                zIndex: 300,
              }}
            >
              <h4 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>Notifications</h4>
              {notifications.length === 0 ? (
                <p style={{ fontSize: "14px", color: "gray" }}>No new notifications</p>
              ) : (
                notifications.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => handleNotificationClick(note.id)}
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid #ddd",
                      fontSize: "14px",
                      fontWeight: note.status === "unread" ? "bold" : "normal",
                      cursor: "pointer",
                    }}
                  >
                    {note.message}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Avatar */}
        <div style={{ position: "relative" }}>
          <span
            onClick={() => setAvatarOpen(!avatarOpen)}
            style={{
              width: "35px",
              height: "35px",
              background: "#ff6a00",
              color: "#2d6cdf",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "18px",
            }}
          >
            A
          </span>

          {avatarOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "40px",
                background: "white",
                width: "180px",
                borderRadius: "8px",
                padding: "10px 0",
                boxShadow: "0px 3px 12px rgba(0,0,0,0.25)",
                zIndex: 300,
              }}
            >
               
              <Link
                to="/logout"
                style={{
                  display: "block",
                  padding: "10px 20px",
                  color: "black",
                  textDecoration: "none",
                }}
              >
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    position: "fixed",
    top: 0,
    left: "250px",
    right: 0,
    height: "60px",
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    padding: "0 20px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    zIndex: 100,
  },
};

export default TopBar;
