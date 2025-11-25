import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import axios from "axios";
import "./ViewFeeConcessionApplication.css"; 

export default function ViewFeeConcessionApplication() {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [adminRemarks, setAdminRemarks] = useState("");
  const [error, setError] = useState(null);

  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "",
    headers: { "Content-Type": "application/json" },
  });

  useEffect(() => {
    const fetchFeeConcessionApplication = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/admin/get-fee-concession-application/${applicationId}`
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
    fetchFeeConcessionApplication();
  }, [applicationId]);

   const handleAction = async (action) => {
    if (!window.confirm(`Are you sure you want to ${action} this application?`)) return;

    try {
      setProcessing(true);
      const endpoint =
        action === "approve"
          ? `/api/admin/fee-concession-application/${applicationId}/approve`
          : `/api/admin/fee-concession-application/${applicationId}/reject`;

      const payload = { admin_remarks: adminRemarks || "" };
      const res = await axiosInstance.post(endpoint, payload);
      setApplication(res.data);
      window.alert(`Application ${action}d successfully.`);
      navigate("/admin/getall_fee_concession_applications");
    } catch (err) {
      console.error(err);
      window.alert(err.response?.data?.message || `Failed to ${action} application.`);
    } finally {
      setProcessing(false);
    }
  };

  const backToList = () => navigate("/admin/getall_fee_concession_applications");

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
          <h2>Scholarship Application</h2>
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
        </div>

        {/* Application Info */}
        <div className="section">
          <h3>Application Details</h3>
          <p>
            <span className="label">Family Income:</span>
            <span className="value">{application.family_income}</span>
          </p>
         
            <p>
              <span className="label">Reason:</span>
              <span className="value">{application.reason}</span>
            </p>

            <p>
              <span className="label">Concession Requested:</span>
              <span className="value">{application.concession_requested}</span>
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
          {/* renderDocLink generate link to view or downlaod */}
          
        {renderDocLink(
        "Supporting Document",
        application.supporting_doc
        )}
         
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
