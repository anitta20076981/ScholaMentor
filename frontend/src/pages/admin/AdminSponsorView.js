import { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom"; 
import AdminSidebar from "../../components/AdminSidebar";
import AdminTopbar from "../../components/AdminTopbar";

import axios from "axios";
import { FaEye, FaEdit ,FaTrash} from "react-icons/fa";
import "./AdminSponsorView.css"; 
import Swal from "sweetalert2";

function AdminSponsorView() {
  const { sponsorId } = useParams();
  const [students, setSponsor] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;
  const [processing, setProcessing] = useState(false);
  const [application, setApplication] = useState(null);

   const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "",
    headers: { "Content-Type": "application/json" },
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/view-sponsor/${sponsorId}`);
        setSponsor(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchStudents();
  }, [sponsorId]);

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
//         await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/approve-mentor/${sponsorId}`);
//         alert("Mentor approved successfully!");
//         navigate("/admin/mentor_list");
//     } catch (error) {
//         console.error(error);
//         alert("Approval failed!");
//     }
// };

const handleAction = async (action) => {
    // if (!window.confirm(`Are you sure you want to ${action} this application?`)) return;
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you really want to active this sponsor?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, continue",
      cancelButtonText: "Cancel",
    });

    try {
      setProcessing(true);
      const endpoint =
        action === "approve"
          ? `/api/admin/approve-sponsor/${sponsorId}/approve`
          : '';

      const res = await axiosInstance.post(endpoint);
      setApplication(res.data);
      await Swal.fire({
        title: "Success!",
        text: `Sponsor actived successfully.`,
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/admin/sponsor_list");
      });
    } catch (err) {
      console.error(err);
      window.alert(err.response?.data?.message || `Failed to ${action} application.`);
    } finally {
      setProcessing(false);
    }
  };
  const backToList = () => navigate("/admin/sponsor_list");


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
      <h1 style={headingStyle}>Sponsor List</h1>
      {loading ? (
        <p style={loadingStyle}>Loading...</p>
      ) : (
        <>
        <section className="recommend-section view-request-section">
           
            <div className="request-container">
            {/* Student Details */}
            <div className="request-column">
            <h3 className="section-title">Sponsor Details</h3>
            <p><strong>Name:</strong> {students.name}</p>
            <p><strong>Email:</strong> {students.email}</p>
            <p><strong>Phone:</strong> {students.phone}</p>
            <p><strong>Address:</strong> {students.address}</p>
            <p><strong>Gender:</strong> {students.gender}</p>
            </div>

            {/* Application Details */}
            <div className="request-column">
            <h3 className="section-title">Professional Details</h3>
            <p><strong>Occupation:</strong> {students.occupation}</p>
            <p><strong>Reason for Sponsorship:</strong> {students.reason_for_sponsorship}</p>
            <p>
                <strong>Income Certificate:</strong> {renderDocLink(":", students.income_certificate)}
            </p><p>
                <strong>Gov Id:</strong> {renderDocLink(":", students.gov_id)}
            </p><p>
                <strong>Bank Statement:</strong> {renderDocLink(":", students.bank_statement)}
            </p>
            </div>  

                       
        </div>
       {students.status === "inactive" && (
        <div className="section">
          <h3>Admin Actions</h3>
           
          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <button onClick={() => handleAction("approve")} className="button button-approve" disabled={processing}>
              {processing ? "Processing..." : "Make Sponsor Active"}
            </button>
           
            <button onClick={backToList} className="button button-back">
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

export default AdminSponsorView;
