import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/sponsor/Sidebar";
import TopBar from "../../components/sponsor/TopBar";
import Footer from "../../components/sponsor/Footer";
import { useParams } from "react-router-dom";
import "./SponsorProfile.css";
import { FaEye } from "react-icons/fa";
import Swal from "sweetalert2";

function SponsorProfile() {
  const { sponsorId } = useParams();
  const [activeTab, setActiveTab] = useState("personal");

  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    gender: "",
    occupation: "",
    gov_id:  null,
    reason_for_sponsorship: "",
    income_certificate:  null,
    profile_photo: null,
    bank_statement: null,
    profile_photo: null
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [sponsorStatus, setSponsorStatus] = useState("");

  useEffect(() => {
    async function fetchMentor() {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/sponsor/get-details/${sponsorId}`
        );
        const data = res.data;

        setFormData((prev) => ({
          ...prev,
          phone: data.phone || "",
          gender: data.gender || "",
          address: data.address || "",
          occupation: data.occupation || "",
          reason_for_sponsorship: data.reason_for_sponsorship || "",         
          gov_id: data.gov_id || null,
          income_certificate: data.income_certificate || null,
          bank_statement: data.bank_statement || null,
          profile_photo: data.	profile_photo || null,
        }));

      } catch (e) {
        console.error("Error fetching mentor details:", e);
      }
    }

     const getSponsorDetails = async () => {
      try {
        const resMentor = await axios.get(`${process.env.REACT_APP_API_URL}/api/sponsor/get-details/${sponsorId}`);
        setSponsorStatus(resMentor.data.status); 
      } catch (err) {
        console.error("Failed to fetch recommended students:", err);
      }
    };
    getSponsorDetails();

    fetchMentor();
  }, [sponsorId]);

const handleChange = (e) => {
  const { name, files, value, options, type } = e.target;

 if (type === "select-multiple") {
    // Create an array of selected option values
    const selectedValues = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);

    setFormData(prev => ({
      ...prev,
      [name]: selectedValues
    }));
  } else {
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  }
};

  const handleSubmit = async (e) => {
  e.preventDefault();
  setSuccessMessage("");
  setErrorMessage("");

  try {
    const data = new FormData();

    // Convert subjects array to JSON string before sending
    if (Array.isArray(formData.subjects)) {
      data.append("subjects", JSON.stringify(formData.subjects));
    }

    // Append other fields
    Object.keys(formData).forEach((key) => {
      if (key !== "subjects" && formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });

    const res = await axios.put(
      `${process.env.REACT_APP_API_URL}/api/sponsor/update/${sponsorId}`,
      data,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    if (res.data.success) {
      await Swal.fire({
        title: "Success!",
        text: `Profile updated successfully!`,
        icon: "success",
        confirmButtonText: "OK",
      });

    } else {
      setErrorMessage("Failed to update profile.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  } catch (error) {
    console.error(error);
    setErrorMessage("Something went wrong.");
    setTimeout(() => setErrorMessage(""), 3000);
  }
};

  return (
    <div className="mentor-wrapper">
      <Sidebar sponsorId={sponsorId} sponsorStatus={sponsorStatus}/>
      <div className="content">
        <TopBar
          sponsorId={sponsorId}
          successMessage={successMessage}
          errorMessage={errorMessage} sponsorStatus={sponsorStatus}
        />

        {/* HERO / INTRO TEXT */}
        <section className="mentor-hero">
          <h1>Empower Students Through Sponsorship</h1>
          <p>Support talented students, contribute to education, and change lives.</p>
        </section>

        {/* PROFILE FORM */}
        <div className="profile-main">
          {/* LEFT SIDE PROFILE CARD */}
          <div className="profile-sidebar">
            <div className="profile-card">
              <div className="avatar-wrapper">
                {formData.profile_photo ? (
                  typeof formData.profile_photo === "object" ? (
                    <img
                      src={URL.createObjectURL(formData.profile_photo)}
                      className="avatar"
                      alt="Profile"
                    />
                  ) : (
                    <img
                      src={`${process.env.REACT_APP_API_URL}/uploads/${formData.profile_photo}`}
                      className="avatar"
                      alt="Profile"
                    />
                  )
                ) : (
                  <img src="/avatar.jpg" className="avatar" alt="default" />
                )}

                <label htmlFor="profile_photo" className="edit-avatar-btn">
                  &#9998;
                </label>
                <input
                  type="file"
                  id="profile_photo"
                  name="profile_photo"
                  accept="image/*"
                  onChange={handleChange}
                  style={{ display: "none" }}
                />
              </div>

              {/* <h2 className="profile-name">{formData.fullName}</h2> */}
              {/* <p className="profile-email">{formData.email}</p> */}
            </div>
          </div>

          {/* RIGHT SIDE CONTENT */}
          <div className="profile-content">
            <div className="tab-card">
              <div className="tabs">
                <button
                  className={activeTab === "personal" ? "active" : ""}
                  onClick={() => setActiveTab("personal")}
                >
                  Personal Info
                </button>
                <button
                  className={activeTab === "documents" ? "active" : ""}
                  onClick={() => setActiveTab("documents")}
                >
                  Documents
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {/* PERSONAL TAB */}
                {activeTab === "personal" && (
                  <div className="tab-content">
                    <div className="form-row">
                      <div className="form-field">
                        <label>Phone Number</label>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-field">
                        <label>Gender</label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="form-field">
                        <label>Address</label>
                        <textarea
                          name="address"
                          rows={3}
                          value={formData.address}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                     <div className="form-row">
                      <div className="form-field">
                         <label>Occupation</label>
                        <input
                          type="text"
                          name="occupation"
                          value={formData.occupation}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-field">
                        <label>Reason For Sponsorship</label>
                        <textarea
                          name="reason_for_sponsorship"
                          rows={3}
                          value={formData.reason_for_sponsorship}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* DOCUMENTS TAB */}
                {activeTab === "documents" && (
                  <div className="tab-content">
                    <div className="form-row">
                      <div className="form-field" style={{ position: "relative" }}>
                        <label>Income Certificates</label>
                        <input type="file" name="income_certificate" onChange={handleChange} />
                        {formData.income_certificate && (
                          <a
                            href={`${process.env.REACT_APP_API_URL}/uploads/${formData.income_certificate}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="icon-eye"
                          >
                            <FaEye size={20} />
                          </a>
                        )}
                      </div>

                      <div className="form-field" style={{ position: "relative" }}>
                        <label>Bank Statement( 3 months)</label>
                        <input type="file" name="bank_statement" onChange={handleChange} />
                        {formData.bank_statement && (
                          <a
                            href={`${process.env.REACT_APP_API_URL}/uploads/${formData.bank_statement}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="icon-eye"
                          >
                            <FaEye size={20} />
                          </a>
                        )}
                      </div>

                       <div className="form-field" style={{ position: "relative" }}>
                        <label>Gov Id</label>
                        <input type="file" name="gov_id" onChange={handleChange} />
                        {formData.gov_id && (
                          <a
                            href={`${process.env.REACT_APP_API_URL}/uploads/${formData.gov_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="icon-eye"
                          >
                            <FaEye size={20} />
                          </a>
                        )}
                      </div>
 
                    </div>
                  </div>
                )}

                <div className="form-row fullwidth button-row">
                  <button type="submit">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default SponsorProfile;
