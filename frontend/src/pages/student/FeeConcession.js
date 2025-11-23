import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TopBar from "../../components/student/TopBar";
import Footer from "../../components/student/Footer";
import axios from "axios";
import { FaEye } from "react-icons/fa";

function FeeConcession() {
  const { studentId, type } = useParams();

  const [formData, setFormData] = useState({
    course: "",
    semester: "",
    reason: "",
    family_income: "",
    concession_requested: "25",
    supporting_doc: null,
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const tipsContent = {
    merit: [
      "Ensure your academic percentage / CGPA is accurate.",
      "Upload a valid marksheet in PDF or image format.",
      "Explain your merit reason clearly and concisely.",
      "Double-check all information before submitting.",
      "Keep a copy of the submitted application for your records.",
    ],
    need: [
      "Provide accurate family income details.",
      "Upload a valid income certificate.",
      "Explain your need clearly and concisely.",
      "Check all family details before submitting.",
      "Keep a copy of the submitted application for your records.",
    ],
    sports: [
      "Mention your sport and level correctly.",
      "Upload valid sports certificates.",
      "Provide coach details if applicable.",
      "Explain your achievements clearly.",
      "Keep a copy of the submitted application for your records.",
    ],
    special: [
      "Provide correct category type.",
      "Upload category and disability certificates if applicable.",
      "Explain the reason for applying clearly.",
      "Double-check all information before submitting.",
      "Keep a copy of the submitted application for your records.",
    ],
  };

  useEffect(() => {
    async function fetchStudentScholarship() {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/student/getScholarship/${type}/${studentId}`
        );
        setFormData((prev) => ({
          ...prev,
          course: res.data.course || "",
          semester: res.data.semester || "",
          reason: res.data.reason || "",
          family_income: res.data.family_income || "",
          concession_requested: res.data.concession_requested || "25",
          supporting_doc: res.data.supporting_doc || null,
        }));
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }
    fetchStudentScholarship();
  }, [studentId, type]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null && formData[key] !== "") data.append(key, formData[key]);
      });

      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/student/apply_scholarship/${type}/${studentId}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setSuccessMessage("Application submitted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to submit application.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "#f0f4ff" }}>
      <TopBar studentId={studentId} successMessage={successMessage} errorMessage={errorMessage} />

      {/* Hero Section */}
      <section
        style={{
          textAlign: "center",
          padding: "80px 20px",
          color: "white",
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), 
            url('/fee-concession.jpg')
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <h1 style={{ fontSize: "42px", marginBottom: "15px" }}>
          Apply for Fee Concession
        </h1>
        <p style={{ fontSize: "18px", marginBottom: "40px" }}>
          Fill out the form below to request a fee concession. Provide all required details and upload any supporting documents.
        </p>
      </section>

      {/* Form + Tips Section */}
      <section
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "40px",
          padding: "50px 20px",
          flexWrap: "wrap",
        }}
      >
        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          style={{
            background: "#ffffff",
            color: "#2d6cdf",
            padding: "40px",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            flex: "1",
            minWidth: "300px",
            maxWidth: "600px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Fee Concession Application Form
          </h2>

          <label>
            Course
            <input
              type="text"
              name="course"
              value={formData.course}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </label>

          <label>
            Year / Semester
            <input
              type="text"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              style={inputStyle}
              required
            />
          </label>

          <label>
            Reason
            <select
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              style={inputStyle}
              required
            >
              <option value="">Select Reason</option>
              <option value="Family Issues">Family Issues</option>
              <option value="Financial Problems">Financial Problems</option>
              <option value="Medical Issues">Medical Issues</option>
            </select>
          </label>

          <label>
            Annual Family Income
            <input
              type="number"
              name="family_income"
              value={formData.family_income}
              onChange={handleChange}
              style={inputStyle}
              readOnly
            />
          </label>

          <label>
            Percentage of Concession Requested
            <select
              name="concession_requested"
              value={formData.concession_requested}
              onChange={handleChange}
              style={inputStyle}
              required
            >
              <option value="25">25%</option>
              <option value="50">50%</option>
              <option value="75">75%</option>
            </select>
          </label>

          <div style={{ position: "relative" }}>
            <label>Upload Supporting Document (Optional)</label>
            <input
              type="file"
              name="supporting_doc"
              onChange={handleChange}
              style={{ width: "100%", marginTop: "5px" }}
            />
            {formData.supporting_doc && (
              <span
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#007bff",
                  cursor: "pointer",
                }}
              >
                <FaEye size={20} />
              </span>
            )}
          </div>

          <button
            type="submit"
            style={submitBtnStyle}
            onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            Submit Application
          </button>
        </form>

        {/* Tips Card */}
            <div
            style={{
                background: "#2d6cdf",
                color: "white",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                flex: "1",
                minWidth: "250px",
                maxWidth: "400px",
            }}
            >
            <h3 style={{ marginBottom: "15px" }}>Tips to Apply Successfully</h3>
            <ul style={{ listStyle: "disc", paddingLeft: "20px", lineHeight: "1.6" }}>
            <li>Fill in the form carefully and double-check all information before submitting.</li>
            <li>Ensure your course and semester details are correct.</li>
            <li>Select the correct reason for applying (Family Issues, Financial Problems, Medical Issues).</li>
            <li>Verify your annual family income is accurate; it is auto-filled for reference.</li>
            <li>Choose the appropriate percentage of fee concession you want to request.</li>
            <li>Upload supporting documents clearly and in the correct format (PDF or image).</li>
            <li>Provide any optional explanations concisely but clearly.</li>
            <li>Keep a copy of the submitted application for your records.</li>
            <li>Check all fields again before clicking submit to avoid errors.</li>
            </ul>

            </div>

      </section>

      <Footer />
    </div>
  );
}

// Input & Button Styles
const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  marginTop: "5px",
};

const submitBtnStyle = {
  padding: "14px 0",
  background: "#2d6cdf",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold",
  cursor: "pointer",
  marginTop: "10px",
  transition: "all 0.3s",
};

export default FeeConcession;
