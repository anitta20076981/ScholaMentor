import { useState, useEffect } from "react";
import { useParams,useNavigate } from "react-router-dom";
import TopBar from "../../components/student/TopBar";
import Footer from "../../components/student/Footer";
import axios from "axios";
import "./SponsorshipHistory.css";
import Swal from "sweetalert2";

function SponsorshipHistory() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [approvedOrRejectApplications, setApprovedOrRejectApplications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [remainingAmount, setRemainingAmount] = useState("");
  const [currentApplicationId, setCurrentApplicationId] = useState(null);
  

  useEffect(() => {
    const fetchApprovedOrRejectedApplications = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/student/get-all-approved-or-rejected-sponsorship/${studentId}`
        );
        setApprovedOrRejectApplications(res.data);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      }
    };
    fetchApprovedOrRejectedApplications();
  }, [studentId]);

  const openModal = (application) => {
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

      // Refresh applications
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

      {/* Hero Section with cards overlay */}
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
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "50px 40px",
          textAlign: "center",
        }}
      >
        {/* Title */}
        <h1 style={{ color: "white", marginBottom: "10px", fontSize: "36px" }}>
          My Sponsorship
        </h1>

        {/* Subtitle */}
        <h3 style={{ color: "white", fontWeight: "400", marginBottom: "30px", fontSize: "20px" }}>
          Track all your sponsorship requests and see their status
        </h3>

        {/* Cards container */}
        <div className="card-grid">
          {approvedOrRejectApplications.map((application, i) => (
            <div className="student-card" key={i}>
              <div className="student-image"></div>
              <div className="card-info">
                <h3>{application.student_name}</h3>
                <p><strong>Purpose:</strong> {application.purpose}</p>
                <p><strong>Request Amount:</strong> {application.required_amount}</p>
                <p><strong>Approved Amount:</strong> {application.approved_amount}</p>
              </div>

              {application?.status === "ApprovedBySponsor" && application?.approval_type === "Full" && (
                <button className="sponsorship-approve-btn">
                  Full Sponsorship ({application.approved_amount})
                </button>
              )}

              {application?.status === "ApprovedBySponsor" && application?.approval_type === "Partial" && (
                <>
                  <button className="sponsorship-approve-btn">
                    Partial Sponsorship ({application.approved_amount})
                  </button>
                  {application?.remaining_requested === "No" && (
                    <button className="request-remaining-btn" onClick={() => openModal(application)}>
                      Request Remaining Amount ({application.required_amount - application.approved_amount})
                    </button>
                  )}                
                  
                </>
              )}
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
            <p>Do you want to request remaing amount ? </p>
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

      <Footer />
    </div>
  );
}

export default SponsorshipHistory;
