import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TopBar from "../../components/student/TopBar";
import Footer from "../../components/student/Footer";
import axios from "axios";
import "./MentorsList.css";
import Swal from "sweetalert2";

function MentorList() {
    const { studentId } = useParams();
    const [showModal, setShowModal] = useState(false);
    const [mentors, setMentors] = useState([]);
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
 
    const submitMentorshipRequest = async () => {
        if (selectedSubjects.length === 0) {
            Swal.fire("Error", "Please select at least one subject.", "error");
            return;
        }

        try {
            await axios.post(
            `${process.env.REACT_APP_API_URL}/api/student/request-mentorship/${studentId}/${selectedMentor.mentor_id}`,
                {
                    subjectIds: selectedSubjects, // array of selected subject IDs
                }
            );
            Swal.fire("Success", "Mentorship request sent!", "success");
            setShowModal(false);
        } catch (err) {
            Swal.fire("Error", "Failed to send request.", "error");
        }
    };
    useEffect(() => {
        const fetchAllMentors = async () => {
        try {
            const res = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/student/get-all-mentors`
            );
            console.log(res.data);
            setMentors(res.data);
        } catch (err) {
            console.error("Failed to fetch applications:", err);
        }
        };
        fetchAllMentors();
    }, [studentId]);

    const openRequestModal = (mentor) => {
    setSelectedMentor(mentor); // store the mentor object
    setSelectedSubjects([]); // reset subjects
    setShowModal(true);
    };

    return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "#f8f9ff" }}>
        <TopBar studentId={studentId} />

        {/* Hero Section */}
        <section className="hero-section" style={{
            position: "relative",
            width: "100%",
            minHeight: "400px",
            backgroundImage: `linear-gradient(rgba(10,12,15,0.5), rgba(11,11,11,0.5)), url(${process.env.PUBLIC_URL}/handshake.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            padding: "50px 40px",
        }}
        >
        <h1 style={{ color: "white", marginBottom: "10px", fontSize: "36px" }}>
            Mentors
        </h1>

        <h3 style={{ color: "white", fontWeight: "400", marginBottom: "30px", fontSize: "20px" }}>
            Track all your sponsorship requests and see their status
        </h3>
            
        <section style={{ padding: "50px 40px" }}>
            <h2 style={{ marginBottom: "25px" }}>Connect with Mentors</h2>
            <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",   
                gap: "20px",
            }}
            >
            {mentors.map((m, idx) => (
                <div
                key={idx}
                style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "15px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    textAlign: "center",
                }}
                >
                <img
                    src={m.image}
                    alt={m.name}
                    style={{
                    width: "100%",
                    height: "160px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    marginBottom: "15px",
                    }}
                />

                <h3 style={{ marginBottom: "5px" }}>{m.name}</h3>
                <p style={{ color: "#555" }}>
                {m.subjects && m.subjects.length > 0
                    ? m.subjects.map(sub => sub.name).join(", ")
                    : "No subjects"}
                </p>

                <button
                    style={{
                    marginTop: "10px",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    background: "#2d6cdf",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    width: "100%",
                    }} onClick={() => openRequestModal(m)}
                >
                    Make Request
                </button>
                </div>
            ))}
            </div>
        </section>

        {/* Modal */}
        {showModal && (
            <div  style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    }}
    onClick={() => setShowModal(false)}
    >
    <div
        style={{
        background: "#fff",
        padding: "30px",
        borderRadius: "12px",
        minWidth: "300px",
        maxWidth: "500px",
        }}
        onClick={(e) => e.stopPropagation()}
    >
        <h3>Request Mentorship</h3>
        <p><strong>Mentor:</strong> {selectedMentor.name}</p>

        <label>Select Subjects:</label>
        <select
        multiple
        value={selectedSubjects}
        onChange={(e) =>
            setSelectedSubjects(
            Array.from(e.target.selectedOptions, (option) => option.value)
            )
        }
        style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        >
        {selectedMentor.subjects.map((sub) => (
            <option key={sub.id} value={sub.id}>
            {sub.name}
            </option>
        ))}
        </select>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
        <button
            onClick={() => setShowModal(false)}
            style={{ padding: "10px 20px", borderRadius: "6px" }}
        >
            Cancel
        </button>

        <button
            onClick={submitMentorshipRequest}
            style={{
            padding: "10px 20px",
            borderRadius: "6px",
            background: "#2d6cdf",
            color: "#fff",
            border: "none",
            }}
        >
            Send Request
        </button>
        </div>
    </div>
    </div>
        )}
        </section>

        <Footer />
    </div>
    );
}

export default MentorList;
