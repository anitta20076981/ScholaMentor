import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import AdminDashboard from "./pages/AdminDashboard"; 
import StudentDashboard from "./pages/StudentDashboard"; 
import AdminStudentList from "./pages/AdminStudentList"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} /> 
        <Route path="/student/dashboard" element={<StudentDashboard />} /> 
        <Route path="/admin/students_list" element={<AdminStudentList />} /> 
      </Routes>
    </Router>
  );
}

export default App;
