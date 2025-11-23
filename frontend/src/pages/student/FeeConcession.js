import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TopBar from "../../components/student/TopBar";
import Footer from "../../components/student/Footer";
import axios from "axios";
import { FaEye } from "react-icons/fa";

function FeeConcession() {
  const { studentId } = useParams();

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
  const [latestApplication, setLatestApplication] = useState(null); // Latest application for status

  useEffect(() => {
    async function fetchFeeConcessionApplication() {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/student/getFeeConcession/${studentId}`
        );

        setFormData({
          course: res.data.course || "",
          semester: res.data.semester || "",
          reason: res.data.reason || "",
          family_income: res.data.family_income || "",
          concession_requested: res.data.concession_requested || "25",
          supporting_doc: res.data.supporting_doc || null,
        });

        if (res.data) setLatestApplication(res.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }
    fetchFeeConcessionApplication();
  }, [studentId]);

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

      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/student/apply_fee_concession/${studentId}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setSuccessMessage("Application submitted successfully!");
      setLatestApplication(res.data); // Update status box
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to submit application.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  // Status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "#f0ad4e";
      case "Approved": return "#5cb85c";
      case "Rejected": return "#d9534f";
      default: return "#777";
    }
  };

  //if application status is pending ,then only user can make changes of the requested application, otherwise it kept as readonly
  const isReadOnly = latestApplication && latestApplication.status !== "Pending";

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
        <h1 style={{ fontSize: "42px", marginBottom: "15px" }}>Apply for Fee Concession</h1>
        <p style={{ fontSize: "18px", marginBottom: "40px" }}>
          Fill out the form below to request a fee concession. Provide all required details and upload any supporting documents.
        </p>
      </section>

      {/* Form + Status Section */}
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
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Fee Concession Application Form</h2>

          <label>
            Reason
            <select
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              style={inputStyle}
              required
              disabled={isReadOnly}
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
              disabled={isReadOnly}
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
              disabled={isReadOnly}
            />
            {formData.supporting_doc && (
              <a
                href={`${process.env.REACT_APP_API_URL}/uploads/${formData.supporting_doc}`}
                target="_blank"
                rel="noopener noreferrer"
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
              </a>
            )}
          </div>

          {!isReadOnly && (
            <button type="submit" style={submitBtnStyle}>
              Submit Application
            </button>
          )}
        </form>

        {/* Status + Tips */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            minWidth: "250px",
            maxWidth: "400px",
          }}
        >
          {latestApplication && (
            <div
              style={{
                background: "#ffffff",
                color: "#2d6cdf",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            >
              <h3 style={{ marginBottom: "10px" }}>Latest Application Status</h3>
              <p><strong>Course:</strong> {latestApplication.course}</p>
              <p><strong>Semester:</strong> {latestApplication.semester}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color: "white",
                    background: getStatusColor(latestApplication.status),
                    padding: "5px 12px",
                    borderRadius: "50px",
                  }}
                >
                  {latestApplication.status}
                </span>
              </p>
              {latestApplication.admin_remarks && (
                <p><strong>Admin Remarks:</strong> {latestApplication.admin_remarks}</p>
              )}
              <p>
                <strong>Applied On:</strong>{" "}
                {new Date(latestApplication.created_at).toLocaleDateString()}
              </p>

              {latestApplication.status === "Pending" && (
                <div
                  style={{
                    marginTop: "20px",
                    padding: "15px",
                    background: "#f0ad4e",
                    color: "white",
                    borderRadius: "8px",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  🕒 Your application is under review. Please wait for admin verification.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

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
