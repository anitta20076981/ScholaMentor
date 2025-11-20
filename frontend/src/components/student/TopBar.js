import React from "react";
import { Link } from "react-router-dom";

const navLinkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: "15px",
};

function TopBar({studentId }) {
  return (
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
      <div style={{ fontWeight: "bold", fontSize: "22px", cursor: "pointer" }}>ScholaMentor</div>
      <nav style={{ display: "flex", gap: "25px" }}>
        <a href="#" style={navLinkStyle}>How It Works</a>
        {/* <a href="#" style={navLinkStyle}>Profile</a> */}
        <Link to={`/student/profile/${studentId}`} style={navLinkStyle}>
        Profile
        </Link>
        <a href="#" style={navLinkStyle}>Scholarships</a>
        <a href="#" style={navLinkStyle}>Sponsorships</a>
        <a href="#" style={navLinkStyle}>Mentors</a>
        <a href="#" style={navLinkStyle}>Donor Support</a>
        <a href="#" style={navLinkStyle}>Logout</a>
      </nav>
    </header>
  );
}

export default TopBar;
