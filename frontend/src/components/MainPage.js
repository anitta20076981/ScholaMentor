import { Link } from "react-router-dom";
import "./MainPage.css";

function MainPage() {
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="main-pages"
      style={{
        backgroundImage: "url(/still-life-paper-chains-decoration.jpg)", 
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Top navigation */}
      <div className="top-navigation">
        <div className="logo">ScholaMentor</div>
        <div className="nav-buttons-main">
          <button onClick={() => scrollToSection("about")}>About Us</button>
          <button onClick={() => scrollToSection("services")}>Services</button>
          <button onClick={() => scrollToSection("who")}>Who We Are</button>
          <Link to="/login">
            <button>Login</button>
          </Link>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content-main">
        <h1>Welcome to ScholaMentor</h1>
        <p>
          Connecting <strong>students, mentors, and sponsors</strong> to achieve academic excellence.  
          Students can find guidance, sponsors can support education, and mentors can share their expertise.  
          Join us today and be part of this learning community.
        </p>
      </div>

      {/* About Us Section */}
      <section id="about">
        <h2>About Us</h2>
        <p>
          ScholaMentor is a platform dedicated to empowering students through mentorship and financial support. 
          We create opportunities for students to connect with mentors and sponsors who are passionate about education.
        </p>
      </section>

      {/* Services Section */}
      <section id="services">
        <h2>Our Services</h2>
        <div className="service-cards-main">
          <div className="card-main">
            <h3>For Students</h3>
            <p>Get mentorship, access scholarships, and participate in workshops to grow academically and professionally.</p>
          </div>
          <div className="card-main">
            <h3>For Sponsors</h3>
            <p>Support deserving students financially and help them achieve their educational goals.</p>
          </div>
          <div className="card-main">
            <h3>For Mentors</h3>
            <p>Share your expertise, guide students, and contribute to their success while growing your network.</p>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section id="who">
        <h2>Who We Are</h2>
        <p>
          We are a team of educators, industry professionals, and students committed to building a collaborative learning ecosystem.
          Our mission is to empower education through mentorship and sponsorship, creating opportunities for everyone.
        </p>
      </section>
    </div>
  );
}

export default MainPage;
