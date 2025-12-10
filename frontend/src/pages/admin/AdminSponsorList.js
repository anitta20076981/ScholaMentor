import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import AdminSidebar from "../../components/AdminSidebar";
import axios from "axios";
import { FaEye, FaEdit ,FaTrash} from "react-icons/fa";

function AdminSponsorList() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const sponsorsPerPage = 10;

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/sponsor_list`);

        setSponsors(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchSponsors();
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(sponsors.length / sponsorsPerPage);
  const indexOfLastStudent = currentPage * sponsorsPerPage;
  const indexOfFirstMentor = indexOfLastStudent - sponsorsPerPage;
  const currentSponsor = sponsors.slice(indexOfFirstMentor, indexOfLastStudent);

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
      <h1 style={headingStyle}>Sponsor List</h1>
      {loading ? (
        <p style={loadingStyle}>Loading...</p>
      ) : (
        <>
          <div style={tableContainerStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>S.No</th>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}></th>
                  <th style={thStyle}></th>
                </tr>
              </thead>
              <tbody>
                {currentSponsor.length > 0 ? (
                  currentSponsor.map((sponsor, index) => (
                    <tr
                      key={indexOfFirstMentor + index}
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "#f2f2f2" : "white",
                      }}
                    >
                      <td style={tdStyle}>{indexOfFirstMentor + index + 1}</td>
                      <td style={tdStyle}>{sponsor.name}</td>
                      <td style={tdStyle}>{sponsor.email}</td>
                      <td style={tdStyle}>{sponsor.status}</td>
                     <td style={tdStyle}>
                    <button
                        style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        color: "#1e1e2f",
                        marginRight: "10px",
                        }}
                        onClick={() => navigate(`/admin/view-sponsor/${sponsor.id}`)}
                    >
                        <FaEye />
                    </button>
                    
                    {/* <button
                    style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        color: "red",
                    }}
                    onClick={() => console.log("Delete student", sponsor.id)}
                    >
                    <FaTrash />
                    </button> */}
                   </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td style={tdStyle} colSpan="5">
                      No sponsors found.
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

export default AdminSponsorList;
