import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import AdminSidebar from "../../components/AdminSidebar";
import axios from "axios";
import { FaEye, FaEdit ,FaTrash} from "react-icons/fa";
import Swal from "sweetalert2";
import AdminTopbar from "../../components/AdminTopbar";

function AdminMentorList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/mentor_list`);

        setStudents(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

const handleDelete = async (mentorId) => {
  try {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this mentor?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/admin/delete-mentor/${mentorId}`);
      
      // Show success alert
      Swal.fire({
        title: "Deleted!",
        text: "Mentor has been deleted successfully.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        window.location.reload();
      });
    }
  } catch (error) {
    console.error(error);
    Swal.fire({
      title: "Error!",
      text: "Failed to delete mentor.",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
};


  // Calculate pagination
  const totalPages = Math.ceil(students.length / studentsPerPage);
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstMentor = indexOfLastStudent - studentsPerPage;
  const currentMentor = students.slice(indexOfFirstMentor, indexOfLastStudent);

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
      <AdminTopbar />
      <h1 style={headingStyle}>Mentor List</h1>
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
                {currentMentor.length > 0 ? (
                  currentMentor.map((mentor, index) => (
                    <tr
                      key={indexOfFirstMentor + index}
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "#f2f2f2" : "white",
                      }}
                    >
                      <td style={tdStyle}>{indexOfFirstMentor + index + 1}</td>
                      <td style={tdStyle}>{mentor.name}</td>
                      <td style={tdStyle}>{mentor.email}</td>
                      <td style={tdStyle}>{mentor.status}</td>
                     <td style={tdStyle}>
                    <button
                        style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        color: "#1e1e2f",
                        marginRight: "10px",
                        }}
                        onClick={() => navigate(`/admin/view-mentor/${mentor.id}`)}
                    >
                        <FaEye />
                    </button>
                   {mentor.status === "inactive" && (     
                    <button
                    style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        color: "red",
                    }}
                     onClick={() => handleDelete(mentor.id)}
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
                      No students found.
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

export default AdminMentorList;
