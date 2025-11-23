import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import AdminDashboard from "./pages/AdminDashboard"; 
import StudentDashboard from "./pages/student/StudentDashboard"; 
import AdminStudentList from "./pages/AdminStudentList"; 
import StudentProfile from "./pages/student/StudentProfile"; 
import ApplyScholarship from "./pages/student/ApplyScholarship"; 
import TrackAppliactionStatus from "./pages/student/TrackApplicationStatus"; 
import FeeConcession from "./pages/student/FeeConcession"; 




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} /> 
        <Route path="/student/dashboard/:studentId" element={<StudentDashboard />} /> 
        <Route path="/admin/students_list" element={<AdminStudentList />} /> 
        <Route path="/student/profile/:studentId" element={<StudentProfile />} /> 
        <Route path="/student/apply_scholarship/:type/:studentId" element={<ApplyScholarship />} /> 
        <Route path="/student/track-status/:studentId" element={<TrackAppliactionStatus />} /> 
        <Route path="/student/fee-concession/:studentId" element={<FeeConcession />} /> 
        

      </Routes>
    </Router>
  );
}

export default App;
