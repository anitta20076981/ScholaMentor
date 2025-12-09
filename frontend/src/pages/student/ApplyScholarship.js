import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TopBar from "../../components/student/TopBar";
import Footer from "../../components/student/Footer";
import axios from "axios";
import { FaEye } from "react-icons/fa";
import Swal from "sweetalert2";

function ApplyScholarship() {
  const { studentId, type } = useParams();

  const [formData, setFormData] = useState({
    academic_percentage: "",
    attendance_percentage: "",
    marksheet_file: null,
    merit_reason: "",
    family_income: "",
    father_occupation: "",
    mother_occupation: "",
    dependents: "",
    income_certificate: null,
    need_reason: "",
    sport_name: "",
    level: "",
    team_or_individual: "",
    sports_certificate: null,
    coach_name: "",
    coach_contact: "",
    sports_reason: "",
    category_type: "",
    category_certificate: null,
    disability_certificate: null,
    scheme_reason: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  //this data is for change the tip when click on each scholarship options
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
          `${process.env.REACT_APP_API_URL}/api/student/getScholarship/${type}/${studentId}`,
        );
        setFormData((prev) => ({
          ...prev,
            academic_percentage: res.data.academic_percentage || "",
            attendance_percentage: res.data.attendance_percentage || "",
            merit_reason: res.data.merit_reason || "",
            marksheet_file: res.data.marksheet_file || "",         
            family_income: res.data.family_income || "",   
            father_occupation: res.data.father_occupation || "",   
            mother_occupation:res.data.mother_occupation || "",   
            dependents: res.data.dependents || "",   
            income_certificate: res.data.income_certificate || "",   
            need_reason: res.data.need_reason || "",   
            sport_name: res.data.sport_name || "",   
            level: res.data.level || "",   
            team_or_individual: res.data.team_or_individual || "",   
            sports_certificate: res.data.sports_certificate || "",   
            coach_name: res.data.coach_name || "",   
            coach_contact:res.data.coach_contact || "",   
            sports_reason: res.data.sports_reason || "",   
            category_type: res.data.category_type || "",   
            category_certificate:res.data.category_certificate || "",   
            disability_certificate: res.data.disability_certificate || "",   
            scheme_reason:res.data.scheme_reason || "",   
                     
          
          // add other fields if API returns them
        }));
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }
    fetchStudentScholarship();
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
        `${process.env.REACT_APP_API_URL}/api/student/apply_scholarship/${type}/${studentId}`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
       Swal.fire({
          title: "Success!",
          text: "Application submitted successfully,wait for admin approval!",
          icon: "success",
          confirmButtonText: "OK"
        }).then(() => {
            window.location.reload();
        });
    } catch (err) {
      console.error(err);
      const backendError =err.response?.data?.message || 
                          err.response?.data?.error || "Failed to submit application.";   

      setErrorMessage(backendError);
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };


  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "#f0f4ff" }}>
    <TopBar studentId={studentId} successMessage={successMessage} errorMessage={errorMessage} />

      {/* Hero Section */}
      <section style={{
        textAlign: "center",
        padding: "80px 20px",
        background: "linear-gradient(135deg, #2d6cdf 0%, #5590f5 100%)",
        color: "white",
      }}>
        <h1 style={{ fontSize: "42px", marginBottom: "15px" }}>
          Apply for Merit Scholarship
        </h1>
        <p style={{ fontSize: "18px", marginBottom: "40px" }}>
          Fill the form below to submit your Merit Scholarship application and boost your academic journey.
        </p>
      </section>

      {/* Form Section */}
      <section style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: "40px",
        padding: "50px 20px",
        flexWrap: "wrap",
      }}>
        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          style={{
            background: "#ffffff", // White background for form
            color: "#2d6cdf",      // Blue text
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
        {type === "merit" 
            ? "Merit Scholarship Application"
            : type === "Need-based" 
            ? "Need-Based Scholarship Application"
            : type === "sports"
            ? "Sports Scholarship Application"
            : "Special Scheme Scholarship Application"}
        </h2>

        {type === "merit" && (
        <>
            <label>
            Academic Percentage / CGPA
            <input
                type="number"
                step="0.01"
                placeholder="e.g., 88.50"
                name="academic_percentage"
                value={formData.academic_percentage}
                onChange={handleChange}
                style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginTop: "5px",
                }}
            />
            </label>

            <label>
            Attendance Percentage
            <input
                type="number"
                step="0.01"
                placeholder="e.g., 95.00"
                name="attendance_percentage"
                value={formData.attendance_percentage}
                onChange={handleChange}
                style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginTop: "5px",
                }}
            />
            </label>

            <div className="form-field" style={{ position: "relative" }}>
                <label>Upload Marksheet</label>
                <input
                    type="file"
                    name="marksheet_file"
                    onChange={handleChange}
                    style={{ paddingRight: formData.marksheet_file ? "30px" : "0" }}
                />
                {formData.marksheet_file && (
                    <a
                    href={`${process.env.REACT_APP_API_URL}/uploads/${formData.marksheet_file}`}
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

            <label>
            Reason / Explanation (Optional)
            <textarea
                placeholder="Write your reason..."
                name="merit_reason"
                value={formData.merit_reason}
                onChange={handleChange}
                style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                resize: "vertical",
                marginTop: "5px",
                }}
            />
            </label>
        </>
        )}

        {type === "Need-based" && (
        <>
            <label>
            Family Income
            <input
                type="number"
                step="0.01"
                placeholder="e.g., 50000"
                name="family_income"
                value={formData.family_income}
                onChange={handleChange}
                style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginTop: "5px",
                }}
            />
            </label>

            <label>
            Father's Occupation
            <input
                type="text"
                placeholder="Father's Occupation"
                name="father_occupation"
                value={formData.father_occupation}
                onChange={handleChange}
                style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginTop: "5px",
                }}
            />
            </label>

            <label>
            Mother's Occupation
            <input
                type="text"
                placeholder="Mother's Occupation"
                name="mother_occupation"
                value={formData.mother_occupation}
                onChange={handleChange}
                style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginTop: "5px",
                }}
            />
            </label>

            <label>
            Dependents
            <input
                type="number"
                placeholder="Number of family members"
                name="dependents"
                value={formData.dependents}
                onChange={handleChange}
                style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginTop: "5px",
                }}
            />
            </label>

            <label>
            Upload Income Proof
            <input
                type="file"
                name="income_certificate"
                onChange={handleChange}
                style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "none",
                marginTop: "5px",
                background: "#2d6cdf",
                color: "white",
                cursor: "pointer",
                }}
            />
            </label>

            <label>
            Reason for Applying
            <textarea
                placeholder="Write your reason..."
                name="need_reason"
                value={formData.need_reason}
                onChange={handleChange}
                style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                resize: "vertical",
                marginTop: "5px",
                }}
            />
            </label>
        </>
        )}

         {type === "sports" && (
        <>
            <label>
            Sport Name
            <input
                type="text"
                placeholder="Sport Name"
                name="sport_name"
                value={formData.sport_name}
                onChange={handleChange}
                style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginTop: "5px",
                }}
            />
            </label>

           <label>
            Level
            <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginTop: "5px",
                background: "white",
                cursor: "pointer",
                }}
            >
                <option value="">Select Level</option>
                <option value="District">District</option>
                <option value="State">State</option>
                <option value="National">National</option>
                <option value="International">International</option>
            </select>
            </label>


            <label>
                Team / Individual
                <input
                    type="text"
                    placeholder="Team / Individual"
                    name="team_or_individual"
                    value={formData.team_or_individual}
                    onChange={handleChange}
                    style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    marginTop: "5px",
                    }}
                />
            </label>

            <div className="form-field" style={{ position: "relative" }}>
                <label>Sports Certificate</label>
                <input
                    type="file"
                    name="sports_certificate"
                    onChange={handleChange}
                    style={{ paddingRight: formData.sports_certificate ? "30px" : "0" }}
                />
                {formData.sports_certificate && (
                    <a
                    href={`${process.env.REACT_APP_API_URL}/uploads/${formData.sports_certificate}`}
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

            <label>
                Coach Name
                <input
                    type="text"
                    placeholder="Coach Name"
                    name="coach_name"
                    value={formData.coach_name}
                    onChange={handleChange}
                    style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    marginTop: "5px",
                    }}
                />
            </label>

             <label>
                Coach Contact
                <input
                    type="text"
                    placeholder="Coach Contact"
                    name="coach_contact"
                    value={formData.coach_contact}
                    onChange={handleChange}
                    style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    marginTop: "5px",
                    }}
                />
            </label>

            <label>
            Sports Reason
            <textarea
                placeholder="Write your reason..."
                name="sports_reason"
                value={formData.sports_reason}
                onChange={handleChange}
                style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                resize: "vertical",
                marginTop: "5px",
                }}
            />
            </label>

        </>
        )}

         {type === "Special Scheme" && (
        <>
            <label>
            Category Type
            <input
                type="text"
                placeholder="Category Type"
                name="category_type"
                value={formData.category_type}
                onChange={handleChange}
                style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                marginTop: "5px",
                }}
            />
            </label>

            <div className="form-field" style={{ position: "relative" }}>
                <label>Category Certificate</label>
                <input
                    type="file"
                    name="category_certificate"
                    onChange={handleChange}
                    style={{ paddingRight: formData.category_certificate ? "30px" : "0" }}
                />
                {formData.category_certificate && (
                    <a
                    href={`${process.env.REACT_APP_API_URL}/uploads/${formData.category_certificate}`}
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
                <label>Disability Certificate</label>
                <input
                    type="file"
                    name="disability_certificate"
                    onChange={handleChange}
                    style={{ paddingRight: formData.disability_certificate ? "30px" : "0" }}
                />
                {formData.disability_certificate && (
                    <a
                    href={`${process.env.REACT_APP_API_URL}/uploads/${formData.disability_certificate}`}
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

            <label>
                Scheme Reason
                <textarea
                    placeholder="Write your reason..."
                    name="scheme_reason"
                    value={formData.scheme_reason}
                    onChange={handleChange}
                    style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    resize: "vertical",
                    marginTop: "5px",
                    }}
                />
            </label>

        </>
        )}


          <button
            type="submit"
            style={{
              padding: "14px 0",
              background: "#2d6cdf", // Blue button
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              marginTop: "10px",
              transition: "all 0.3s",
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            Submit Application
          </button>
        </form>

        
        {/* Info / Tips Card */}
        <div style={{
            background: "#2d6cdf",
            color: "white",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            flex: "1",
            minWidth: "250px",
            maxWidth: "400px",
            }}>
            <h3 style={{ marginBottom: "15px" }}>Tips to Apply Successfully</h3>
            <ul style={{ listStyle: "disc", paddingLeft: "20px", lineHeight: "1.6" }}>
                {tipsContent[type]?.map((tip, index) => (
                <li key={index}>{tip}</li>
                ))}
            </ul>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default ApplyScholarship;
