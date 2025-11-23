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

      } else {
        
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
  );
}

export default LoginForm;
