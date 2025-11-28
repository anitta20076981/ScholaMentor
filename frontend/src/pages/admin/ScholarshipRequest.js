import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import axios from "axios";
import { FaEye, FaEdit ,FaTrash} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ScholarshipRequest() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");

  const navigate = useNavigate();


  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const applicationPerPage = 10;

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/get-all-sponsorship-request`);
        setApplications(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchApplication();
  }, []);

  // Calculate pagination

  const filteredApplications =
    statusFilter === "All"
      ? applications
      : applications.filter(app => app.status === statusFilter);

  const totalPages = Math.ceil(filteredApplications.length / applicationPerPage);
  const indexOfLastApplication = currentPage * applicationPerPage;
  const indexOfFirstApplication = indexOfLastApplication - applicationPerPage;
  const currentScholarshipApplication = filteredApplications.slice(indexOfFirstApplication, indexOfLastApplication);


  // Pagination handler
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
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
      <h1 style={headingStyle}>List of Sponsorship Request</h1>
      {loading ? (
        <p style={loadingStyle}>Loading...</p>
      ) : (
        <>
      <div style={{
        display: "flex",
        justifyContent: "flex-end",   
        alignItems: "center",
        marginBottom: "15px",
        gap: "10px"                  
      }}>
        <label style={{ fontWeight: 600, fontSize: "14px" }}>
          Filter by Status:
        </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: "6px 12px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "14px",
            cursor: "pointer",
            backgroundColor: "#fff",
          }}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>


          <div style={tableContainerStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>S.No</th>
                  <th style={thStyle}>Student Name</th>
                  <th style={thStyle}>Purspose</th>
                  <th style={thStyle}>Requested Amount</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}></th>
                  <th style={thStyle}></th>
                </tr>
              </thead>
              <tbody>
                {currentScholarshipApplication.length > 0 ? (
                  currentScholarshipApplication.map((application, index) => (
                    <tr
                      key={indexOfFirstApplication + index}
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "#f2f2f2" : "white",
                      }}
                    >
                    <td style={tdStyle}>{indexOfFirstApplication + index + 1}</td>
                    <td style={tdStyle}>{application.student_name}</td>
                    <td style={tdStyle}>{application.purpose}</td>
                    <td style={tdStyle}>{application.required_amount}</td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          padding: "2px 6px",        
                          fontSize: "12px",         
                          borderRadius: "4px",       
                          fontWeight: 600,
                          display: "inline-block",
                          border: "1px solid",       
                          borderColor:
                            application.status === "Approved"
                              ? "#2e7d32" 
                              : application.status === "Rejected"
                              ? "#c62828" 
                              : "#ed6c02", 
                          color:
                            application.status === "Approved"
                              ? "#2e7d32"
                              : application.status === "Rejected"
                              ? "#c62828"
                              : "#ed6c02",
                          width: "fit-content",      // prevents long border
                        }}
                      >
                        {application.status}
                      </span>
                    </td>


                     <td style={tdStyle}>
                    <button
                        style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        color: "#1e1e2f",
                        marginRight: "10px",
                        }}
                        onClick={() => navigate(`/admin/view-sponsorship-application/${application.id}`)}

                    >
                        <FaEye />
                    </button>
                    {/* <button
                        style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        color: "#1e1e2f",
                        }}
                        onClick={() => console.log("Edit student", application.id)}
                    >
                        <FaEdit />
                    </button> */}
                   {application.status === "Pending" && (
                    <button
                      style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        color: "red",
                      }}
                      onClick={async () => {
                        if (!window.confirm("Are you sure you want to delete this application?")) return;
                        try {
                          const res = await axios.post(
                            `${process.env.REACT_APP_API_URL}/api/admin/delete-scholarship-application/${application.id}`
                          );
                          window.alert("Application deleted successfully.");
                          setApplications((prev) =>
                            prev.filter((app) => app.id !== application.id)
                          );
                        } catch (err) {
                          console.error(err);
                          window.alert("Failed to delete application.");
                        }
                      }}
                    >
                      <FaTrash />
                    </button>
                  )}

                  </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td style={tdStyle} colSpan="5">
                      No applications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={paginationStyle}>
            <button
              style={pageButtonStyle}
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                style={currentPage === i + 1 ? activePageButtonStyle : pageButtonStyle}
                onClick={() => goToPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              style={pageButtonStyle}
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </AdminSidebar>
  );
}

export default ScholarshipRequest;
