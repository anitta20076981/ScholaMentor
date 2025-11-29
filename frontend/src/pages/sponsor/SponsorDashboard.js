import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Sidebar from "../../components/sponsor/Sidebar";
import TopBar from "../../components/sponsor/TopBar";
import Footer from "../../components/sponsor/Footer";

import "./SponsorDashboard.css";

export default function SponsorDashboard() {
  const recommendedStudents = [
    { name: "Aiswarya P", course: "MSc Computer Science", score: "92%", need: "High Financial Need" },
    { name: "Rahul N", course: "B.Tech Mechanical", score: "88%", need: "Medium Financial Need" },
    { name: "Maria Thomas", course: "BA Economics", score: "95%", need: "High Financial Need" },
  ];

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
      <Sidebar />

      <div className="content">
        <TopBar />

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
          <div className="card-grid">
            {recommendedStudents.map((student, i) => (
              <div className="student-card" key={i}>
                <div className="student-image"></div>
                <div className="card-info">
                  <h3>{student.name}</h3>
                  <p><strong>Course:</strong> {student.course}</p>
                  <p><strong>Score:</strong> {student.score}</p>
                  <p><strong>Need:</strong> {student.need}</p>
                </div>
                <button className="sponsor-btn">Sponsor Now</button>
              </div>
            ))}
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
