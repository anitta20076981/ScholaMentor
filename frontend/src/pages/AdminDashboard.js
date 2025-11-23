import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";
import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [stats, setStats] = useState({
    pendingScholarship: 0,
    pendingFeeConcession: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/dashboard-stats");
      setStats(res.data);
    } catch (error) {
      console.log("Error fetching stats:", error);
    }
  };

  return (
    <AdminSidebar>
      <AdminTopbar />

      <div style={{ padding: "20px" }}>
        <h1 style={{ marginBottom: "10px" }}>Dashboard Overview</h1>
        <p style={{ color: "gray", marginBottom: "30px" }}>
          Quick statistics of student applications.
        </p>

        {/* Cards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          {/* Pending Scholarship */}
          <div
            style={{
              padding: "15px",
              background: "#0275d8",
              color: "white",
              borderRadius: "10px",
              minHeight: "100px",
              boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
            }}
          >
            <h4 style={{ margin: 0, marginBottom: "10px" }}>
              Pending Scholarship
            </h4>
            <p
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                margin: 0,
                textAlign: "center",
              }}
            >
              {stats.pendingScholarship}
            </p>
          </div>

          {/* Pending Fee Concession */}
          <div
            style={{
              padding: "15px",
              background: "#f0ad4e",
              color: "white",
              borderRadius: "10px",
              minHeight: "100px",
              boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
            }}
          >
            <h4 style={{ margin: 0, marginBottom: "10px" }}>
              Pending Fee Concession
            </h4>
            <p
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                margin: 0,
                textAlign: "center",
              }}
            >
              {stats.pendingFeeConcession}
            </p>
          </div>

          {/* Total Approved */}
          <div
            style={{
              padding: "15px",
              background: "#5cb85c",
              color: "white",
              borderRadius: "10px",
              minHeight: "100px",
              boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
            }}
          >
            <h4 style={{ margin: 0, marginBottom: "10px" }}>Total Approved</h4>
            <p
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                margin: 0,
                textAlign: "center",
              }}
            >
              {stats.approved}
            </p>
          </div>

          {/* Total Rejected */}
          <div
            style={{
              padding: "15px",
              background: "#d9534f",
              color: "white",
              borderRadius: "10px",
              minHeight: "100px",
              boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
            }}
          >
            <h4 style={{ margin: 0, marginBottom: "10px" }}>Total Rejected</h4>
            <p
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                margin: 0,
                textAlign: "center",
              }}
            >
              {stats.rejected}
            </p>
          </div>
        </div>
      </div>
    </AdminSidebar>
  );
}

export default AdminDashboard;
