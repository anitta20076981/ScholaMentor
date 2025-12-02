import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function TopBar({ studentId, successMessage, errorMessage }) {
  const [applyOpen, setApplyOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const scholarshipTypes = [
    { type: "Merit", route: "merit" },
    { type: "Need-Based", route: "Need-based" },
    { type: "Sports", route: "sports" },
    { type: "Special Scheme", route: "Special Scheme" },
  ];

  // Fetch notifications from backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/student/${studentId}/notifications`
        );
        const data = await res.json();
        setNotifications(data || []);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };
    fetchNotifications();
  }, [studentId]);

  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  const navLinkStyle = { color: "white", textDecoration: "none", cursor: "pointer" };
  const dropdownLinkStyle = { padding: "8px 0", textDecoration: "none", color: "black" };

  const handleNotificationClick = async (notificationId) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/student/notifications/read/${notificationId}`, {
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
    <>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 40px",
          background: "#2d6cdf",
          color: "white",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        {/* Success / Error Message */}
        {(successMessage || errorMessage) && (
          <div
            style={{
              position: "fixed",
              top: "70px",
              right: "20px",
              zIndex: 9999,
              padding: "10px 20px",
              background: successMessage ? "#d4edda" : "#f8d7da",
              color: successMessage ? "#155724" : "#721c24",
              border: successMessage ? "1px solid #c3e6cb" : "1px solid #f5c6cb",
              borderRadius: "6px",
              minWidth: "200px",
              maxWidth: "350px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
              textAlign: "left",
            }}
          >
            {successMessage || errorMessage}
          </div>
        )}

        <Link
          to={`/student/dashboard/${studentId}`}
          style={{ fontWeight: "bold", fontSize: "22px", color: "white", textDecoration: "none" }}
        >
          ScholaMentor
        </Link>

        <nav style={{ display: "flex", gap: "25px", alignItems: "center", position: "relative" }}>
          <a href="#" style={navLinkStyle}>
            How It Works
          </a>

          <Link to={`/student/profile/${studentId}`} style={navLinkStyle}>
            Profile
          </Link>

          {/* Apply Scholarship Dropdown */}
          <div style={{ position: "relative" }}>
            <span style={navLinkStyle} onClick={() => setApplyOpen(!applyOpen)}>
              Apply Scholarship ▾
            </span>
            {applyOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "28px",
                  background: "white",
                  color: "black",
                  padding: "10px",
                  borderRadius: "8px",
                  boxShadow: "0px 3px 12px rgba(0,0,0,0.2)",
                  display: "flex",
                  flexDirection: "column",
                  minWidth: "200px",
                  zIndex: 200,
                }}
              >
                {scholarshipTypes.map((scholarship) => (
                  <Link
                    key={scholarship.route}
                    to={`/student/apply_scholarship/${scholarship.route}/${studentId}`}
                    style={dropdownLinkStyle}
                  >
                    {scholarship.type} Scholarship
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link to={`/student/fee-concession/${studentId}`} style={navLinkStyle}>
            Apply Fee Concession
          </Link>

          <Link to={`/student/apply-sponsorship/${studentId}`} style={navLinkStyle}>
            Sponsorships
          </Link>
           <Link to={`/student/sponsorship-history/${studentId}`} style={navLinkStyle}>
            My Sponsorships
          </Link>

          {/* Notification Icon */}
          <div style={{ position: "relative" }}>
            <span
              style={{ cursor: "pointer", fontSize: "22px", marginRight: "10px", position: "relative" }}
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
                background: "white",
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
                  to={`/student/profile/${studentId}`}
                  style={{ display: "block", padding: "10px 20px", color: "black", textDecoration: "none" }}
                >
                  Profile
                </Link>
                <Link
                  to="/logout"
                  style={{ display: "block", padding: "10px 20px", color: "black", textDecoration: "none" }}
                >
                  Logout
                </Link>
              </div>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}

export default TopBar;
