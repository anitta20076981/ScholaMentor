import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import "./LoginForm.css"; 

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
 
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
            
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
            { email, password }
      );

      setMessage(res.data.message); 
      if (res.data.role === "admin") {
        navigate("/admin/dashboard"); // redirect admin
      } else if (res.data.role === "student") {// redirect student
        navigate(`/student/dashboard/${res.data.id}`);
      }
      else if (res.data.role === "sponsor") {// redirect sponsor
        navigate(`/sponsor/dashboard/${res.data.id}`);
      } else if (res.data.role === "mentor") {// redirect mentor
        navigate(`/mentor/dashboard/${res.data.id}`);

      }

    } catch (err) {
      console.error(err);

      if (err.response && err.response.data.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Login failed!");
      }
    }
  };

 return (
  <div>
  <div
  style={{
    width: "97%",
    background: "#2d6cdf",
    padding: "12px 25px",
    display: "flex",
    justifyContent: "space-between",  
    alignItems: "center",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 1000,
  }}
>
  <h2
  onClick={() => navigate("/")}  
    style={{
      margin: 0,
      color: "white",
      fontSize: "22px",
      fontWeight: "700",
      letterSpacing: "1px",
    }}
  >
    Scholamentor
  </h2>

  {/* RIGHT SIDE BUTTONS */}
  <div style={{ display: "flex", gap: "15px" }}>
    <button
      onClick={() => navigate("/")}
      style={{
        background: "white",
        color: "#2d6cdf",
        border: "none",
        padding: "8px 14px",
        borderRadius: "8px",
        fontWeight: "600",
        cursor: "pointer",
      }}
    >
      Main Page
    </button>

    <button
      onClick={() => navigate("/register")}
      style={{
        background: "#ffffff",
        color: "#2d6cdf",
        border: "none",
        padding: "8px 14px",
        borderRadius: "8px",
        fontWeight: "600",
        cursor: "pointer",
      }}
    >
      Register
    </button>
  </div>
</div>


    {/* 🔵 LOGIN CONTENT */}
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />
          <button type="submit" className="login-button">Login</button>
        </form>
        {message && <p className="login-message">{message}</p>}
      </div>
    </div>
  </div>


  );
}

export default LoginForm;
