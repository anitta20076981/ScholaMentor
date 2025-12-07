import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TopBar from "../../components/student/TopBar";
import Footer from "../../components/student/Footer";
import axios from "axios";
import "./MentorsList.css";
import Swal from "sweetalert2";
import { socket } from "../../components/student/socket";
function MentorList() {
    const { studentId } = useParams();
    const [showModal, setShowModal] = useState(false);
    const [mentors, setMentors] = useState([]);
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [mentorshipRequests, setMentorshipRequests] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState("");
    const [chatMentorId, setChatMentorId] = useState(null);

        // Join student's room
    useEffect(() => {
        socket.emit("join_room", studentId);

        socket.on("receive_message", (msg) => {
            setChatMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.off("receive_message");
        };
    }, [studentId]);


    const startChatWithMentor = async (mentorId) => {
    setChatMentorId(mentorId);

    try {
        const res = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/chat/messages/${studentId}/${mentorId}`
        );
        setChatMessages(res.data); // load old messages
    } catch (err) {
        console.error("Failed to fetch old messages:", err);
        setChatMessages([]); // fallback
    }
};

    const sendChatMessage = () => {
        if (!chatInput || !chatMentorId) return;

        const msgData = {
            senderId: studentId,
            receiverId: chatMentorId,
            message: chatInput,
            timestamp: new Date(),
        };

        socket.emit("send_message", msgData);
        setChatMessages((prev) => [...prev, msgData]); // add locally
        setChatInput("");
    };

    const submitMentorshipRequest = async () => {
        if (selectedSubjects.length === 0) {
            Swal.fire("Error", "Please select at least one subject.", "error");
            return;
        }

        try {
            await axios.post(
            `${process.env.REACT_APP_API_URL}/api/student/request-mentorship/${studentId}/${selectedMentor.mentor_id}`,
                {
                    subjectIds: selectedSubjects, 
                }
            );
            Swal.fire({
                    title: "Success!",
                    text: "Mentorship request sent successfully!",
                    icon: "success",
                    confirmButtonText: "OK"
                }).then(() => {
                    window.location.reload();

            });
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
                setMentors(res.data);           

            } catch (err) {
                console.error("Failed to fetch applications:", err);
            }
        };
        const fetchMentorshipRequests = async () => {
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/student/get-mentorship-requests/${studentId}`
                );
                console.log(res.data);
                setMentorshipRequests(res.data);
            } catch (err) {
               console.error("Failed to fetch mentorship requests:", err);
            }
        };

    fetchMentorshipRequests();
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
                disabled={mentorshipRequests.some(req => req.mentor_id === m.mentor_id)}
                style={{
                    marginTop: "10px",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    background: mentorshipRequests.some(req => req.mentor_id === m.mentor_id && req.status === "approved")
                    ? "#28a745" // green
                    : mentorshipRequests.some(req => req.mentor_id === m.mentor_id && req.status === "pending")
                    ? "#ccc" // gray
                    : mentorshipRequests.some(req => req.mentor_id === m.mentor_id && req.status === "rejected")
                    ? "#dc3545" // red
                    : "#2d6cdf", // blue for new request
                    color: "white",
                    border: "none",
                    cursor: mentorshipRequests.some(req => req.mentor_id === m.mentor_id) ? "not-allowed" : "pointer",
                    width: "100%",
                }}
                onClick={() => openRequestModal(m)}
                >
                {mentorshipRequests.some(req => req.mentor_id === m.mentor_id && req.status === "approved")
                    ? "Approved"
                    : mentorshipRequests.some(req => req.mentor_id === m.mentor_id && req.status === "pending")
                    ? "Request Submitted – Wait for Approval"
                    : mentorshipRequests.some(req => req.mentor_id === m.mentor_id && req.status === "rejected")
                    ? "Rejected"
                    : "Make Request"}
            </button>
            <button
    onClick={() => startChatWithMentor(m.mentor_id)}
    style={{
        marginTop: "10px",
        padding: "8px 16px",
        borderRadius: "6px",
        background: "#2d6cdf",
        color: "white",
        border: "none",
        width: "100%",
    }}
>
    Start Chat
</button>


                </div>
            ))}
            </div>
        </section>
{chatMentorId && (
    <div style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "300px",
        height: "400px",
        background: "#fff",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        zIndex: 1000
    }}>
        <div style={{ flex: 1, padding: "10px", overflowY: "auto" }}>
            {chatMessages.map((msg, idx) => (
                <div key={idx} style={{ marginBottom: "8px", textAlign: msg.senderId === studentId ? "right" : "left" }}>
                    <span style={{
                        display: "inline-block",
                        padding: "6px 10px",
                        borderRadius: "12px",
                        background: msg.senderId === studentId ? "#2d6cdf" : "#eee",
                        color: msg.senderId === studentId ? "#fff" : "#000"
                    }}>
                        {msg.message}
                    </span>
                </div>
            ))}
        </div>

        <div style={{ display: "flex", padding: "10px", gap: "6px" }}>
            <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a message..."
                style={{ flex: 1, padding: "6px 10px", borderRadius: "6px", border: "1px solid #ccc" }}
            />
            <button onClick={sendChatMessage} style={{ padding: "6px 12px", borderRadius: "6px", background: "#2d6cdf", color: "#fff", border: "none" }}>Send</button>
        </div>
    </div>
)}

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
