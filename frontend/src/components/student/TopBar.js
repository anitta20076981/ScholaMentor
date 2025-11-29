import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";

function TopBar({ studentId, successMessage, errorMessage }) {
  const [applyOpen, setApplyOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);

  const navigate = useNavigate();

  const avatarRef = useRef();
  const notifyRef = useRef();

  // Dummy notifications (replace with API later)
  const notifications = [
    "Your scholarship application is under review.",
    "A sponsor viewed your profile.",
    "Admin has updated your document status.",
  ];

  const unreadCount = notifications.length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const closeMenus = (event) => {
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setAvatarOpen(false);
      }
      if (notifyRef.current && !notifyRef.current.contains(event.target)) {
        setNotifyOpen(false);
      }
    };
    document.addEventListener("mousedown", closeMenus);
    return () => document.removeEventListener("mousedown", closeMenus);
  }, []);

  const handleLogout = () => {
    alert("Logout function here");
    navigate("/");
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
        {/* Success / Error toast */}
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

        {/* LOGO */}
        <Link
          to={`/student/dashboard/${studentId}`}
          style={{
            fontWeight: "bold",
            fontSize: "22px",
            color: "white",
            textDecoration: "none",
          }}
        >
          ScholaMentor
        </Link>

        {/* NAVBAR */}
        <nav style={{ display: "flex", gap: "25px", alignItems: "center" }}>
          <a href="#" style={{ color: "white", textDecoration: "none" }}>
            How It Works
          </a>

          <Link
            to={`/student/profile/${studentId}`}
            style={{ color: "white", textDecoration: "none" }}
          >
            Profile
          </Link>

          {/* APPLY DROPDOWN */}
          <div style={{ position: "relative" }}>
            <span
              style={{ cursor: "pointer" }}
              onClick={() => setApplyOpen(!applyOpen)}
            >
              Apply Scholarship ▾
            </span>

            {applyOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "30px",
                  background: "white",
                  color: "black",
                  padding: "10px",
                  borderRadius: "8px",
                  boxShadow: "0px 3px 12px rgba(0,0,0,0.2)",
                  display: "flex",
                  flexDirection: "column",
                  minWidth: "200px",
                }}
              >
                <Link
                  to={`/student/apply_scholarship/merit/${studentId}`}
                  style={{ padding: "8px 0", textDecoration: "none", color: "black" }}
                >
                  Merit Scholarship
                </Link>
                <Link
                  to={`/student/apply_scholarship/Need-based/${studentId}`}
                  style={{ padding: "8px 0", textDecoration: "none", color: "black" }}
                >
                  Need-Based Scholarship
                </Link>
                <Link
                  to={`/student/apply_scholarship/sports/${studentId}`}
                  style={{ padding: "8px 0", textDecoration: "none", color: "black" }}
                >
                  Sports Scholarship
                </Link>
                <Link
                  to={`/student/apply_scholarship/Special Scheme/${studentId}`}
                  style={{ padding: "8px 0", textDecoration: "none", color: "black" }}
                >
                  Special Scheme Scholarship
                </Link>
              </div>
            )}
          </div>

          <Link
            to={`/student/fee-concession/${studentId}`}
            style={{ color: "white", textDecoration: "none" }}
          >
            Apply Fee Concession
          </Link>

          <Link
            to={`/student/apply-sponsorship/${studentId}`}
            style={{ color: "white", textDecoration: "none" }}
          >
            Sponsorships
          </Link>

          {/* 🔔 NOTIFICATION ICON */}
          <div ref={notifyRef} style={{ position: "relative" }}>
            <div
              onClick={() => setNotifyOpen(!notifyOpen)}
              style={{ position: "relative", cursor: "pointer" }}
            >
              <FaBell size={22} />

              {/* Badge */}
              {unreadCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-6px",
                    background: "red",
                    borderRadius: "50%",
                    padding: "2px 6px",
                    fontSize: "10px",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </div>

            {/* Notification dropdown */}
            {notifyOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "30px",
                  background: "white",
                  color: "black",
                  padding: "12px",
                  width: "250px",
                  borderRadius: "8px",
                  boxShadow: "0px 3px 12px rgba(0,0,0,0.2)",
                  zIndex: 200,
                }}
              >
                <h4 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>
                  Notifications
                </h4>

                {notifications.map((note, i) => (
                  <p
                    key={i}
                    style={{
                      padding: "6px 0",
                      borderBottom: "1px solid #eee",
                      fontSize: "13px",
                    }}
                  >
                    {note}
                  </p>
                ))}

                <p
                  style={{
                    textAlign: "center",
                    marginTop: "10px",
                    fontSize: "12px",
                    color: "#2d6cdf",
                    cursor: "pointer",
                  }}
                >
                  View All
                </p>
              </div>
            )}
          </div>

          {/* AVATAR */}
          <div ref={avatarRef} style={{ position: "relative" }}>
            <div
              onClick={() => setAvatarOpen(!avatarOpen)}
              style={{
                width: "40px",
                height: "40px",
                background: "white",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                color: "#2d6cdf",
                cursor: "pointer",
              }}
            >
              A
            </div>

            {avatarOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "50px",
                  background: "white",
                  padding: "12px",
                  borderRadius: "8px",
                  boxShadow: "0px 3px 12px rgba(0,0,0,0.2)",
                  width: "160px",
                }}
              >
                <Link
                  to={`/student/profile/${studentId}`}
                  style={{
                    display: "block",
                    padding: "8px 0",
                    color: "black",
                    textDecoration: "none",
                  }}
                >
                  My Profile
                </Link>

                <span
                  style={{
                    display: "block",
                    padding: "8px 0",
                    color: "red",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                  onClick={handleLogout}
                >
                  Logout
                </span>
              </div>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}

export default TopBar;
