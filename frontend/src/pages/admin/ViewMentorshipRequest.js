import { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom"; 
import AdminSidebar from "../../components/AdminSidebar";
import AdminTopbar from "../../components/AdminTopbar";

import axios from "axios";
import { FaEye, FaEdit ,FaTrash} from "react-icons/fa";
import "./AdminMentorView.css"; 
import Swal from "sweetalert2";

function ViewMentorshipRequest() {
  const { mentorId,studentId } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;
  const [requestData, setRequestData] = useState([]);


  useEffect(() => {
    const fetchMentorshipRequest = async () => {
      try {
        
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/view-mentorship-request/${studentId}/${mentorId}`);
        setRequestData(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchMentorshipRequest();
  }, []);



 const handleApprove = async () => {
    try {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/approve-mentorship-request/${mentorId}/${studentId}`);
        Swal.fire({
            title: "Success!",
            text: "Mentorship request approved successfully!",
            icon: "success",
            confirmButtonText: "OK"
        }).then(() => {
            navigate("/admin/mentorship_request");
        });
    } catch (error) {
        console.error(error);
        Swal.fire({
            title: "Error!",
            text: "Approval failed! Please try again.",
            icon: "error",
            confirmButtonText: "OK"
        });
    }
};

  // Inline styles
  
  const tableContainerStyle = {
    width: "100%",
    overflowX: "auto",
    marginTop: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    fontFamily: "Arial, sans-serif",
  };

  const thStyle = {
    padding: "12px 15px",
    textAlign: "left",
    backgroundColor: "#1e1e2f",
    color: "white",
  };

  const tdStyle = {
    padding: "12px 15px",
    textAlign: "left",
  };

  const headingStyle = {
  fontFamily: "Arial, sans-serif",
  marginBottom: "10px",
  color: "#333",
  marginLeft: "20px"   // adjust value as needed
 };

  const loadingStyle = {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#555",
  };

  const paginationStyle = {
    marginTop: "15px",
    display: "flex",
    justifyContent: "center",
    gap: "8px",
  };

  const pageButtonStyle = {
    padding: "6px 12px",
    border: "1px solid #1e1e2f",
    borderRadius: "4px",
    backgroundColor: "#fff",
    cursor: "pointer",
  };

  const activePageButtonStyle = {
    ...pageButtonStyle,
    backgroundColor: "#1e1e2f",
    color: "#fff",
  };
const main = requestData[0];
  return (
    <AdminSidebar>
      <AdminTopbar />
      <h1 className="page-title">View Mentorship Request</h1>

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : (
        <>
          {main && (
            <section className="recommend-section view-request-section">
              <div className="action-buttons" style={{ textAlign: "right" }}>
                {main.status === "pending" && (
                  <button className="approve-btn" onClick={handleApprove}  style={{
                      marginLeft: "auto",
                      marginTop: "-54px",
                      backgroundColor: "#ff832b",
                      color: "white",
                      padding: "8px 16px",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "14px",
                      display: "block",
                    }}>
                    Approve
                  </button>
                )}
              </div>

              <div className="request-container">
                {/* Student Details */}
                <div className="request-column">
                  <h3 className="section-title">Student Name</h3>
                  <p><strong>Name:</strong> {main.student_name}</p>
                  <p><strong>Requested Mentor:</strong> {main.mentor_name}</p>
                    <h3 className="section-title">Requested Subjects</h3>
                  <ul>
                    {requestData.map((item, index) => (
                      <li key={index}>{item.subject_name}</li>
                    ))}
                  </ul>                
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </AdminSidebar>
  );
}
export default ViewMentorshipRequest;