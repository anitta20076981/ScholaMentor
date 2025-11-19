import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import AdminDashboard from "./pages/AdminDashboard"; 
import StudentDashboard from "./pages/StudentDashboard"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} /> 
        <Route path="/student/dashboard" element={<StudentDashboard />} /> 
      </Routes>
    </Router>
  );
}

export default App;
