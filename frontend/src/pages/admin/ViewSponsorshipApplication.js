import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import axios from "axios";
import "./ViewSponsorshipApplication.css"; 

export default function ViewSposorshipApplication() {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [adminRemarks, setAdminRemarks] = useState("");
  const [customAmount, setCustomAmount] = useState("");

  const [error, setError] = useState(null);

  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "",
    headers: { "Content-Type": "application/json" },
  });

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/admin/get-sponsorship-request/${applicationId}`
        );
        setApplication(res.data);
        setAdminRemarks(res.data.admin_remarks || "");
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch application data.");
      } finally {
        setLoading(false);
      }
    };
    fetchApplication();
  }, [applicationId]);

   const handleAction = async (action) => {
    if (!window.confirm(`Are you sure you want to ${action} this application?`)) return;
    try {
      setProcessing(true);
      const endpoint =
        action === "approve"
          ? `/api/admin/sponsorship-application/${applicationId}/approve`
          : `/api/admin/sponsorship-application/${applicationId}/reject`;

        const payload = {
        admin_remarks: adminRemarks || "",
        };
      const res = await axiosInstance.post(endpoint, payload);
      setApplication(res.data);
      window.alert(`Application ${action}d successfully.`);
      navigate("/admin/sponsorship-request");
    } catch (err) {
      console.error(err);
      window.alert(err.response?.data?.message || `Failed to ${action} application.`);
    } finally {
      setProcessing(false);
    }
  };

  const backToList = () => navigate("/admin/sponsorship-request");

  {/* renderDocLink generate link to view or downlaod */}

    const renderDocLink = (label, filePath) => {
    if (!filePath) return null;

    const href = `${process.env.REACT_APP_API_URL}/uploads/${filePath}`;

    return (
      <p className="doc-link">
        <strong>{label}:</strong>{" "}
        <a href={href} target="_blank" rel="noopener noreferrer">
          View 
        </a>
      </p>
    );
  };

  

  if (!application)
    return (
      <AdminSidebar>
        <div style={{ padding: 24 }}>No application found.</div>
      </AdminSidebar>
    );

  return (
    <AdminSidebar>
      <div className="container">
        <div className="header">
          <h2>Sponsorship Request</h2>
          <button onClick={backToList} className="button button-back">
            ← Back
          </button>
        </div>

        {/* Student Info */}
        <div className="section">
          <h3>Student Details</h3>
          <p>
            <span className="label">Name:</span>
            <span className="value">{application.student_name || application.student?.name}</span>
          </p>
          <p>
            <span className="label">Email:</span>
            <span className="value">{application.student_email || application.student?.email}</span>
          </p>
          <p>
            <span className="label">Course / Semester:</span>
            <span className="value">
              {application.course} / {application.semester}
            </span>
          </p>
          <p>
            <span className="label">School / College:</span>
            <span className="value">
               {application.school_or_college}
            </span>
          </p>
          
        </div>

        {/* Application Info */}
        <div className="section">
          <h3>Application Details</h3>
          <p>
            <span className="label">Purpose:</span>
            <span className="value">{application.purpose}</span>
          </p>
          <p>
            <span className="label">Requested Amount:</span>
            <span className="value">{application.required_amount}</span>
          </p>
           <p>
            <span className="label">CGPA:</span>
            <span className="value">{application.cgpa}</span>
          </p>
          <p style={{ wordWrap: "break-word", whiteSpace: "pre-wrap", maxWidth: "600px" }}>
            <span className="label" style={{ fontWeight: "bold" }}>Explanation: </span>
            <span className="value">{application.background}</span>
          </p>
          <p>
            <>
              {renderDocLink(
                "Marksheet",
                application.marksheet
              )}
            </>
          </p>
          <p>
            <span className="label">Status:</span>
            <span
              className="value"
              style={{
                color:
                  application.status?.toLowerCase() === "approved"
                    ? "green"
                    : application.status?.toLowerCase() === "rejected"
                    ? "red"
                    : "orange",
              }}
            >
              {application.status}
            </span>
          </p>
        </div>
       {/* Admin Actions */}
        <div className="section">
          <h3>Admin Actions</h3>
          <textarea
            value={adminRemarks}
            onChange={(e) => setAdminRemarks(e.target.value)}
            rows={4}
          />
          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <button onClick={() => handleAction("approve")} className="button button-approve" disabled={processing}>
              {processing ? "Processing..." : "Approve"}
            </button>
            <button onClick={() => handleAction("reject")} className="button button-reject" disabled={processing}>
              {processing ? "Processing..." : "Reject"}
            </button>
            <button onClick={backToList} className="button button-back">
              Back to list
            </button>
          </div>
        </div>
       
      </div>
    </AdminSidebar>
  );
}
