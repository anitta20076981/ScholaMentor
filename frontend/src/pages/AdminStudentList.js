import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import axios from "axios";
import { FaEye, FaEdit ,FaTrash} from "react-icons/fa";

function AdminStudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/admin/students_list"
        );
        setStudents(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(students.length / studentsPerPage);
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);

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
      <h1 style={headingStyle}>Student List</h1>
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
                  <th style={thStyle}></th>
                  <th style={thStyle}></th>
                </tr>
              </thead>
              <tbody>
                {currentStudents.length > 0 ? (
                  currentStudents.map((student, index) => (
                    <tr
                      key={indexOfFirstStudent + index}
                      style={{
                        backgroundColor:
                          index % 2 === 0 ? "#f2f2f2" : "white",
                      }}
                    >
                      <td style={tdStyle}>{indexOfFirstStudent + index + 1}</td>
                      <td style={tdStyle}>{student.name}</td>
                      <td style={tdStyle}>{student.email}</td>
                     <td style={tdStyle}>
                    <button
                        style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        color: "#1e1e2f",
                        marginRight: "10px",
                        }}
                        onClick={() => console.log("View student", student.id)}
                    >
                        <FaEye />
                    </button>
                    <button
                        style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        color: "#1e1e2f",
                        }}
                        onClick={() => console.log("Edit student", student.id)}
                    >
                        <FaEdit />
                    </button>
                    <button
                    style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        color: "red",
                    }}
                    onClick={() => console.log("Delete student", student.id)}
                    >
                    <FaTrash />
                    </button>
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

export default AdminStudentList;
