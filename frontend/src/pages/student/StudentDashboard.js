import { useState , useEffect} from "react";
import axios from "axios";
import TopBar from "../../components/student/TopBar";  
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

function StudentDashboard() {
  const navigate = useNavigate();//for redirect user for view scholarship status
  const { studentId } = useParams(); // define studentid
  const [query, setQuery] = useState("");
  const [userScholarshipApplicationCount, setUserScholarshipApplicationCount] = useState(0);


  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search:", query);
  };

  useEffect(() => {
    // Fetch scholarship count for the user
    const fetchScholarshipCount = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/student/${studentId}/scholarship-count`
        );
        console.log(response.data.count);
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
      <TopBar studentId={studentId} />  {/* pass student id */}

    {/* -------------------- view scholarship application status -------------------- */}
    {userScholarshipApplicationCount > 0 && (
    <section
      style={{
        textAlign: "center",
        padding: "80px 20px",
        color: "white",
        backgroundImage: `url(/track_status.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
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
          Track Your Scholarship Application Status
        </h1>

        <p style={{ fontSize: "18px", marginBottom: "40px" }}>
          View your submitted scholarship applications and follow their progress.
        </p>

        <button
          style={{
            padding: "12px 30px",
            background: "#fff",
            color: "#2d6cdf",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          onClick={() => navigate(`/student/track-status/${studentId}`)}
        >
          View My Applications
        </button>
      </div>
    </section>
    )}

    {/* -------------------------- */}


      {/* -------------------- MAIN HERO SECTION -------------------- */}
      <section style={{
        textAlign: "center",
        padding: "80px 20px",
        background: "linear-gradient(135deg, #2d6cdf 0%, #5590f5 100%)",
        color: "white",
      }}>
        <h1 style={{ fontSize: "42px", marginBottom: "15px" }}>Scholarships, Mentors & Success – All in One Place</h1>
        <p style={{ fontSize: "18px", marginBottom: "40px" }}>
        Explore Scholarships, Connect with Mentors, Receive Sponsorships, and Access Donor Support.

        </p>

        
      </section>

      {/* -------------------- SECOND HERO / CTA SECTION -------------------- */}
      <section
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "30px",
          padding: "50px 20px",
          background: "#f3f7ff",
          flexWrap: "wrap",
          textAlign: "center",
        }}
      >
        {/* Left Text */}
       {/* -------------------- SECOND HERO / CTA SECTION -------------------- */}
<section
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "stretch",
    gap: "30px",
    padding: "50px 20px",
    flexWrap: "wrap",
  }}
>
  {/* Left Text Block */}
  <div
    style={{
      flex: "1",
      minWidth: "300px",
      background: "#2d6cdf", // blue background
      color: "white",         // white text
      padding: "30px",
      borderRadius: "12px",
      boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
      textAlign: "center",
    }}
  >
    <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>
      Take the Next Step in Your Academic Journey
    </h2>
    <p style={{ fontSize: "16px" }}>
      Explore scholarships, receive sponsorships, connect with mentors, and access donor support.
    </p>
  </div>

  {/* Right Quick Action Block */}
  <div
    style={{
      flex: "1",
      minWidth: "300px",
      background: "#2d6cdf", // same blue background
      color: "white",         // white text
      padding: "30px",
      borderRadius: "12px",
      boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
      textAlign: "center",
    }}
  >
    <h2 style={{ fontSize: "28px", marginBottom: "20px" }}>
      Just Want to Browse Opportunities?
    </h2>
    <p style={{ fontSize: "16px", marginBottom: "20px" }}>
      Quickly explore scholarships, sponsorships, mentors, and donors without signing up.
    </p>
     
  </div>
</section>


      </section>

      {/* -------------------- SCHOLARSHIP CARDS -------------------- */}
      <section style={{ padding: "50px 40px" }}>
        <h2 style={{ marginBottom: "25px" }}>Recommended Opportunities</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "25px" }}>
          {scholarships.map((s, idx) => (
            <div key={idx} style={{ background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 3px 10px rgba(0,0,0,0.08)" }}>
              <h3>{s.name}</h3>
              <p><strong>Type:</strong> {s.type}</p>
            </div>
          ))}
        </div>
      </section>

      {/* -------------------- HOW IT WORKS -------------------- */}
     <section id="howItWorks"
      style={{ padding: "50px 40px", background: "#f3f7ff" }}
    >
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
      {/* -------------------- FOOTER -------------------- */}
      <Footer />
    </div>
  );
}

// Styles
const navLinkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: "15px",
};

const howItWorksCard = {
  background: "white",
  borderRadius: "12px",
  padding: "25px",
  textAlign: "center",
  boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
  fontWeight: "500",
};

export default StudentDashboard;
