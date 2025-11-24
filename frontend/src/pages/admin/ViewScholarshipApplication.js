import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import axios from "axios";
import "./ViewScholarshipApplication.css"; 

export default function ViewScholarshipApplication() {
  const { applicationId } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);



  useEffect(() => {
    const fetchApplication = async () => {
      try {
         const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/admin/get-scholarship-application/${applicationId}`
        );
        setApplication(res.data);
       } catch (err) {
        console.error(err);
       } finally {
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
