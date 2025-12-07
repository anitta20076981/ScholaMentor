import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/mentor/Sidebar";
import TopBar from "../../components/mentor/TopBar";
import Footer from "../../components/mentor/Footer";
import { useParams } from "react-router-dom";
import "./MentorStudentRequest.css";

function MentorProfile() {
  const { mentorId } = useParams();
 

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [studentRequest, setStudentRequest] = useState("");

 
  useEffect(() => {
    const fetchMentorRequest = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/mentor/get-all-student-mentor-requests/${mentorId}`
        );

        setStudentRequest(res.data); 
      } catch (err) {
        console.error("Failed to fetch recommended students:", err);
      }
    };
    fetchMentorRequest();
  }, []);
 


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

        {studentRequest.length === 0 ? (
    <p>No requests found.</p>
  ) : (
    studentRequest.map((request) => (
      <div key={request.student_id + '-' + request.subject_id} className="request-card">
        <h3>{request.student_name}</h3>
        <p><strong>Email:</strong> {request.student_email || 'Not available'}</p>
        <p><strong>Subjects:</strong> {request.subjects}</p>
        <p><strong>Status:</strong> {request.status}</p>
        <p><strong>Date:</strong> {new Date(request.request_date).toLocaleDateString()}</p>

        <div className="actions">
          <button className="accept-btn">Accept</button>
          <button className="reject-btn">Reject</button>
        </div>
      </div>
    ))
  )}
</section>


        <Footer />
      </div>
    </div>
  );
}

export default MentorProfile;
