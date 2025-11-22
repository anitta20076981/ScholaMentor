import React, { useState } from "react";
import { Link } from "react-router-dom";

function TopBar({ studentId, successMessage, errorMessage }) {
  const [applyOpen, setApplyOpen] = useState(false);

  const navLinkStyle = {
    color: "white",
    textDecoration: "none",
    cursor: "pointer",
  };

  const dropdownLinkStyle = {
    padding: "8px 0",
    textDecoration: "none",
    color: "black",
  };

  const scholarshipTypes = [
    { type: "Merit", route: "merit" },
    { type: "Need-Based", route: "need" },
    { type: "Sports", route: "sports" },
    { type: "Special Scheme", route: "special" },
  ];

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
      position: "fixed",          // Fixed position so it stays on screen
      top: "70px",                // Adjust depending on TopBar height
      right: "20px",              // Distance from right edge
      zIndex: 9999,               // Make sure it's on top
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


        <div style={{ fontWeight: "bold", fontSize: "22px", cursor: "pointer" }}>
          ScholaMentor
        </div>

        <nav style={{ display: "flex", gap: "25px", position: "relative" }}>
          <a href="#" style={navLinkStyle}>
            How It Works
          </a>

          <Link to={`/student/profile/${studentId}`} style={navLinkStyle}>
            Profile
          </Link>

          {/* APPLY DROPDOWN */}
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

          <a href="#" style={navLinkStyle}>
            Sponsorships
          </a>
          <a href="#" style={navLinkStyle}>
            Mentors
          </a>
          <a href="#" style={navLinkStyle}>
            Donor Support
          </a>
          <a href="#" style={navLinkStyle}>
            Logout
          </a>
        </nav>
      </header>

    
    </>
  );
}

export default TopBar;
