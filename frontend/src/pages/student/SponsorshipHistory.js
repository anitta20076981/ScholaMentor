import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TopBar from "../../components/student/TopBar";
import Footer from "../../components/student/Footer";
import axios from "axios";
import "./SponsorshipHistory.css";

function SponsorshipHistory() {
  const { studentId } = useParams();
  const [recommendedStudents, setRecommendedStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/student/get-all-approved-or-rejected-sponsorship/${studentId}`
        );
        setRecommendedStudents(res.data);
      } catch (err) {
        console.error("Failed to fetch recommended students:", err);
      }
    };
    fetchRecommended();
  }, [studentId]);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "#f8f9ff" }}>
      <TopBar studentId={studentId} />

      {/* Hero Section with cards overlay */}
        <section
            className="hero-section"
                style={{
                position: "relative",
                width: "100%",
                minHeight: "400px",
                backgroundImage: `linear-gradient(rgba(10,12,15,0.5), rgba(11,11,11,0.5)), url(${process.env.PUBLIC_URL}/handshake.jpg)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",      
                justifyContent: "flex-start",
                padding: "50px 40px",
                textAlign: "center",      
            }}
        >
            {/* Title */}
            <h1 style={{ color: "white", marginBottom: "10px", fontSize: "36px" }}>
                My Sponsorship
            </h1>

            {/* Subtitle */}
            <h3 style={{ color: "white", fontWeight: "400", marginBottom: "30px", fontSize: "20px" }}>
                Track all your sponsorship requests and see their status
            </h3>

            {/* Cards container */}
            <div className="card-grid">
            {recommendedStudents.map((student, i) => (
                <div className="student-card" key={i}>
                <div className="student-image"></div>
                <div className="card-info">
                    <h3>{student.student_name}</h3>
                    <p><strong>Purpose:</strong> {student.purpose}</p>
                    <p><strong>Request Amount:</strong> {student.required_amount}</p>
                    <p><strong>Approved Amount:</strong> {student.approved_amount}</p>
                </div>
                
                {student?.status === "ApprovedBySponsor" && student?.approval_type === "Full" && (
                    <button className="sponsorship-approve-btn">
                    Full Sponsorship ({student.approved_amount})
                    </button>
                )}
                {student?.status === "ApprovedBySponsor" && student?.approval_type === "Partial" && (
                    <button className="sponsorship-approve-btn">
                    Partial Sponsorship ({student.approved_amount})
                    </button>
                )}
                </div>
            ))}

            
            </div>
        </section>

      <Footer />
    </div>
  );
}

export default SponsorshipHistory;
