import { useState, useEffect } from "react";
import axios from "axios";
import TopBar from "../../components/student/TopBar";  
import Footer from "../../components/student/Footer";
import { useParams } from "react-router-dom"; 
import { FaDownload } from "react-icons/fa";


function TrackApplicationStatus() {
  // const navigate = useNavigate();
  const { studentId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDownloadCertificate = async (applicationId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/student/${studentId}/download-certificate/${applicationId}`,
        { responseType: "blob" } // Important to handle binary files
      );

      // Create a URL for the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Scholarship_Certificate_${applicationId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading certificate:", error);
      alert("Failed to download certificate. Please try again later.");
    }
  };

  // Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/student/${studentId}/track-status`
        );
        setApplications(response.data.applications);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [studentId]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "#f0ad4e"; 
      case "Approved": return "#5cb85c"; 
      case "Rejected": return "#d9534f"; 
      default: return "#777"; 
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <TopBar studentId={studentId} />

      {/* ---------- Background Image Section ---------- */}
      <section
        style={{
          minHeight: "60vh",
          color: "white",
          backgroundImage: `url(/track_status.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",
          padding: "80px 20px",
        }}
      >
        {/* Dark overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: 1,
          }}
        ></div>

        <div style={{ position: "relative", zIndex: 2 }}>
          <h1 style={{ fontSize: "42px", marginBottom: "15px", textAlign: "center" }}>
            Track Your Scholarship Applications
          </h1>
          <p style={{ fontSize: "18px", marginBottom: "40px", textAlign: "center" }}>
            Check the current status of all your submitted scholarship applications.
          </p>

          {/* Application Cards */}
          {applications.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px",
                marginTop: "30px",
              }}
            >
              {applications.map((app) => (
                <div
                  key={app.id}
                  style={{
                    background: "rgba(255, 255, 255, 0.15)",
                    color: "white",
                    padding: "20px",
                    borderRadius: "12px",
                    textAlign: "left",
                    backdropFilter: "blur(6px)",
                    boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
                  }}
                >
                  <h3 style={{ marginBottom: "10px" }}>
                    {app.scholarship_type === "Merit"
                      ? "Merit Scholarship Application"
                      : app.scholarship_type === "Need"
                      ? "Need-Based Scholarship Application"
                      : app.scholarship_type === "Sports"
                      ? "Sports Scholarship Application"
                      : "Special Scheme Scholarship Application"}
                  </h3>

                  <p style={{ margin: "5px 0" }}><strong>Category:</strong> {app.scholarship_type}</p>
                  <p style={{ margin: "5px 0" }}>
                    <strong>Applied On:</strong>{" "}
                    {new Date(app.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>                  
                  <p style={{ margin: "5px 0" }}><strong>Status:</strong> {app.status}</p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "12px",
                  }}
                >
                  {/* Status Badge */}
                  <span
                    style={{
                      display: "inline-block",
                      padding: "6px 18px",
                      background: getStatusColor(app.status),
                      color: "#fff",
                      borderRadius: "50px",
                      fontWeight: "600",
                      fontSize: "14px",
                      minWidth: "90px",
                      textAlign: "center",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      cursor: "default",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
                    }}
                  >
                    {app.application_status}
                  </span>

                  {/* Download Icon/Button */}
                  {app.status === "Approved" && (
                    <div
                      onClick={() => handleDownloadCertificate(app.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "6px 12px",
                        backgroundColor: "#4CAF50",
                        color: "#fff",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "500",
                        fontSize: "14px",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#45a049")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4CAF50")}
                      title="Download Certificate"
                    >
                      <FaDownload style={{ fontSize: "16px" }} />
                      Download
                    </div>
                  )}
                </div>


                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: "center", marginTop: "50px" }}>
              You have not applied for any scholarships yet.
            </p>
          )}
        </div>
      </section>

      {/* ---------- How It Works Section (normal white background) ---------- */}
      <section id="howItWorks" style={{ padding: "50px 40px", background: "#f3f7ff" }}>
        <h2 style={{ textAlign: "center", marginBottom: "35px" }}>How It Works</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "25px",
          }}
        >
          <div style={howItWorksCard}>
            1. Add Achievements<br />Submit grades, activities, and volunteer work.
          </div>
          <div style={howItWorksCard}>
            2. Earn Scholarships<br />Get scholarships based on your achievements.
          </div>
          <div style={howItWorksCard}>
            3. Track Progress<br />Monitor your scholarships and submissions over time.
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// Styles
const howItWorksCard = {
  background: "white",
  borderRadius: "12px",
  padding: "25px",
  textAlign: "center",
  boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
  fontWeight: "500",
};

export default TrackApplicationStatus;
