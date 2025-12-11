import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUserGraduate,
  FaHandHoldingUsd,
  FaUsers,
  FaChalkboardTeacher,
  FaUserCircle,
} from "react-icons/fa";

import "./Sidebar.css";

export default function Sidebar({ mentorId , mentorStatus}) {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">ScholaMentor</h2>

      <nav className="sidebar-menu">
        
        <NavLink to={`/mentor/dashboard/${mentorId}`} className="sidebar-link">
          <FaHome className="icon" /> Dashboard
        </NavLink>

        <NavLink to={`/mentor/mentor-profile/${mentorId}`} className="sidebar-link">
          <FaUserCircle className="icon" /> Profile
        </NavLink>
      {mentorStatus == "active" && (  
        <NavLink to={`/mentor/student-request/${mentorId}`} className="sidebar-link">
          <FaUserGraduate className="icon" /> Students Request
        </NavLink>
      )}
        
      </nav>
    </aside>
  );
}
