import { Link } from "react-router-dom";
//for my information :Link component from the React Router library.Navigation without page reload(for the background image)
import "./MainPage.css";

function MainPage() {
  return (
    <div
      className="main-page"
      style={{
        backgroundImage: "url(/main_page_image.jpg)", 
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="buttons">
        <Link to="/login">
          <button>Login</button>
        </Link>
        <Link to="/register">
          <button>Register</button>
        </Link>
      </div>

      <div className="main-content">
        <h1>Welcome to ScholaMentor</h1>
        <p>
          Empowering students to learn, grow, and connect.  
          Register now to join our community and take the first step toward achieving your academic goals.
        </p>
      </div>
    </div>
  );
}

export default MainPage;
