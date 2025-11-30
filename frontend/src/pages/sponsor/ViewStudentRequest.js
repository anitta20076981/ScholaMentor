import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/sponsor/Sidebar";
import TopBar from "../../components/sponsor/TopBar";
import Footer from "../../components/sponsor/Footer";
import { useParams } from "react-router-dom";
import { FaEye } from "react-icons/fa";

import "./ViewStudentRequest.css";

function ViewStudentRequest() {
  const { requestId, sponsorId } = useParams();
  const [studentRequest, setStudentRequest] = useState(null);

  useEffect(() => {
    const fetchStudentRequest = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/sponsor/get-student-request/${sponsorId}/${requestId}`
        );
        setStudentRequest(res.data);
      } catch (err) {
        console.error("Failed to fetch student request:", err);
      }
    };
    fetchStudentRequest();
  }, [requestId, sponsorId]);

  const renderDocLink = (label, filePath) => {
    if (!filePath) return null;

    const href = `${process.env.REACT_APP_API_URL}/uploads/${filePath}`;

    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="doc-icon">
        <FaEye />
      </a>
    );
  };

  return (
    <div className="sponsor-wrapper">
      <Sidebar sponsorId={sponsorId} />

      <div className="content">
        <TopBar />

        <section className="recommend-section view-request-section">
          <h3>Student Request</h3>

          {!studentRequest && <p>Loading...</p>}

          {studentRequest && (
            <div className="request-container">
              {/* Student Details */}
              <div className="request-column">
                <h3 className="section-title">Student Details</h3>
                <p><strong>Name:</strong> {studentRequest.student_name}</p>
                <p><strong>Email:</strong> {studentRequest.student_email}</p>
                <p><strong>Phone:</strong> {studentRequest.phone}</p>
              </div>

              {/* Application Details */}
              <div className="request-column">
                <h3 className="section-title">Application Details</h3>
                <p><strong>Course:</strong> {studentRequest.course}</p>
                <p><strong>Score:</strong> {studentRequest.cgpa}</p>
                <p><strong>Purpose:</strong> {studentRequest.purpose}</p>
                <p><strong>Need:</strong> {studentRequest.background}</p>
                <p><strong>Request Date:</strong> {new Date(studentRequest.created_at).toLocaleDateString("en-GB")}</p>
                <p>
                  <strong>Marksheet:</strong> {renderDocLink("Marksheet", studentRequest.marksheet)}
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
