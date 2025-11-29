import React from "react";

const TopBar = () => {
  return (
    <header style={styles.header}>
      <div style={{ fontWeight: "600" }}>Welcome, Sponsor</div>
      <button style={styles.logout}>Logout</button>
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
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    zIndex: 100,
  },
  logout: {
    padding: "8px 16px",
    background: "#ff4d4d",
    border: "none",
    borderRadius: "6px",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default TopBar;
