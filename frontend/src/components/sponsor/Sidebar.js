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

export default function Sidebar({ sponsorId }) {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">ScholaMentor</h2>

      <nav className="sidebar-menu">
        
        <NavLink to={`/sponsor/dashboard/${sponsorId}`} className="sidebar-link">
          <FaHome className="icon" /> Dashboard
        </NavLink>

        <NavLink to="/sponsor/students" className="sidebar-link">
          <FaUserGraduate className="icon" /> Students
        </NavLink>

        <NavLink to="/sponsor/my-sponsorships" className="sidebar-link">
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
