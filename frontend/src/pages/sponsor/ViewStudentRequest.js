import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/sponsor/Sidebar";
import TopBar from "../../components/sponsor/TopBar";
import Footer from "../../components/sponsor/Footer";

import "./SponsorStudentRequest.css";
import { useParams } from "react-router-dom";
import { FaEye } from "react-icons/fa";

function ViewStudentRequest() {
  const { requestId, sponsorId } = useParams();  
  const [studentRequest, setStudentRequest] = useState(null);  

  useEffect(() => {
    const fetchStudentRequest = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/sponsor/get-student-request/${sponsorId}/${requestId}`
        );
        console.log(res.data);
        setStudentRequest(res.data); // set the student object
      } catch (err) {
        console.error("Failed to fetch student request:", err);
      }
    };
    fetchStudentRequest();
  }, [requestId]);

  const renderDocLink = (label, filePath) => {
    if (!filePath) return null;

    const href = `${process.env.REACT_APP_API_URL}/uploads/${filePath}`;

    return (
      <p className="doc-link">
        <strong>{label}:</strong>{" "}
        <a href={href} target="_blank" rel="noopener noreferrer">
            <FaEye />
        </a>
      </p>
    );
  };

  return (
    <div className="sponsor-wrapper">
      <Sidebar sponsorId={sponsorId} />

      <div className="content">
        <TopBar />

        <section id="recommended-students" className="recommend-section">
          <h2>Student Request</h2>

          {!studentRequest && <p>Loading...</p>}

          {studentRequest && (
            <div className="student-card">
              <div className="student-image">Student Details</div>
              <div className="card-info">
                <h3>{studentRequest.student_name}</h3>
                <p>
                  <strong>Email:</strong> {studentRequest.student_email}
                </p>
                 <p>
                  <strong>Phone:</strong> {studentRequest.phone}
                </p>
               
              </div>
              <div className="student-image">Application Details</div>
              <div className="card-info">
                <h3>{studentRequest.student_name} </h3>
                
                <p>
                  <strong>Course:</strong> {studentRequest.course}
                </p>
                <p>
                  <strong>Score:</strong> {studentRequest.cgpa}
                </p>
                <p>
                  <strong>Purpose:</strong> {studentRequest.purpose}
                </p>
                <p>
                  <strong>Need:</strong> {studentRequest.background}
                </p>
                 <p>
                    <strong>Request Date:</strong> {new Date(studentRequest.created_at).toLocaleDateString("en-GB")}
                </p>
                <p>
            <>
              {renderDocLink(
                "Marksheet",
                studentRequest.marksheet
              )}
            </>
          </p>
              </div>
            </div>
          )}
        </section>

        <Footer />
      </div>
    </div>
  );
}

export default ViewStudentRequest;
