import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import axios from "axios";
import "./ViewScholarshipApplication.css"; 
import { FaEye} from "react-icons/fa";
import Swal from "sweetalert2";

export default function ViewScholarshipApplication() {
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
          `${process.env.REACT_APP_API_URL}/api/admin/get-scholarship-application/${applicationId}`
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
    // if (!window.confirm(`Are you sure you want to ${action} this application?`)) return;
    const result = await Swal.fire({
    title: "Are you sure?",
    text: `Do you really want to ${action} this application?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, continue",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;
    if (
        action === "approve" &&
        application.scholarship_type === "Special Scheme" &&
        (!customAmount || Number(customAmount) <= 0)
      ) {
        window.alert("Please enter a valid amount for Special Scheme scholarship.");
        return; 
      }
      console.log(customAmount);
    try {
      setProcessing(true);
      const endpoint =
        action === "approve"
          ? `/api/admin/scholarship-application/${applicationId}/approve`
          : `/api/admin/scholarship-application/${applicationId}/reject`;

        const payload = {
        admin_remarks: adminRemarks || "",
        custom_amount:
          application.scholarship_type === "Special Scheme"
            ? Number(customAmount)
            : null,  
        };
      const res = await axiosInstance.post(endpoint, payload);
      setApplication(res.data);
      // window.alert(`Application ${action}d successfully.`);
      // navigate("/admin/getall_scholarship_applications");
      await Swal.fire({
        title: "Success!",
        text: `Application ${action}d successfully.`,
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/admin/getall_scholarship_applications");
      });
    } catch (err) {
      console.error(err);
      window.alert(err.response?.data?.message || `Failed to ${action} application.`);
    } finally {
      setProcessing(false);
    }
  };

  const backToList = () => navigate("/admin/getall_scholarship_applications");

  {/* renderDocLink generate link to view or downlaod */}

    const renderDocLink = (label, filePath) => {
    if (!filePath) return null;

    const href = `${process.env.REACT_APP_API_URL}/uploads/${filePath}`;

    return (
      <p className="doc-link1"  style={{
          marginBottom: "10px",
          fontSize: "14px",
          color: "#555"
        }}>
        <strong>{label}:</strong>{" "}
        <a href={href} target="_blank" rel="noopener noreferrer">
          <FaEye /> 
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
          <p>
            <span className="label">Tution Fee:</span>
            <span className="value">
               {application.tuition_fee}
            </span>
          </p>
          <p>
            <span className="label">Payable Fee:</span>
            <span className="value">
               {application.fee_balance}
            </span>
          </p>
        </div>

        {/* Application Info */}
        <div className="section">
          <h3>Application Details</h3>
          <p>
            <span className="label">Applied For:</span>
            <span className="value">{application.scholarship_type}</span>
          </p>
         {application.scholarship_type === "Merit" && (
          <>
            <p>
              <span className="label">Academic Percentage:</span>
              <span className="value">{application.academic_percentage}</span>
            </p>

            <p>
              <span className="label">Attendance Percentage:</span>
              <span className="value">{application.attendance_percentage}</span>
            </p>
          </>
        )}
        {application.scholarship_type === "Need-based" && (
          <>
            <p>
              <span className="label">Family Income:</span>
              <span className="value">{application.family_income}</span>
            </p>

            <p>
              <span className="label">Father Occupation:</span>
              <span className="value">{application.father_occupation}</span>
            </p>
            <p>
              <span className="label">Mother Occupation:</span>
              <span className="value">{application.mother_occupation}</span>
            </p>
            <p>
              <span className="label">Dependents:</span>
              <span className="value">{application.dependents}</span>
            </p>
          </>
        )}
       
        {application.scholarship_type === "Sports" && (
          <>
            <p>
              <span className="label">Sport Name:</span>
              <span className="value">{application.sport_name}</span>
            </p> 

            <p>
              <span className="label">Level:</span>
              <span className="value">{application.level}</span>
            </p>
            <p>
              <span className="label">Team or Individual:</span>
              <span className="value">{application.team_or_individual}</span>
            </p>
            <p>
              <span className="label">Coach Name:</span>
              <span className="value">{application.coach_name}</span>
            </p>
             <p>
              <span className="label">Coach Contact:</span>
              <span className="value">{application.coach_contact}</span>
            </p>
          </>
        )}
         {application.scholarship_type === "Special Scheme" && (
          <>
            <p>
              <span className="label">Category Type:</span>
              <span className="value">{application.category_type}</span>
            </p> 

            <p>
              <span className="label">Scheme Reason:</span>
              <span className="value">{application.scheme_reason}</span>
            </p>
          </>
        )}
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
          {application.scholarship_type === "Merit" && (
            <>
              {renderDocLink(
                "Marksheet",
                application.marksheet_file
              )}
            </>
          )}
           {application.scholarship_type === "Need-based" && (
            <>
              {renderDocLink(
                "Income Certificate",
                application.income_certificate
              )}
            </>
          )}
          {application.scholarship_type === "Sports" && (
            <>
              {renderDocLink(
                "Sports Certificate",
                application.sports_certificate
              )}
            </>
          )}
          {application.scholarship_type === "Special Scheme" && (
            <>
              {renderDocLink(
                "Category Certificate",
                application.category_certificate
              )}
               {renderDocLink(
                "Disability Certificate",
                application.disability_certificate
              )}
               {renderDocLink(
                "Income Certificate",
                application.income_certificate
              )}
            </>
          )}
         
        </div>
        {application.scholarship_type === "Special Scheme" && (
          <div className="section" style={{ marginBottom: 12 }}>
            <label className="label">Enter Special Scheme Amount:</label>
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="Enter amount to reduce"
              className="special-input"
              style={{
                width: "200px",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                marginTop: "6px"
              }}
            />
          </div>
        )}

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
