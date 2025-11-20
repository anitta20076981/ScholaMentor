import { useState } from "react";
import TopBar from "../../components/student/TopBar";  
import Footer from "../../components/student/Footer";
import { useParams } from "react-router-dom"; // use parameter from url


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
  const { studentId } = useParams(); // define studentid
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search:", query);
  };
  

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      {/* -------------------- TOP NAV -------------------- */}
      <TopBar studentId={studentId} />  {/* pass student id */}

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

        {/* Search */}
        <form onSubmit={handleSearch} style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Search scholarships, mentors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: "400px",
              padding: "12px 15px",
              borderRadius: "8px",
              border: "none",
            }}
          />
          <button type="submit" style={{
            padding: "12px 25px",
            background: "#fff",
            color: "#2d6cdf",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
          }}>
            Search
          </button>
        </form>
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


      </section>

      {/* -------------------- SCHOLARSHIP CARDS -------------------- */}
      <section style={{ padding: "50px 40px" }}>
        <h2 style={{ marginBottom: "25px" }}>Recommended Opportunities</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "25px" }}>
          {scholarships.map((s, idx) => (
            <div key={idx} style={{ background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 3px 10px rgba(0,0,0,0.08)" }}>
              <h3>{s.name}</h3>
              <p><strong>Type:</strong> {s.type}</p>
              <p><strong>Location:</strong> {s.location}</p>
              <p><strong>Amount:</strong> {s.amount}</p>
              <button style={{
                marginTop: "10px",
                padding: "8px 16px",
                borderRadius: "6px",
                background: "#2d6cdf",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}>Apply</button>
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


      {/* -------------------- MENTORS -------------------- */}
      <section style={{ padding: "50px 40px" }}>
        <h2 style={{ marginBottom: "25px" }}>Connect with Mentors</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
          {mentors.map((m, idx) => (
            <div key={idx} style={{ background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 3px 10px rgba(0,0,0,0.08)" }}>
              <h3>{m.name}</h3>
              <p>{m.expertise}</p>
              <button style={{
                marginTop: "10px",
                padding: "8px 16px",
                borderRadius: "6px",
                background: "#2d6cdf",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}>Connect</button>
            </div>
          ))}
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
