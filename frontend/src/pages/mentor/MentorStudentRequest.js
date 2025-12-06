import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/mentor/Sidebar";
import TopBar from "../../components/mentor/TopBar";
import Footer from "../../components/mentor/Footer";
import { useParams } from "react-router-dom";
import "./MentorProfile.css";
import { FaEye } from "react-icons/fa";

function MentorProfile() {
  const { mentorId } = useParams();
 

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
 

 


  return (
    <div className="mentor-wrapper">
      <Sidebar mentorId={mentorId} />
      <div className="content">
        <TopBar
          mentorId={mentorId}
          successMessage={successMessage}
          errorMessage={errorMessage}
        />

        {/* HERO / INTRO TEXT */}
        <section className="mentor-hero">
          <h1>Empower Students Through Mentorship</h1>
          <p>Share your knowledge, guide students, and make a lasting impact on their future.</p>
        </section>
        {/* STUDENT REQUESTS (DUMMY TEMPLATE) */}
<section className="mentor-requests">
  <h2>Student Mentor Requests</h2>

  <div className="request-card">
    <h3>John Doe</h3>
    <p><strong>Email:</strong> johndoe123@gmail.com</p>
    <p><strong>Message:</strong> I would love to have your guidance in web development.</p>
    <p><strong>Date:</strong> Feb 12, 2025</p>

    <div className="actions">
      <button className="accept-btn">Accept</button>
      <button className="reject-btn">Reject</button>
    </div>
  </div>

  <div className="request-card">
    <h3>Sarah Smith</h3>
    <p><strong>Email:</strong> sarah.smith@gmail.com</p>
    <p><strong>Message:</strong> I need help improving my interview skills.</p>
    <p><strong>Date:</strong> Feb 10, 2025</p>

    <div className="actions">
      <button className="accept-btn">Accept</button>
      <button className="reject-btn">Reject</button>
    </div>
  </div>
</section>


        

        <Footer />
      </div>
    </div>
  );
}

export default MentorProfile;
