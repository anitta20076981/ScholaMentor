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
  const [infoRequest, setInfoRequest] = useState(null);
  const [submittedDocs, setSubmittedDocs] = useState([]);
  const [showApproveModal, setShowApproveModal] = useState(false);

  const [approvalType, setApprovalType] = useState('Full'); // default selection
  const [approvedAmount, setApprovedAmount] = useState('');
  const [error, setError] = useState('');
  const [sponsorRemarks, setSponsorRemarks] = useState("");

  useEffect(() => {
    const fetchStudentRequest = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/sponsor/get-student-request/${sponsorId}/${requestId}`
        );
        console.log(res.data);
        setStudentRequest(res.data);
        if (res.data) {
        setApprovedAmount(res.data.required_amount);
      }
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

    const fetchSubmittedDocuments = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/sponsor/get-submitted-docs/${sponsorId}/${requestId}`
        );
        setSubmittedDocs(res.data);
      } catch (err) {
        console.error("Failed to fetch student request:", err);
      }
    };

    
    fetchSubmittedDocuments();
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
            window.location.reload();
      }); 
      setShowInfoModal(false);
      setInfoMessage("");
      setRequiredDoc("");
  
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

  const sendApproveRequest = async () => {
  try {
    // Validate partial approval amount
    if (approvalType === 'Partial') {
      if (!approvedAmount || approvedAmount < 1 || approvedAmount > studentRequest?.required_amount) {
        Swal.fire({
          title: "Invalid Amount",
          text: `Please enter a valid amount (1 - ${studentRequest?.required_amount})`,
          icon: "warning",
          confirmButtonText: "OK"
        });
        return;
      }
    }

    // Send approval request to backend
    await axios.post(
      `${process.env.REACT_APP_API_URL}/api/sponsor/approve-sponsorship/${sponsorId}/${requestId}`,
      {
        approval_type: approvalType,           
        approved_amount: approvedAmount,       
        remarks_from_sponsor: sponsorRemarks || ''         
      }
    );

    // Success alert
    await Swal.fire({
      title: "Success!",
      text: "Sponsorship Approved successfully!",
      icon: "success",
      confirmButtonText: "OK"
    }).then(() => {
      window.location.reload();
    });

    // Reset modal and form state
    setShowApproveModal(false);
    setSponsorRemarks("");
    setRequiredDoc("");
    setApprovedAmount('');
    setApprovalType('Full');
    setError('');


  } catch (err) {
    console.error('Error sending approval:', err);
    await Swal.fire({
      title: "Failed!",
      text: "Failed to send request.",
      icon: "error",
      confirmButtonText: "OK"
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

          <div className="info-btn-row">
             
          {studentRequest?.status !== 'ApprovedBySponsor' && (
            <div className="info-btn-wrapper">
              <button className="info-btn" onClick={() => setShowApproveModal(true)}>
                Approve
              </button>
            </div>
          )}

            {infoRequest === 0 &&  studentRequest?.status !== 'ApprovedBySponsor' &&(
              <div className="info-btn-wrapper">
                <button className="info-btn" onClick={() => setShowInfoModal(true)}>
                  Request More Info
                </button>
              </div>
            )}
          </div>
           
           {/*Approve modal*/}
          {showApproveModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h4>Request More Information / Approval</h4>

                <select
                  value={approvalType}
                  onChange={(e) => {
                    setApprovalType(e.target.value);
                    if (e.target.value === 'Full') {
                      setApprovedAmount(studentRequest?.required_amount || 0);
                      setError('');
                    } else {
                      setApprovedAmount('');
                      setError('');
                    }
                  }}
                >
                  <option value="Full">Full Approval</option>
                  <option value="Partial">Partial Approval</option>
                </select>

                <textarea
                  placeholder="Message to student"
                  value={sponsorRemarks}
                  onChange={(e) => setSponsorRemarks(e.target.value)}
                />

                {approvalType === 'Full' && (
                  <div>
                    <label>Approved Amount:</label>
                    <input
                      type="number"
                      value={approvedAmount}
                      readOnly
                    />
                  </div>
                )}

                {approvalType === 'Partial' && (
                  <div>
                    <label>Enter Approved Amount:</label>
                    <input
                      type="number"
                      value={approvedAmount}
                      min="1" required
                      onChange={(e) => {
                        const value = Number(e.target.value);

                        if (value < 1) {
                          setError('Amount must be at least 1');
                        } else if (value > studentRequest?.required_amount) {
                          setError(`Amount cannot exceed ${studentRequest.required_amount}`);
                        } else {
                          setError('');
                          setApprovedAmount(value);
                        }
                      }}
                      placeholder="Enter amount"
                    />

                     

                    {error && <p style={{ color: 'red' }}>{error}</p>}
                  </div>
                )}

                <div className="modal-actions">
                  <button
                    onClick={sendApproveRequest}
                    disabled={approvalType === 'Partial' && (approvedAmount === '' || error)}
                  >
                    Send Request
                  </button>
                  <button onClick={() => setShowApproveModal(false)}>Cancel</button>
                </div>
              </div>
            </div>
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
       
          {studentRequest && (
            <div className="request-container">
              {submittedDocs.length > 0 && (
                <div className="request-column">
                  <h3 className="section-title">Submitted Details</h3>

                  {submittedDocs.map((doc) => (
                    <div key={doc.id} className="doc-row">
                      <strong>{doc.message}:</strong>
                      <span className="doc-eye">
                        {renderDocLink("Marksheet", doc.response_document)}
                      </span>
                    </div>
                  ))}
                </div>
              )} 

              {/* Approved Status */}
              {studentRequest.status === 'ApprovedBySponsor' && (
                <div className="request-column">
                  <h3 className="section-title">Approved Details</h3>
                  <p><strong>Approved Dated:</strong> {studentRequest.approved_date ? studentRequest.approved_date.split("T")[0] : "—"}</p>
                  <p><strong>Request Date:</strong> {new Date(studentRequest.created_at).toLocaleDateString("en-GB")}</p>
                </div>
              )} 

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
