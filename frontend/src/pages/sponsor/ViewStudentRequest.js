import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/sponsor/Sidebar";
import TopBar from "../../components/sponsor/TopBar";
import Footer from "../../components/sponsor/Footer";
import { useParams } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import Swal from "sweetalert2";

import "./ViewStudentRequest.css";

function ViewStudentRequest() {
  const { requestId, sponsorId } = useParams();
  const [studentRequest, setStudentRequest] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");
  const [requiredDoc, setRequiredDoc] = useState("");
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [infoRequest, setInfoRequest] = useState(null);


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

    const fetchInfoRequest = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/sponsor/get-info-request/${sponsorId}/${requestId}`
        );
        setInfoRequest(res.data);
      } catch (err) {
        console.error("Failed to fetch student request:", err);
      }
    };

    

    fetchStudentRequest();
    fetchInfoRequest();

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

  const sendInfoRequest = async () => {
  try {
    await axios.post(
      `${process.env.REACT_APP_API_URL}/api/sponsor/request-more-info/${sponsorId}/${requestId}`,
      {
        message: infoMessage,
        required_document: requiredDoc
      }
    );
    Swal.fire({
      title: "Success!",
      text: "Request sent successfully!",
      icon: "success",
      confirmButtonText: "OK"
     }).then(() => {
      setRequestSubmitted(true); // hide the button after clicking OK
    });
    setShowInfoModal(false);
    setInfoMessage("");
    setRequiredDoc("");
    setRequestSubmitted(true);

  } catch (err) {
    console.error(err);
    Swal.fire({
          title: "Failed!",
          text: "Failed to send request.",
          icon: "error",
          confirmButtonText: "OK"
        }).then(() => {
          window.location.reload();
    });
  }
};


  return (
    <div className="sponsor-wrapper">
      <Sidebar sponsorId={sponsorId} />

      <div className="content">
        <TopBar  sponsorId={sponsorId} />

        <section className="recommend-section view-request-section">
          <h3>Student Request</h3>
     
 
      {infoRequest == 0 && (
  <button className="info-btn" onClick={() => setShowInfoModal(true)}>
    Request More Info
  </button>
)}
   

    {showInfoModal && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h4>Request More Information</h4>
          <textarea
            placeholder="Message to student"
            value={infoMessage}
            onChange={(e) => setInfoMessage(e.target.value)}
          />
          <select
            value={requiredDoc}
            onChange={(e) => setRequiredDoc(e.target.value)}
          >
            <option value="">No specific document</option>
            <option value="marksheet">Marksheet</option>
            <option value="income_certificate">Income Certificate</option>
          </select>
          <div className="modal-actions">
            <button onClick={sendInfoRequest}>Send Request</button>
            <button onClick={() => setShowInfoModal(false)}>Cancel</button>
          </div>
        </div>
      </div>
    )}
  
 

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
