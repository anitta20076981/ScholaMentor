import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/sponsor/Sidebar";
import TopBar from "../../components/sponsor/TopBar";
import Footer from "../../components/sponsor/Footer";

import "./SponsorStudentRequest.css";
import { useParams } from "react-router-dom"; // use parameter from url
import { useNavigate } from "react-router-dom";

function SponsorStudentRequest() {
  const { sponsorId } = useParams(); // get sponsorId from URL
  const [recommendedStudents, setRecommendedStudents] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/sponsor/get-all-student-requests`
        );
        setRecommendedStudents(res.data); // assuming the API returns an array of students
      } catch (err) {
        console.error("Failed to fetch recommended students:", err);
      }
    };
    fetchRecommended();
  }, []);

  return (
    <div className="sponsor-wrapper">
      <Sidebar sponsorId={sponsorId} />

      <div className="content">
     
    <TopBar sponsorId={sponsorId}   />

        {/* RECOMMENDED STUDENTS */}
        <section id="recommended-students" className="recommend-section">
          <h2>Student Request</h2>
          <div className="card-grid">
            {recommendedStudents.map((student, i) => (
              <div className="student-card" key={i}>
                <div className="student-image"></div>
                <div className="card-info">
                  <h3>{student.student_name}</h3>
                  <p>
                    <strong>Email:</strong> {student.student_email}
                  </p>
                  <p>
                    <strong>Course:</strong> {student.course}
                  </p>
                  
                </div>
                <button className="sponsor-btn" onClick={() => navigate(`/sponsor/get-student-request/${sponsorId}/${student.id}`)}
                >View Details</button>
                {student?.status === "ApprovedBySponsor" &&
                  student?.approval_type === "Full" && (
                    <button className="sponsorship-approve-btn">
                      Full Sponsorship ({student.approved_amount})
                    </button>
                )}
                {student?.status === "ApprovedBySponsor" &&
                  student?.approval_type === "Partial" && (
                    <button className="sponsorship-approve-btn">
                      Partial Sponsorship ({student.approved_amount})
                    </button>
                )}
                 
              </div>
            ))}
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}

export default SponsorStudentRequest;
