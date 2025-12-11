import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Sidebar from "../../components/mentor/Sidebar";
import TopBar from "../../components/mentor/TopBar";
import Footer from "../../components/mentor/Footer";

import "./MentorDashboard.css";
import { useParams, useNavigate } from "react-router-dom"; // use parameter from url
 

function MentorDashboard() {
  const { mentorId } = useParams(); // define studentid
  const [recommendedStudents, setRecommendedStudents] = useState([]);
  const navigate = useNavigate();
  const [mentorStatus, setMentorStatus] = useState("");

 useEffect(() => {
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
}, [mentorId]);


  const settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
  };

  return (
    <div className="sponsor-wrapper">

      <Sidebar mentorId={mentorId} mentorStatus={mentorStatus}/> 

      <div className="content">
        <TopBar mentorId={mentorId} mentorStatus={mentorStatus} />


        {/* HERO SLIDER */}
        <section className="hero-slider">
          <Slider {...settings}>
            <div>
              <img src="/mentorship1.jpg" className="slider-img" alt="slide1" />
            </div>
            <div>
              <img src="/mentorship2.jpg" className="slider-img" alt="slide2" />
            </div>
            <div>
              <img src="/mentorship3.jpg" className="slider-img" alt="slide3" />
            </div>
            <div>
              <img src="/mentorship4.jpg" className="slider-img" alt="slide4" />
            </div>
          </Slider>
          {/* <div className="hero-text">
            <h1>Inspire Students Through Mentorship</h1>
            <p>Guide young minds, share your expertise, and help shape successful futures.</p>
            <button onClick={() => {
                const element = document.getElementById("recommended-students");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
            Explore Students
            </button>
          </div> */}
        </section>

        {/* RECOMMENDED STUDENTS */}
        
        {/* <section id="recommended-students" className="recommend-section">
          <h2>Recommended Students</h2>
          {recommendedStudents && recommendedStudents.length > 0 ? (
            <div className="card-grid">
              {recommendedStudents.map((student, i) => (
                <div className="student-card" key={i}>
                  <div className="student-image"></div>
                  <div className="card-info">
                    <h3>{student.student_name}</h3>
                    <p><strong>Email:</strong> {student.student_email}</p>
                    <p><strong>Course:</strong> {student.course}</p>
                    <p><strong>Score:</strong> {student.cgpa}</p>
                    <p><strong>Need:</strong> {student.background}</p>
                  </div>
                  <button className="sponsor-btn" onClick={() =>navigate(`/sponsor/get-student-request/${mentorId}/${student.id}`)}>View Details</button>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-students">
              No recommended students exist.
            </div>
          )}
        </section> */}


        <Footer />
      </div>
    </div>
  );
}
export default MentorDashboard;