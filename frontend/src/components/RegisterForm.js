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
        console.log(res.data.user);
        const studentId = res.data.user.id;
        navigate(`/student/dashboard/${studentId}`);
      }
      // else if (res.data.user.type === "mentor") {
      //   navigate("/mentor-dashboard");
      // } else if (res.data.user.type === "sponsor") {
      //   navigate("/sponsor-dashboard");
      // } else if (res.data.user.type === "donor") {
      //   navigate("/donor-dashboard");
      // }
    } catch (err) {
      console.error(err);
      setMessage("Registration failed!");
    }
  };
return (
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
            <option value="donor">Donor</option>
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
  );
}

export default RegisterForm;