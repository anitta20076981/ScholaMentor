import { Link } from "react-router-dom";
import "./AdminSidebar.css";

function AdminSidebar({ children }) {
  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li><Link to="/admin/dashboard">Home</Link></li>
          <li><Link to="/admin/students_list">Student List</Link></li>
          <li><Link to="/admin/getall_scholarship_applications">Scholarship Applications</Link></li>
          <li><Link to="/admin/getall_fee_concession_applications">Fee Concession Applications</Link></li>
          <li><Link to="/admin/sponsorship-request">Sponsorship Request</Link></li>
          <li><Link to="/admin/add-scholarship">Add Scholarship</Link></li>
          <li><Link to="/admin/scholarship-settings">Scholarship Settings</Link></li>
        </ul>
      </aside>

      <main className="admin-content">
        {children} {/* Render the page content */}
      </main>
    </div>
  );
}

export default AdminSidebar;
