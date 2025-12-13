import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import "./RegisterForm.css";

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
          { 
            name,
            email,
            password,
            type, 
        });
      
      setMessage(res.data.message); 
      setUser(res.data.user);
      if (res.data.user.type === "student") {
        const studentId = res.data.user.id;
        navigate(`/student/dashboard/${studentId}`);
      }else if(res.data.user.type === "sponsor"){
        const sponsorId = res.data.user.id;
        navigate(`/sponsor/dashboard/${sponsorId}`);
      }
      else if (res.data.user.type === "mentor") {
        const mentorId = res.data.user.id;
        navigate(`/mentor/dashboard/${mentorId}`);
      } 
       
    } catch (err) {
      console.error(err);
      // setMessage("Registration failed!");
      if (err.response && err.response.data && err.response.data.message) {
      setMessage(err.response.data.message);
      } else {
        setMessage("Registration failed!");
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
      onClick={() => navigate("/login")}
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
      Login
    </button>
    </div>
    </div>
    <div className="register-page">
      <div className="register-card">

        <h2 className="register-title">Register</h2>

        <form onSubmit={handleRegister}>

          <input
            type="text"
            className="register-input"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            className="register-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="register-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <select
            className="register-input"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="">Select type</option>
            <option value="student">Student</option>
            <option value="mentor">Mentor</option>
            <option value="sponsor">Sponsor</option>
          </select>

          <button type="submit" className="register-button">
            Register
          </button>

        </form>

        <p className="register-message">{message}</p>

        {user && (
          <div className="register-details">
            <p>ID: {user.id}</p>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Type: {user.type}</p>
          </div>
        )}

      </div>
    </div>
  </div>

  );
}

export default RegisterForm;