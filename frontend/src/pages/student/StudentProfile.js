import React, { useState, useEffect } from "react"; 
import axios from "axios";
import TopBar from "../../components/student/TopBar";  
import Footer from "../../components/student/Footer";
import { useParams } from "react-router-dom"; // use parameter from URL

function StudentProfile() {
  const { studentId } = useParams(); // get studentId from URL

  // State for personal info form
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    pincode: "",
    school: "",
    course: "",
    department: "",
    year: "",
    cgpa: "",
    familyIncome: "",
    profilePic: null,
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        console.log(111111);

        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/student/getDetails/${studentId}`);

        console.log(res.data);

        // If backend returns an array (e.g., [student]), use res.data[0]
        setFormData(res.data); 
      } catch (err) {
        console.error("Error fetching student profile:", err);
      }
    }

    fetchProfile();
  }, [studentId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Profile updated!");
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <TopBar />

      <section
        style={{
          textAlign: "center",
          padding: "80px 20px",
          background: "linear-gradient(135deg, #2d6cdf 0%, #5590f5 100%)",
          color: "white",
        }}
      >
        <h1 style={{ fontSize: "42px", marginBottom: "15px" }}>My Profile</h1>
        <p style={{ fontSize: "18px", marginBottom: "40px" }}>
          Manage your personal info, scholarships, mentorships, sponsorships, and donor support.
        </p>
      </section>

      <div style={{ padding: "40px" }}>
        {/* -------------------- PERSONAL INFO FORM -------------------- */}
        <section
          style={{
            marginBottom: "30px",
            background: "#2d6cdf",
            padding: "25px",
            borderRadius: "12px",
            color: "white",
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>Personal Information</h2>
          <form
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "25px",
            }}
            onSubmit={handleSubmit}
          >
            {[
              { label: "Full Name", name: "fullName", type: "text" },
              { label: "Email", name: "email", type: "email" },
              { label: "Phone", name: "phone", type: "text" },
              { label: "DOB", name: "dob", type: "date" },
              { label: "Gender", name: "gender", type: "select", options: ["male", "female", "other"] },
              { label: "Address", name: "address", type: "text" },
              { label: "Pincode", name: "pincode", type: "text" },
              { label: "School/College", name: "school", type: "text" },
              { label: "Course", name: "course", type: "text" },
              { label: "Department", name: "department", type: "text" },
              { label: "Year", name: "year", type: "text" },
              { label: "CGPA", name: "cgpa", type: "text" },
              { label: "Family Income", name: "familyIncome", type: "text" },
            ].map((field, idx) => (
              <div key={idx} style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "8px", fontWeight: "500" }}>{field.label}</label>
                {field.type === "select" ? (
                  <select
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    style={{
                      width: "90%",
                      padding: "8px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                      background: "white",
                      color: "black",
                    }}
                  >
                    <option value="">Select {field.label}</option>
                    {field.options.map((opt, i) => (
                      <option key={i} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    style={{ width: "90%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
                )}
              </div>
            ))}

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{ marginBottom: "8px", fontWeight: "500" }}>Profile Picture</label>
              <input type="file" name="profilePic" onChange={handleChange} style={{ width: "90%" }} />
            </div>

            <div
              style={{
                gridColumn: "1 / -1",
                marginTop: "20px",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="submit"
                style={{
                  padding: "10px 25px",
                  borderRadius: "8px",
                  background: "white",
                  color: "black",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                Save Info
              </button>
            </div>
          </form>
        </section>
      </div>

      <Footer />
    </div>
  );
}

export default StudentProfile;
