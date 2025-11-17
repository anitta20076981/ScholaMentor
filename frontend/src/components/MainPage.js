import { Link } from "react-router-dom";

function MainPage() {
  return (
    <div>
      <h1>Welcome to ScholaMentor</h1>
      <Link to="/login">
        <button>Login</button>
      </Link>
      <Link to="/register">
        <button>Register</button>
      </Link>
    </div>
  );
}

export default MainPage;
