import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/mentor/Sidebar";
import TopBar from "../../components/mentor/TopBar";
import Footer from "../../components/mentor/Footer";
import { useParams } from "react-router-dom";
import "./MentorProfile.css";
import { FaEye } from "react-icons/fa";
import Swal from "sweetalert2";

function MentorProfile() {
  const { mentorId } = useParams();
  const [activeTab, setActiveTab] = useState("personal");

  const [formData, setFormData] = useState({
    // fullName: "",
    // email: "",
    phone_number: "",
    address: "",
    gender: "",
    dob: "",
    address: "",
    current_job_title: "",
    company: "",
    years_of_experience: "",
    industry: "",
    short_bio: "",
    linkedin_profile: "",
    // subjects: "",
    subjects: [],
    skills: "",
    days_available: [],
    time_slots: "",
    profile_photo: null,
    resume: null,
    certificates: null,
    id_proof: null,
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [allSubjects, setAllSubjects] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);
  const [mentorStatus, setMentorStatus] = useState("");

  useEffect(() => {
    async function fetchMentor() {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/mentor/get-details/${mentorId}`
        );
        const data = res.data;

        setFormData((prev) => ({
          ...prev,
        //   fullName: data.name || "",
        //   email: data.email || "",
          phone_number: data.phone_number || "",
          gender: data.gender || "",
          address: data.address || "",
          address: data.address || "",
          current_job_title: data.current_job_title || "",
          company: data.company || "",
          years_of_experience: data.years_of_experience || "",
          industry: data.industry || "",
          short_bio: data.short_bio || "",
          linkedin_profile: data.linkedin_profile || "",
          subjects: data.subjects || [],
          skills: data.skills || "",
          days_available: data.days_available ? data.days_available.split(",") : [],
          time_slots: data.time_slots || "",
          profile_photo: data.profile_photo || null,
          resume: data.resume || null,
          certificates: data.certificates || null,
          id_proof: data.id_proof || null,
        }));

      const resSubjects = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/mentor/get-subjects`
      );
      console.log(resSubjects.data);
      setSubjectsList(resSubjects.data)

      } catch (e) {
        console.error("Error fetching mentor details:", e);
      }
    }

    const fetchMentorAndRecommended = async () => {
    try {
      // Get recommended students
      // const resStudents = await axios.get(`${process.env.REACT_APP_API_URL}/api/sponsor/recommended-students`);
      // setRecommendedStudents(resStudents.data);

      // Get mentor details
      const resMentor = await axios.get(`${process.env.REACT_APP_API_URL}/api/mentor/get-details/${mentorId}`);
      setMentorStatus(resMentor.data.status);  

    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };
  fetchMentorAndRecommended();
  fetchMentor();
  }, [mentorId]);

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



  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setSuccessMessage("");
  //   setErrorMessage("");

  //   try {
  //     const data = new FormData();
  //     Object.keys(formData).forEach((key) => {
  //       if (formData[key] !== null) data.append(key, formData[key]);
  //     });

  //     const res = await axios.put(
  //       `${process.env.REACT_APP_API_URL}/api/mentor/update/${mentorId}`,
  //       data,
  //       { headers: { "Content-Type": "multipart/form-data" } }
  //     );

  //     if (res.data.success) {
  //       setSuccessMessage("Profile updated successfully!");
  //       setTimeout(() => setSuccessMessage(""), 3000);
  //     } else {
  //       setErrorMessage("Failed to update profile.");
  //       setTimeout(() => setErrorMessage(""), 3000);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     setErrorMessage("Something went wrong.");
  //     setTimeout(() => setErrorMessage(""), 3000);
  //   }
  // };

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
      `${process.env.REACT_APP_API_URL}/api/mentor/update/${mentorId}`,
      data,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    if (res.data.success) {
      // setSuccessMessage("Profile updated successfully!");
      // setTimeout(() => setSuccessMessage(""), 3000);
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
      <Sidebar mentorId={mentorId} mentorStatus={mentorStatus}/>
      <div className="content">
        <TopBar
          mentorId={mentorId}
          successMessage={successMessage}
          errorMessage={errorMessage} mentorStatus={mentorStatus}
        />

        {/* HERO / INTRO TEXT */}
        <section className="mentor-hero">
          <h1>Empower Students Through Mentorship</h1>
          <p>Share your knowledge, guide students, and make a lasting impact on their future.</p>
        </section>

        {/* PROFILE FORM */}
        <div className="profile-main">
          {/* LEFT SIDE PROFILE CARD */}
           

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
                      {/* <div className="form-field">
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
                      </div> */}

                      <div className="form-field">
                        <label>Phone Number</label>
                        <input
                          type="text"
                          name="phone_number"
                          value={formData.phone_number}
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
                  </div>
                )}

                {/* PROFESSIONAL TAB */}
                {activeTab === "professional" && (
                  <div className="tab-content">
                    <div className="form-row">
                      <div className="form-field">
                        <label>Current Job Title</label>
                        <input
                          type="text"
                          name="current_job_title"
                          value={formData.current_job_title}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-field">
                        <label>Company / Organization</label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-field">
                        <label>Years of Experience</label>
                        <input
                          type="number"
                          name="years_of_experience"
                          value={formData.years_of_experience}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-field">
                        <label>Industry</label>
                        <input
                          type="text"
                          name="industry"
                          value={formData.industry}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-field">
                        <label>Short Bio / About Me</label>
                        <textarea
                          name="short_bio"
                          value={formData.short_bio}
                          rows={3}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-field">
                        <label>LinkedIn Profile</label>
                        <input
                          type="text"
                          name="linkedin_profile"
                          value={formData.linkedin_profile}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-field">
                        <label>Subjects You Can Teach</label>
                       <select
  name="subjects"
  multiple
  value={formData.subjects} // this must be an array
  onChange={handleChange}
>
  {subjectsList.map(subject => (
    <option key={subject.id} value={subject.id}>
      {subject.name}
    </option>
  ))}
</select>
                      </div>
                      <div className="form-field">
                        <label>Skills They Can Mentor In</label>
                        <input
                          type="text"
                          name="skills"
                          value={formData.skills}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                       <div className="form-field">
                        <label>Days Available (Mon–Sun)</label>
                        <select
                          name="days_available"
                          multiple
                          value={formData.days_available}  
                          onChange={handleChange}
                        >
                          <option value="Sunday">Sunday</option>
                          <option value="Monday">Monday</option>
                          <option value="Tuesday">Tuesday</option>
                          <option value="Wednesday">Wednesday</option>
                          <option value="Thursday">Thursday</option>
                          <option value="Friday">Friday</option>
                          <option value="Saturday">Saturday</option>
                        </select>
                      </div>

                      <div className="form-field">
                        <label>Time Slots (e.g., 5 PM – 9 PM)</label>
                        <input
                          type="text"
                          name="time_slots"
                          value={formData.time_slots}
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
                        <label>Resume</label>
                        <input type="file" name="resume" onChange={handleChange} />
                        {formData.resume && (
                          <a
                            href={`${process.env.REACT_APP_API_URL}/uploads/${formData.resume}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="icon-eye"
                          >
                            <FaEye size={20} />
                          </a>
                        )}
                      </div>

                      <div className="form-field" style={{ position: "relative" }}>
                        <label>Certificates</label>
                        <input type="file" name="certificates" onChange={handleChange} />
                        {formData.certificates && (
                          <a
                            href={`${process.env.REACT_APP_API_URL}/uploads/${formData.certificates}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="icon-eye"
                          >
                            <FaEye size={20} />
                          </a>
                        )}
                      </div>

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
