import { useState, useEffect } from "react";
import axios from "axios";
import TopBar from "../../components/sponsor/TopBar";  
import Footer from "../../components/student/Footer";
import { useParams, useNavigate } from "react-router-dom"; // use parameter from url

// Example data
const scholarships = [
  { name: "Merit Scholarship", type: "Merit", location: "Dublin", amount: "€1000" },
  { name: "Need-Based Scholarship", type: "Need", location: "Leinster", amount: "€1500" },
  { name: "Excellence Award", type: "Merit", location: "Cork", amount: "€2000" },
];

const mentors = [
  { name: "John Doe", expertise: "Science & Math" },
  { name: "Jane Smith", expertise: "Arts & Humanities" },
];

function SponsorDashboard() {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const [userScholarshipApplicationCount, setUserScholarshipApplicationCount] = useState(0);

  useEffect(() => {
    // Fetch scholarship count for the user
    const fetchScholarshipCount = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/student/${studentId}/scholarship-count`
        );
        setUserScholarshipApplicationCount(response.data.count);
      } catch (error) {
        console.error("Error fetching scholarship count:", error);
      }
    };

    fetchScholarshipCount();
  }, [studentId]);

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      {/* -------------------- TOP NAV -------------------- */}
      <TopBar studentId={studentId} />

      {/* -------------------- HERO BANNER -------------------- */}
      <section
        style={{
          textAlign: "center",
          padding: "80px 20px",
          color: "white",
          backgroundImage: `url(/sponsorship.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",
          minHeight: "50vh",
          // height: "100vh",
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
          <h1 style={{ fontSize: "42px", marginBottom: "15px" }}>
            Sponsor Students & Shape Futures
          </h1>
          <p style={{ fontSize: "18px", marginBottom: "40px" }}>
            Browse Students, Sponsor with Impact, Monitor Contributions, and Become a Mentor
          </p>
        </div>
      </section>

      {/* -------------------- CTA BLOCKS -------------------- */}
      <section
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "stretch",
          gap: "30px",
          padding: "50px 20px",
          flexWrap: "wrap",
          textAlign: "center",
        }}
      >
        {/* Left CTA */}
        <div
          style={{
            flex: "1",
            minWidth: "300px",
            background: "#2d6cdf",
            color: "white",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>
            Take the Next Step in Your Academic Journey
          </h2>
          <p style={{ fontSize: "16px" }}>
            Explore scholarships, receive sponsorships, connect with mentors, and access donor support.
          </p>
        </div>

        {/* Right CTA */}
        <div
          style={{
            flex: "1",
            minWidth: "300px",
            background: "#2d6cdf",
            color: "white",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>
            Just Want to Browse Opportunities?
          </h2>
          <p style={{ fontSize: "16px", marginBottom: "20px" }}>
            Quickly explore scholarships, sponsorships, mentors, and donors without signing up.
          </p>
          <button
            style={{
              padding: "12px 25px",
              background: "white",
              color: "#2d6cdf",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Browse Now
          </button>
        </div>
      </section>

      {/* -------------------- RECOMMENDED STUDENTS -------------------- */}
      <section
        style={{
          padding: "60px 20px",
          background: "#ffffff",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "32px",
            fontWeight: "700",
            marginBottom: "40px",
            color: "#2d6cdf",
          }}
        >
          Recommended Students for Sponsorship
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "25px",
            maxWidth: "1200px",
            margin: "auto",
          }}
        >
          {[
            {
              name: "Aiswarya P",
              course: "MSc Computer Science",
              score: "92%",
              need: "High Financial Need",
            },
            {
              name: "Rahul N",
              course: "B.Tech Mechanical",
              score: "88%",
              need: "Medium Financial Need",
            },
            {
              name: "Maria Thomas",
              course: "BA Economics",
              score: "95%",
              need: "High Financial Need",
            },
          ].map((student, index) => (
            <div
              key={index}
              style={{
                background: "#f3f7ff",
                padding: "25px",
                borderRadius: "12px",
                boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
              }}
            >
              <h3 style={{ marginBottom: "10px", color: "#2d6cdf" }}>
                {student.name}
              </h3>
              <p style={{ margin: "8px 0" }}>
                <strong>Course:</strong> {student.course}
              </p>
              <p style={{ margin: "8px 0" }}>
                <strong>Score:</strong> {student.score}
              </p>
              <p style={{ margin: "8px 0" }}>
                <strong>Need:</strong> {student.need}
              </p>

              <button
                style={{
                  marginTop: "15px",
                  padding: "10px 20px",
                  background: "#2d6cdf",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  width: "100%",
                }}
              >
                Sponsor Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------- FOOTER -------------------- */}
      <Footer />
    </div>
  );
}

export default SponsorDashboard;
