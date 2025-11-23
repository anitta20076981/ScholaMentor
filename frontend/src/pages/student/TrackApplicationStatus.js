import { useState, useEffect } from "react";
import axios from "axios";
import TopBar from "../../components/student/TopBar";  
import Footer from "../../components/student/Footer";
import { useParams, useNavigate } from "react-router-dom"; 

function TrackApplicationStatus() {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

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
                  <span
                    style={{
                      padding: "6px 15px",
                      background: getStatusColor(app.status),
                      color: "#fff",
                      borderRadius: "50px",
                      fontWeight: "bold",
                    }}
                  >
                    {app.application_status}
                  </span>
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
