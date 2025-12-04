import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/mentor/Sidebar";
import TopBar from "../../components/mentor/TopBar";
import Footer from "../../components/mentor/Footer";
import { useParams } from "react-router-dom";
import "./MentorProfile.css";
import { FaEye } from "react-icons/fa";

function MentorProfile() {
  const { mentorId } = useParams();

  const [activeTab, setActiveTab] = useState("personal");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    address: "",
    expertise: "",
    qualification: "",
    experience: "",
    profile_photo: null,
    id_proof: null,
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchMentor() {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/mentor/get-details/${mentorId}`
        );

        setFormData((prev) => ({
          ...prev,
          fullName: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          gender: res.data.gender || "",
          dob: res.data.dob || "",
          address: res.data.address || "",
          expertise: res.data.expertise || "",
          qualification: res.data.qualification || "",
          experience: res.data.experience || "",
          id_proof: res.data.id_proof || "",
          profile_photo: res.data.profile_photo || "",
        }));
      } catch (e) {
        console.error("Error:", e);
      }
    }

    fetchMentor();
  }, [mentorId]);

  const handleChange = (e) => {
    const { name, files, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) data.append(key, formData[key]);
      });

      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/mentor/update/${mentorId}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        setSuccessMessage("Profile updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrorMessage("Failed to update profile.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Something went wrong.");
    }
  };

  return (
    <div className="mentor-wrapper">
      <Sidebar mentorId={mentorId} />
      <div className="content">
        <TopBar mentorId={mentorId} />

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

              <h2 className="profile-name">{formData.fullName}</h2>
              <p className="profile-email">{formData.email}</p>
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
                  className={activeTab === "professional" ? "active" : ""}
                  onClick={() => setActiveTab("professional")}
                >
                  Professional Info
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
                        <label>Full Name</label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-field">
                        <label>Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-field">
                        <label>Phone</label>
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
                        <label>DOB</label>
                        <input
                          type="date"
                          name="dob"
                          value={formData.dob?.split("T")[0] || ""}
                          onChange={handleChange}
                        />
                      </div>

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
                  </div>
                )}

                {/* PROFESSIONAL TAB */}
                {activeTab === "professional" && (
                  <div className="tab-content">
                    <div className="form-row">
                      <div className="form-field">
                        <label>Expertise</label>
                        <input
                          type="text"
                          name="expertise"
                          value={formData.expertise}
                          onChange={handleChange}
                          placeholder="Ex: AI, Math, Web Development"
                        />
                      </div>

                      <div className="form-field">
                        <label>Qualification</label>
                        <input
                          type="text"
                          name="qualification"
                          value={formData.qualification}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-field">
                        <label>Experience (Years)</label>
                        <input
                          type="number"
                          name="experience"
                          value={formData.experience}
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
                        <label>ID Proof</label>
                        <input type="file" name="id_proof" onChange={handleChange} />
                        {formData.id_proof && (
                          <a
                            href={`${process.env.REACT_APP_API_URL}/uploads/${formData.id_proof}`}
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

export default MentorProfile;
