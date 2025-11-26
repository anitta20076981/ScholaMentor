import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import axios from "axios";

export default function AdminScholarshipSettings() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/scholarship-settings`);
        setSettings(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <AdminSidebar>
      <div style={{ padding: "20px" }}>
        <h2>Scholarship Settings</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Amount Type</th>
              <th>Amount Value</th>
              <th>Percentage</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>
            {settings.map((setting) => (
              <tr key={setting.id}>
                <td>{setting.id}</td>
                <td>{setting.type}</td>
                <td>{setting.amount_type}</td>
                <td>{setting.amount_value || "-"}</td>
                <td>{setting.percentage || "-"}</td>
                <td>{setting.active ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminSidebar>
  );
}
