import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import axios from "axios";
import "./ViewScholarshipApplication.css"; 

export default function ViewScholarshipApplication() {
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



  const backToList = () => navigate("/admin/getall_scholarship_applications");

  

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
         
        </div>

       
      </div>
    </AdminSidebar>
  );
}
