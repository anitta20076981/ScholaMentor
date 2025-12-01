import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TopBar from "../../components/student/TopBar";
import Footer from "../../components/student/Footer";
import axios from "axios";
import { FaEye, FaDownload } from "react-icons/fa";
import Swal from "sweetalert2";

function ApplySponsorship() {
  const { studentId } = useParams();

  const [formData, setFormData] = useState({
    sponsor_type: "",
    purpose: "",
    required_amount: "",
    background: "",
    marksheet: null,
    cgpa: "",

  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [latestApplication, setLatestApplication] = useState(null);
  const [inforequests, setInforequests] = useState(null);
  
  const handleDownloadCertificate = async (applicationId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/student/${studentId}/download-sponsorship-certificate/${applicationId}`,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Sponsorship_Certificate_${applicationId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading certificate:", error);
      alert("Failed to download certificate. Please try again later.");
    }
  };

  useEffect(() => {
    async function fetchSponsorshipApplication() {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/student/getSponsorship/${studentId}`
        );
         setFormData({
          sponsor_type: res.data.sponsor_type || "",
          purpose: res.data.purpose || "",
          required_amount: res.data.required_amount || "",
          background: res.data.background || "",
          marksheet: res.data.marksheet || "25",
          cgpa: res.data.cgpa || "25",
        });
        if (res.data) setLatestApplication(res.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }

     async function fetchNotifications() {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/student/fetch_info_request_notifications/${studentId}`
        );
      
        if (res.data) setInforequests(res.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }

    

    fetchNotifications();
    fetchSponsorshipApplication();
  }, [studentId]);

  const handleUploadDocument = async (e, requestId) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("document", file);

  try {
    await axios.post(
      `${process.env.REACT_APP_API_URL}/api/student/upload_info_request_document/${requestId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    Swal.fire({
      title: "Success!",
      text: "Document uploaded successfully!",
      icon: "success",
      confirmButtonText: "OK"
    }).then(() => {
      window.location.reload();
    });

    // Refetch info requests
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/student/fetch_info_request_notifications/${studentId}`
    );
    console.log(res.data);
    setInforequests(res.data);

  } catch (err) {
    Swal.fire({
      title: "Failed!",
      text: "Failed to upload document. Please try again.",
      icon: "error",
      confirmButtonText: "OK"
    }).then(() => {
      window.location.reload();
    });
  }
};


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

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/student/apply_sponsorship/${studentId}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setSuccessMessage(res.data.message || "Application submitted successfully!");
      setLatestApplication(res.data);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      // Show backend error message if available
      const errorMsg =
        err.response?.data?.error || "Failed to submit application. Please try again.";
      setErrorMessage(errorMsg);
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };


  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "#f0ad4e";
      case "Approved": return "#5cb85c";
      case "Rejected": return "#d9534f";
      default: return "#777";
    }
  };

  const isReadOnly = latestApplication && latestApplication.status !== "Pending";

  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "#f8f9ff" }}>
      <TopBar studentId={studentId} successMessage={successMessage} errorMessage={errorMessage} />


      {/* Hero Section */}
      <section
        style={{
          textAlign: "center",
          padding: "120px 20px",
          color: "white",
          backgroundImage: `
            linear-gradient(rgba(10, 12, 15, 0.7), rgba(11, 11, 11, 0.7)), 
            url('/Apply-for-Sponsorship.png')
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
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
        {/* Text Section */}
        <div style={{ flexBasis: "100%", maxWidth: "800px", marginBottom: "30px" }}>
          <h1 style={{ textAlign: "center", marginBottom: "10px", color: "#d1541a" }}>
            Apply for Sponsorship
          </h1>
          <p style={{ textAlign: "center", fontSize: "16px", color: "#333" }}>
            If your CGPA is greater than 85, you may be eligible for a sponsorship. Please fill out the application form below to apply.
          </p>
          <p
            style={{
              textAlign: "center",
              fontSize: "16px",
              color: "#d9534f",
              fontWeight: "bold",
              fontStyle: "italic",
            }}
          >
            Important: If you have already applied for a fee concession or any other scholarship, you are not eligible to apply for this sponsorship.
          </p>
        </div>

        {/* Form Card */}
    <form
        onSubmit={handleSubmit}
        style={{
            background: "#ffffff",
            color: "#070707ff",
            padding: "50px 50px",
            borderRadius: "12px",
            boxShadow: "0 6px 25px rgba(0,0,0,0.15)",
            flex: "1",
            minWidth: "350px",
            maxWidth: "700px",
            display: "flex",
            flexDirection: "column",
            gap: "25px",
        }}
    >
        <div style={{ display: "flex", gap: "25px", flexWrap: "wrap" }}>
          <label style={{ flex: "1", minWidth: "180px" }}>
          Purpose of Sponsorship <span style={{ color: "red" }}>*</span>
          <select
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              style={inputStyle}
              required
              disabled={isReadOnly}
          >
              <option value="">Select Purpose</option>
              <option value="Studies">Studies</option>
              <option value="Laptop">Laptop</option>
              <option value="Books">Books</option>
              <option value="Hostel">Hostel</option>
          </select>
          </label>
          <label style={{ flex: "1", minWidth: "180px" }}>
          Required Amount (€) <span style={{ color: "red" }}>*</span>
          <input
          type="number"
          name="required_amount"
          value={formData.required_amount}
          onChange={handleChange}
          style={inputStyle}
          disabled={isReadOnly}
          required
          />
          </label>
        </div>

   
        <div style={{ display: "flex", gap: "40px", flexWrap: "wrap" }}>
       

        <label style={{ flex: "1", minWidth: "180px" }}>
            CGPA <span style={{ color: "red" }}>*</span>
            <input
            type="number"
            name="cgpa"
            step="0.01"
            min="0"
            max="10"
            value={formData.cgpa || ""}
            onChange={handleChange}
            style={inputStyle}
            disabled={isReadOnly}
            required
            placeholder="Enter your CGPA"
            />
        </label>
        </div>


        {/* Background */}
        <label>
            Background (Why you need help) <span style={{ color: "red" }}>*</span>
            <textarea
            name="background"
            value={formData.background}
            onChange={handleChange}
            style={{ ...inputStyle, height: "150px" }}
            disabled={isReadOnly}
            required
            />
        </label>

        {/* Marksheet Upload */}
        <div style={{ position: "relative" }}>
            <label>Marksheet</label> <span style={{ color: "red" }}>*</span>
            <input
            type="file"
            name="marksheet"
            required
            onChange={handleChange}
            style={{ width: "100%", marginTop: "5px" }}
            disabled={isReadOnly}
            />
            {formData.marksheet && (
            <FaEye
                style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#007bff",
                cursor: "pointer",
                }}
                onClick={() =>
                window.open(`${process.env.REACT_APP_API_URL}/uploads/${formData.marksheet}`, "_blank")
                }
            />
            )}
        </div>

        {!isReadOnly && (
            <button type="submit" style={submitBtnStyle}>
            Submit Application
            </button>
        )}
    </form>

    {/* Status Card */}
    {/* {latestApplication && (
        <div
        style={{
            background: "#ffffff",
            color: "#2d6cdf",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
            flex: "1",
            minWidth: "280px",
            maxWidth: "400px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
        }}
        >
        <h3 style={{ marginBottom: "10px" }}>Latest Application Status</h3>
        <p><strong>Sponsor Type:</strong> {latestApplication.sponsor_type}</p>
        <p><strong>Purpose:</strong> {latestApplication.purpose}</p>
        <p><strong>Amount:</strong> €{latestApplication.required_amount}</p>

        <p style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <strong>Status:</strong>{" "}
            <span
            style={{
                color: "white",
                background: getStatusColor(latestApplication.status),
                padding: "5px 12px",
                borderRadius: "50px",
                fontWeight: "bold",
            }}
            >
            {latestApplication.status}
            </span>
        </p>

        {latestApplication.status === "Approved" && (
            <button
            onClick={() => handleDownloadCertificate(latestApplication.id)}
            style={{
                padding: "10px",
                background: "#5cb85c",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
            }}
            >
            <FaDownload style={{ marginRight: "8px" }} /> Download Certificate
            </button>
        )}

        {latestApplication.admin_remarks && (
            <p><strong>Admin Remarks:</strong> {latestApplication.admin_remarks}</p>
        )}

        <p><strong>Applied On:</strong> {new Date(latestApplication.created_at).toLocaleDateString()}</p>
        </div>
    )} */}

    {/* Status Card */}
    {/* Status Card */}

     {latestApplication && latestApplication.status === "Pending" && (
    <div
      style={{
        background: "#ffffff",
        color: "#d9534f",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        flex: "1",
        minWidth: "280px",
        maxWidth: "400px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        textAlign: "center",
      }}
    >
      {/* Add the style tag here */}
      <style>
        {`
          .blink-message {
            animation: blinker 1s linear infinite;
          }
          @keyframes blinker {
            50% { opacity: 0; }
          }
        `}
      </style>

      <h3 style={{ marginBottom: "10px" }}>Application Submitted</h3>
      <p
        className="blink-message"
        style={{ fontSize: "16px", color: "#d9534f", fontWeight: "bold" }}
      >
      Thank you for submitting your application! It is currently under verification. We will update you once the process is complete. Please check back in 1 day for the latest status.  </p>
    </div>
     )}

    {inforequests && inforequests.length > 0 && (
  <div
    style={{
      background: "#fff",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      marginBottom: "30px",
    }}
  >
    <h3>Requests from Sponsors</h3>
    {inforequests.map((req) => (
      <div
        key={req.id}
        style={{
          borderBottom: "1px solid #eee",
          padding: "10px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <p><strong>Message:</strong> {req.message}</p>
          <p><strong>Required Document:</strong> {req.required_document || "Not specified"}</p>
          <p><strong>Status:</strong> {req.status}</p>
        </div>

        {/* Upload Button if pending */}
        {req.status === "Pending" && (
          <input
            type="file"
            name="upload_doc"
            onChange={(e) => handleUploadDocument(e, req.id)}
          />
        )}
      </div>
    ))}
  </div>
)}

     {latestApplication && latestApplication.status === "Approved" &&  inforequests.length == 0 && (
    <div
      style={{
        background: "#ffffff",
        color: "#d9534f",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        flex: "1",
        minWidth: "280px",
        maxWidth: "400px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        textAlign: "center",
      }}
    >
      {/* Add the style tag here */}
      <style>
        {`
          .blink-message {
            animation: blinker 1s linear infinite;
          }
          @keyframes blinker {
            50% { opacity: 0; }
          }
        `}
      </style>

      <h3 style={{ marginBottom: "10px" }}>Application Submitted</h3>
      <p
        className="blink-message"
        style={{ fontSize: "16px", color: "#12ad65ff", fontWeight: "bold" }}
      >
      🎉 Your sponsorship application has been <strong>approved by the admin</strong>! 
      A sponsor will contact you shortly. Thank you for your patience.   </p>
    </div>
     )} 
    {latestApplication && latestApplication.status === "InfoSubmitted" && (inforequests?.length === 0) && (

     <div
      style={{
        background: "#ffffff",
        color: "#d9534f",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        flex: "1",
        minWidth: "280px",
        maxWidth: "400px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        textAlign: "center",
      }}
    >
      {/* Add the style tag here */}
      <style>
        {`
          .blink-message {
            animation: blinker 1s linear infinite;
          }
          @keyframes blinker {
            50% { opacity: 0; }
          }
        `}
      </style>

      <h3 style={{ marginBottom: "10px" }}>Document Submitted</h3>
      <p
        className="blink-message"
        style={{ fontSize: "16px", color: "#12ad65ff", fontWeight: "bold" }}
      >
        ✔️ You have successfully uploaded the requested document.  
      Your submission is under review by the sponsor.  
      Please wait while the sponsor verifies your details.</p>
    </div>
     )} 
    </section>

    <Footer />
    </div>
  );
}

// Common styles
const inputStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  marginTop: "5px",
  fontSize: "15px",
};

const submitBtnStyle = {
  padding: "16px 0",
  background: "#d9534f",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold",
  cursor: "pointer",
  marginTop: "10px",
  transition: "all 0.3s",
};

export default ApplySponsorship;
