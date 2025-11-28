import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import AdminDashboard from "./pages/admin/AdminDashboard"; 
import StudentDashboard from "./pages/student/StudentDashboard"; 
import AdminStudentList from "./pages/admin/AdminStudentList"; 
import StudentProfile from "./pages/student/StudentProfile"; 
import ApplyScholarship from "./pages/student/ApplyScholarship"; 
import TrackAppliactionStatus from "./pages/student/TrackApplicationStatus"; 
import FeeConcession from "./pages/student/FeeConcession"; 
import AdminScholarshipApplication from "./pages/admin/AdminScholarshipApplication"; 
import ViewScholarshipApplication from "./pages/admin/ViewScholarshipApplication"; 
import AdminFeeConcessionApplication from "./pages/admin/AdminFeeConcessionApplication"; 
import ViewFeeConcessionApplication from "./pages/admin/ViewFeeConcessionApplication"; 
import ScholarshipSettings from "./pages/admin/AdminScholarshipSettings"; 
import SponsorDashboard from "./pages/sponsor/SponsorDashboard"; 
import ApplySponsorship from "./pages/student/ApplySponsorship"; 





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

        <Route path="/admin/getall_scholarship_applications" element={<AdminScholarshipApplication />} /> 
        <Route path="/admin/view-scholarship-application/:applicationId" element={<ViewScholarshipApplication />} /> 

        <Route path="/admin/getall_fee_concession_applications" element={<AdminFeeConcessionApplication />} /> 
        <Route path="/admin/view-fee-concession-application/:applicationId" element={<ViewFeeConcessionApplication />} /> 

        <Route path="/admin/scholarship-settings" element={<ScholarshipSettings />} /> 
        <Route path="/sponsor/dashboard/:sponsorId" element={<SponsorDashboard />} /> 

        <Route path="/student/apply-sponsorship/:studentId" element={<ApplySponsorship />} /> 

        
        

      </Routes>
    </Router>
  );
}

export default App;
