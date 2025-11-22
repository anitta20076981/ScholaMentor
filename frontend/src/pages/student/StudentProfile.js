import React, { useState, useEffect } from "react";
import axios from "axios";
import TopBar from "../../components/student/TopBar";
import Footer from "../../components/student/Footer";
import { useParams } from "react-router-dom";
import "../../pages/student/studentProfile.css";
import { FaEye } from "react-icons/fa";

function StudentProfile() {
  const { studentId } = useParams();
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    pincode: "",
    school_or_college: "",
    course: "",
    department: "",
    year: "",
    cgpa: "",
    family_income: "",
    profile_photo: null,
    id_proof: null,
    address_proof: null,
    marksheet: null,
    income_proof: null,
    
  });
  const [successMessage, setSuccessMessage] = useState(""); // <-- new state
  const [errorMessage, setErrorMessage] = useState(""); // optional for errors
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/student/getDetails/${studentId}`
        );
        setFormData((prev) => ({
          ...prev,
          fullName: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          gender: res.data.gender || "",
          dob: res.data.dob || "",
          address: res.data.address || "",
          school_or_college: res.data.school_or_college || "",
          course: res.data.course || "",
          department: res.data.department || "",
          year: res.data.year || "",
          cgpa: res.data.cgpa || "",
          family_income: res.data.family_income || "",
          id_proof: res.data.id_proof || "",
          address_proof: res.data.address_proof || "",
          marksheet: res.data.marksheet || "",
          income_proof: res.data.income_proof || "",
          profile_photo: res.data.profile_photo || "",
          pincode: res.data.pincode || "",
          
          
          // add other fields if API returns them
        }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(""); // reset previous messages
    setErrorMessage("");

    try {
      const data = new FormData(); // For file upload
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) data.append(key, formData[key]);
      });

      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/student/update/${studentId}`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.success) {
        setSuccessMessage("Profile updated successfully!"); // <-- show success
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);

      } else {
        setErrorMessage("Failed to update profile.");
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to update profile.");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

  return (
    
    <div className="profile-page">
      <TopBar studentId={studentId}/>

      <div className="profile-main">
        {/* Sidebar */}
        <div className="profile-sidebar">
          <div className="profile-card">
         <div className="avatar-wrapper">
            {formData.profile_photo ? (
              typeof formData.profile_photo === "object" ? (
                <img
                  src={URL.createObjectURL(formData.profile_photo)}
                  alt="Profile"
                  className="avatar"
                />
              ) : (
                <img
                src={`${process.env.REACT_APP_API_URL}/uploads/${formData.profile_photo}`}
                  alt="Profile"
                  className="avatar"
                />
              )
            ) : (
              <img
                src="/avatar.jpg"
                alt="Default Avatar"
                className="avatar"
              />
            )}

            <label htmlFor="profile_photo" className="edit-avatar-btn">
              &#9998;
            </label>
            <input
              type="file"
              id="profile_photo"
              name="profile_photo"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleChange}
            />
          </div>

            <h2 className="profile-name">{formData.fullName}</h2>
            <p className="profile-email">{formData.email}</p>
          </div>
        </div>

        {/* Content */}
        <div className="profile-content">
          <div className="tab-card">
            {/* Tabs */}
            <div className="tabs">
              <button
                className={activeTab === "personal" ? "active" : ""}
                onClick={() => setActiveTab("personal")}
              >
                Personal Info
              </button>
              <button
                className={activeTab === "school" ? "active" : ""}
                onClick={() => setActiveTab("school")}
              >
                School Info / Coolege Info
              </button>
              <button
                className={activeTab === "documents" ? "active" : ""}
                onClick={() => setActiveTab("documents")}
              >
                Documents
              </button>
             
            </div>

              {successMessage && (
                <div
                  style={{
                    background: "#d4edda",
                    color: "#155724",
                    padding: "10px",
                    borderRadius: "5px",
                    marginBottom: "15px",
                    textAlign: "center",
                    border: "1px solid #c3e6cb",
                  }}
                >
                  {successMessage}
                </div>
              )}

              {/* ---------------- ERROR MESSAGE ---------------- */}
              {errorMessage && (
                <div
                  style={{
                    background: "#f8d7da",
                    color: "#721c24",
                    padding: "10px",
                    borderRadius: "5px",
                    marginBottom: "15px",
                    textAlign: "center",
                    border: "1px solid #f5c6cb",
                  }}
                >
                  {errorMessage}
                </div>
              )}
            <form onSubmit={handleSubmit}>
             
              {/* Personal Info Tab */}
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
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob ? formData.dob.split('T')[0] : ''} // convert to YYYY-MM-DD
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
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                   <div className="form-field">
                    <label>Address</label>
                    <textarea
                      className="form-textarea"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Enter your address"
                    />
                  </div>
                  </div>
                 <div className="form-row">
                  <div className="form-field small-field">
                    <label>Pin</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                </div>
              )}

              {/* School Info Tab */}
              {activeTab === "school" && (
                <div className="tab-content">
                  <div className="form-row">
                    <div className="form-field">
                      <label>School / College Name</label>
                      <input
                        type="text"
                        name="school_or_college"
                        value={formData.school_or_college}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-field">
                      <label>Course</label>
                      <input
                        type="text"
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-field">
                      <label>Department</label>
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label>Year</label>
                      <input
                        type="text"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-field">
                      <label>CGPA</label>
                      <input
                        type="text"
                        name="cgpa"
                        value={formData.cgpa}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-field">
                      <label>Family Income</label>
                      <input
                        type="text"
                        name="family_income"
                        value={formData.family_income}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Documents Tab */}
              {activeTab === "documents" && (
              <div className="tab-content">
                {/* Row 1 */}
                <div className="form-row">
                  <div className="form-field" style={{ position: "relative" }}>
                    <label>ID Proof</label>
                    <input
                      type="file"
                      name="id_proof"
                      onChange={handleChange}
                      style={{ paddingRight: "30px" }}
                    />
                    {formData.id_proof && (
                      <a
                        href={`${process.env.REACT_APP_API_URL}/uploads/${formData.id_proof}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "70%",
                          transform: "translateY(-50%)",
                          color: "#007bff",
                          cursor: "pointer",
                        }}
                      >
                        <FaEye size={20} />
                      </a>
                    )}
                  </div>

                  <div className="form-field" style={{ position: "relative" }}>
                    <label>Address Proof</label>
                    <input
                      type="file"
                      name="address_proof"
                      onChange={handleChange}
                      style={{ paddingRight: formData.address_proof ? "30px" : "0" }}
                    />
                    {formData.address_proof && (
                      <a
                        href={`${process.env.REACT_APP_API_URL}/uploads/${formData.address_proof}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "70%",
                          transform: "translateY(-50%)",
                          color: "#007bff",
                          cursor: "pointer",
                        }}
                      >
                        <FaEye size={20} />
                      </a>
                    )}
                  </div>

                  <div className="form-field" style={{ position: "relative" }}>
                    <label>Marksheet</label>
                    <input
                      type="file"
                      name="marksheet"
                      onChange={handleChange}
                      style={{ paddingRight: formData.marksheet ? "30px" : "0" }}
                    />
                    {formData.marksheet && (
                      <a
                        href={`${process.env.REACT_APP_API_URL}/uploads/${formData.marksheet}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "70%",
                          transform: "translateY(-50%)",
                          color: "#007bff",
                          cursor: "pointer",
                        }}
                      >
                        <FaEye size={20} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Row 2 */}
                <div className="form-row">
                  <div className="form-field small-field" style={{ position: "relative" }}>
                    <label>Income Proof</label>
                    <input
                      type="file"
                      name="income_proof"
                      onChange={handleChange}
                      style={{ paddingRight: formData.income_proof ? "30px" : "0" }}
                    />
                    {formData.income_proof && (
                      <a
                        href={`${process.env.REACT_APP_API_URL}/uploads/${formData.income_proof}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          position: "absolute",
                          right: "-140px",
                          top: "70%",
                          transform: "translateY(-50%)",
                          color: "#007bff",
                          cursor: "pointer",
                        }}
                      >
                        <FaEye size={20} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
              )}

              {/* Save Button inside card for all tabs */}
              <div className="form-row fullwidth button-row">
                <button type="submit">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default StudentProfile;
