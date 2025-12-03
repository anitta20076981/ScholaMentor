import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Sidebar from "../../components/sponsor/Sidebar";
import TopBar from "../../components/sponsor/TopBar";
import Footer from "../../components/sponsor/Footer";

import "./SponsorDashboard.css";
import { useParams, useNavigate } from "react-router-dom"; // use parameter from url


function SponsorDashboard() {
  const { sponsorId } = useParams(); // define studentid
  const [recommendedStudents, setRecommendedStudents] = useState([]);
  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/sponsor/recommended-students`);
      console.log(res.data);
        setRecommendedStudents(res.data); // assuming the API returns an array of students
      } catch (err) {
        console.error("Failed to fetch recommended students:", err);
      }
    };
    fetchRecommended();
  }, []);

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

      <Sidebar sponsorId={sponsorId} /> 

      <div className="content">
        <TopBar sponsorId={sponsorId} />

        {/* HERO SLIDER */}
        <section className="hero-slider">
          <Slider {...settings}>
            <div>
              <img src="/sponsorship_banner1.jpg" className="slider-img" alt="slide1" />
            </div>
            <div>
              <img src="/sponsorship_banner2.jpg" className="slider-img" alt="slide2" />
            </div>
            <div>
              <img src="/sponsorship_banner3.jpg" className="slider-img" alt="slide3" />
            </div>
          </Slider>
          <div className="hero-text">
            <h1>Empower Students Through Sponsorship</h1>
            <p>Support talented students, contribute to education, and change lives.</p>
            <button onClick={() => {
                const element = document.getElementById("recommended-students");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
            Explore Students
            </button>
          </div>
        </section>

        {/* RECOMMENDED STUDENTS */}
        
        <section id="recommended-students" className="recommend-section">
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
                  <button className="sponsor-btn">View Details</button>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-students">
              No recommended students exist.
            </div>
          )}
        </section>


        <Footer />
      </div>
    </div>
  );
}
export default SponsorDashboard;