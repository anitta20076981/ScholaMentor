import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";

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
      } else if (res.data.role === "student") {
        navigate("/student/dashboard");
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
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default LoginForm;
