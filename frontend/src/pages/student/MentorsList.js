import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TopBar from "../../components/student/TopBar";
import Footer from "../../components/student/Footer";
import axios from "axios";
import "./MentorsList.css";
import Swal from "sweetalert2";

function MentorList() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [approvedOrRejectApplications, setApprovedOrRejectApplications] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [remainingAmount, setRemainingAmount] = useState("");
  const [currentApplicationId, setCurrentApplicationId] = useState(null);
  const [activeSponsorshipExists, setActiveSponsorshipExists] = useState(false);
  const [mentors, setMentors] = useState([]);

  // ⭐ Mentors List with Images
//   const mentors = [
//     {
//       name: "Dr. Sarah Malik",
//       expertise: "Career Guidance",
//       image: `${process.env.PUBLIC_URL}/mentors/mentor1.jpg`,
//     },
//     {
//       name: "John Peterson",
//       expertise: "Software Engineering",
//       image: `${process.env.PUBLIC_URL}/mentors/mentor2.jpg`,
//     },
//     {
//       name: "Aisha Khan",
//       expertise: "Business Strategy",
//       image: `${process.env.PUBLIC_URL}/mentors/mentor3.jpg`,
//     },
//     {
//       name: "David Liu",
//       expertise: "Entrepreneurship",
//       image: `${process.env.PUBLIC_URL}/mentors/mentor4.jpg`,
//     },
//   ];

 

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

  const openModal = (application) => {
    if (activeSponsorshipExists) {
      Swal.fire({
        icon: "warning",
        title: "Action Not Allowed",
        text: "You already have an active sponsorship application. You cannot request the remaining amount now.",
        confirmButtonText: "OK",
      });
      return;
    }

    setCurrentApplicationId(application.id);
    setRemainingAmount(application.required_amount - application.approved_amount);
    setShowModal(true);
  };

  const submitRemainingAmount = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/student/request_remaining_amount/${studentId}`,
        { applicationId: currentApplicationId, remainingAmount }
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Remaining amount requested successfully!",
      });

      setShowModal(false);
      navigate(`/student/apply-sponsorship/${studentId}`);

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/student/get-all-approved-or-rejected-sponsorship/${studentId}`
      );
      setApprovedOrRejectApplications(res.data);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to request remaining amount.",
      });
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "#f8f9ff" }}>
      <TopBar studentId={studentId} />

      {/* Hero Section */}
      <section
        className="hero-section"
        style={{
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
                    }}
                >
                    Make Request
                </button>
                </div>
            ))}
            </div>
        </section>


        {/* Modal */}
        {showModal && (
            <div
            style={{
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
                <h3>Request Remaining Amount</h3>
                <p>Do you want to request the remaining amount?</p>

                <input
                type="number"
                readOnly
                value={remainingAmount}
                onChange={(e) => setRemainingAmount(e.target.value)}
                style={{
                    width: "100%",
                    padding: "10px",
                    marginBottom: "15px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                }}
                />

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                    onClick={() => setShowModal(false)}
                    style={{ padding: "10px 20px", borderRadius: "6px" }}
                >
                    No
                </button>

                <button
                    onClick={submitRemainingAmount}
                    style={{
                    padding: "10px 20px",
                    borderRadius: "6px",
                    background: "#d9534f",
                    color: "#fff",
                    border: "none",
                    }}
                >
                    Yes
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
