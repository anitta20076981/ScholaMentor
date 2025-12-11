import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/mentor/Sidebar";
import TopBar from "../../components/mentor/TopBar";
import Footer from "../../components/mentor/Footer";
import { useParams } from "react-router-dom";
import "./MentorStudentRequest.css";
import Chat from "../../components/mentor/Chat";
import { socket } from "../../components/student/socket";

function MentorProfile() {
  const { mentorId } = useParams();
 

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [studentRequest, setStudentRequest] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [unreadMsgs, setUnreadMsgs] = useState({});
  const [mentorStatus, setMentorStatus] = useState("");

  useEffect(() => {
  // Join mentor room for real-time
  socket.emit("join_room", mentorId);

  // Listen for messages from students
  socket.on("receive_message", (msg) => {
    // If chat is not open with this student, mark as unread
    if (!selectedStudent || selectedStudent.id !== msg.senderId) {
      setUnreadMsgs((prev) => ({ ...prev, [msg.senderId]: true }));
    }
  });

  return () => {
    socket.off("receive_message");
  };
}, [mentorId, selectedStudent]);

  useEffect(() => {
    const fetchMentorRequest = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/mentor/get-all-student-mentor-requests/${mentorId}`
        );

        setStudentRequest(res.data); 
      } catch (err) {
        console.error("Failed to fetch recommended students:", err);
      }
    };
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
    fetchMentorRequest();
  }, [mentorId]);

 
// Function called when clicking "Start Chat"
  const handleStartChat = (student) => {
    setSelectedStudent({
      id: student.student_id,
      name: student.student_name
    });
    // Clear unread notification for this student
  setUnreadMsgs((prev) => ({ ...prev, [student.student_id]: false }));
  };
 


  return (
    <div className="mentor-wrapper">
      <Sidebar mentorId={mentorId}  mentorStatus={mentorStatus}/>
      <div className="content">
        <TopBar
          mentorId={mentorId}
          successMessage={successMessage}
          errorMessage={errorMessage}  mentorStatus={mentorStatus}
        />

        {/* HERO / INTRO TEXT */}
        <section className="mentor-hero">
          <h1>Empower Students Through Mentorship</h1>
          <p>Share your knowledge, guide students, and make a lasting impact on their future.</p>
        </section>
        {/* STUDENT REQUESTS (DUMMY TEMPLATE) */}
        <section className="mentor-requests">
        <h2>Student Mentor Requests</h2>

                {studentRequest.length === 0 ? (
            <p>No requests found.</p>
          ) : (
            studentRequest.map((request) => (
              <div key={request.student_id + '-' + request.subject_id} className="request-card">
                <h3>{request.student_name}</h3>
                <p><strong>Email:</strong> {request.student_email || 'Not available'}</p>
                <p><strong>Subjects:</strong> {request.subjects}</p>
                <p><strong>Status:</strong> {request.status}</p>
                <p><strong>Date:</strong> {new Date(request.request_date).toLocaleDateString()}</p>

                <div className="actions">
                   <button
                    className="accept-btn"
                    onClick={() => handleStartChat(request)}
                    style={{ position: "relative" }}
                  >
                    Start Chat
                    {unreadMsgs[request.student_id] && (
                      <span style={{
                        position: "absolute",
                        top: "-5px",
                        right: "-5px",
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        background: "red",
                      }}></span>
                    )}
                  </button>
                      
                    <button className="reject-btn">Reject</button>
                </div>
              </div>
            ))
          )}
          {/* Render Chat component if a student is selected */}
          {selectedStudent && (
            <Chat
              userId={mentorId}               
              receiverId={selectedStudent.id}   
              receiverName={selectedStudent.name}  
            />
            
          )}
        </section>
        <Footer />
      </div>
    </div>
  );
}

export default MentorProfile;
