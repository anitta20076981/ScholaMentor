import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

function MainPage() {
  const [page, setPage] = useState("home"); // home, login, register

  return (
    <div>
      {page === "home" && (
        <div>
          <h1>Welcome to ScholaMentor</h1>
          <button onClick={() => setPage("login")}>Login</button>
          <button onClick={() => setPage("register")}>Register</button>
        </div>
      )}

      {page === "login" && <LoginForm />}
      {page === "register" && <RegisterForm />}
    </div>
  );
}

export default MainPage;
