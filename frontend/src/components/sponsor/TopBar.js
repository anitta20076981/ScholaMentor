import React from "react";

const Topbar = () => {
  return (
    <header
      style={{
        width: "100%",
        padding: "15px 30px",
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
      }}
    >
      {/* LOGO */}
      <div style={{ fontSize: "22px", fontWeight: "700", color: "#333" }}>
        Sponsor Portal
      </div>

      {/* NAV LINKS */}
      <nav style={{ display: "flex", gap: "25px" }}>
        <a style={styles.link} href="/sponsor/dashboard">Dashboard</a>
        <a style={styles.link} href="/sponsor/students">Students</a>
        <a style={styles.link} href="/sponsor/my-sponsorships">My Sponsorships</a>
        <a style={styles.link} href="/sponsor/donations">Donations</a>
        <a style={styles.link} href="/sponsor/mentorship">Mentor Panel</a>
      </nav>

      {/* PROFILE + LOGOUT */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <a style={styles.link} href="/sponsor/profile">Profile</a>

        <button
          style={{
            padding: "8px 16px",
            background: "#ff4d4d",
            border: "none",
            borderRadius: "6px",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "600",
          }}
          onClick={() => {
            // Replace with your logout logic
            console.log("Logout");
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

const styles = {
  link: {
    textDecoration: "none",
    color: "#333",
    fontSize: "16px",
    fontWeight: "500",
  },
};

export default Topbar;
