import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUserGraduate,
  FaHandHoldingUsd,
  FaUsers,
  FaChalkboardTeacher,
} from "react-icons/fa";

import "./Sidebar.css";

export default function Sidebar({ mentorId }) {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">ScholaMentor</h2>

      <nav className="sidebar-menu">
        
        <NavLink to={`/mentor/dashboard/${mentorId}`} className="sidebar-link">
          <FaHome className="icon" /> Dashboard
        </NavLink>

        <NavLink to={`/sponsor/student-request/${mentorId}`} className="sidebar-link">
          <FaUserGraduate className="icon" /> Students Request
        </NavLink>

        <NavLink to={`/sponsor/approved-sponsorships/${mentorId}`} className="sidebar-link">
          <FaHandHoldingUsd className="icon" /> My Sponsorships
        </NavLink>

        <NavLink to="/sponsor/donations" className="sidebar-link">
          <FaUsers className="icon" /> Donations
        </NavLink>

        <NavLink to="/sponsor/mentorship" className="sidebar-link">
          <FaChalkboardTeacher className="icon" /> Mentor Panel
        </NavLink>
      </nav>
    </aside>
  );
}
