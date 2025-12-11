import { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom"; 
import AdminSidebar from "../../components/AdminSidebar";
import AdminTopbar from "../../components/AdminTopbar";

import axios from "axios";
import { FaEye, FaEdit ,FaTrash} from "react-icons/fa";
import "./AdminMentorView.css"; 
import Swal from "sweetalert2";

function AdminMentorView() {
  const { mentorId } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/view-mentor/${mentorId}`);
        setStudents(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

    const renderDocLink = (label, filePath) => {
    if (!filePath) return null;
    const href = `${process.env.REACT_APP_API_URL}/uploads/${filePath}`;
    return (
      <p className="doc-link">
        {" "}
        <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: "#1e1e2f" }}>
            <FaEye style={{ cursor: "pointer", fontSize: "18px" }} />
        </a>
            </p>
        );
  };

// const handleApprove = async () => {
//     try {
//         await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/approve-mentor/${mentorId}`);
//         alert("Mentor approved successfully!");
//         navigate("/admin/mentor_list");
//     } catch (error) {
//         console.error(error);
//         alert("Approval failed!");
//     }
// };

const handleApprove = async () => {
  try {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to approve this mentor?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, approve!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/approve-mentor/${mentorId}`);
      
      Swal.fire({
        title: "Approved!",
        text: "Mentor approved successfully!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/admin/mentor_list");
      });
    }
  } catch (error) {
    console.error(error);
    Swal.fire({
      title: "Error!",
      text: "Approval failed!",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
};

  const backToList = () => navigate("/admin/mentor_list");

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

  return (
    <AdminSidebar>
         <AdminTopbar />
      <h1 style={headingStyle}>Mentor List</h1>
      {loading ? (
        <p style={loadingStyle}>Loading...</p>
      ) : (
        <>
        <section className="recommend-section view-request-section">
            <div className="request-container">
            {/* Student Details */}
            <div className="request-column">
            <h3 className="section-title">Mentor Details</h3>
            <p><strong>Name:</strong> {students.name}</p>
            <p><strong>Email:</strong> {students.email}</p>
            <p><strong>Phone:</strong> {students.phone_number}</p>
            <p><strong>Address:</strong> {students.address}</p>
            <p><strong>Gender:</strong> {students.gender}</p>
            </div>

            {/* Application Details */}
            <div className="request-column">
            <h3 className="section-title">Professional Details</h3>
            <p><strong>Current Job Title:</strong> {students.current_job_title}</p>
            <p><strong>Company / Organization:</strong> {students.company}</p>
            <p><strong>Years of Experience:</strong> {students.years_of_experience}</p>
            <p><strong>Industry:</strong> {students.industry}</p>
            <p><strong>Short Bio / About Me:</strong> {students.short_bio}</p>
            <p><strong>Short Bio / About Me:</strong> {students.short_bio}</p>
            <p><strong>Linkedin Profile:</strong> {students.linkedin_profile}</p>
            <p><strong>Subject:</strong> {students.subjects}</p>
            <p><strong>Subject:</strong> {students.skills}</p>
            <p><strong>Subject:</strong> {students.days_available}</p>
            <p><strong>Skills:</strong> {students.time_slots}</p>
            <p>
                <strong>Marksheet:</strong> {renderDocLink(":", students.resume)}
            </p><p>
                <strong>Certificates:</strong> {renderDocLink(":", students.certificates)}
            </p><p>
                <strong>Id Proof:</strong> {renderDocLink(":", students.id_proof)}
            </p>
            </div>              
        </div>

          {students.status === "inactive" && (    
            <div className="section">
              <h3>Admin Actions</h3>
              
              <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
                <button onClick={handleApprove} className="button button-approve"  >
                  { "Make Mentor Active"}
                </button>
              
                <button onClick={backToList}  className="button button-back">
                  Back to list
                </button>
              </div>
            </div> 
          )}   

        </section>
        </>
      )}
    </AdminSidebar>
  );
}

export default AdminMentorView;
