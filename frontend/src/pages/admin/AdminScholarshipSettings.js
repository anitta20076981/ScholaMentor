import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import axios from "axios";
import AdminTopbar from "../../components/AdminTopbar";

export default function AdminScholarshipSettings() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchSettings();
  }, []);

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

  const handleEdit = (setting) => {
    setEditingId(setting.id);
    setEditData(setting);
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async (id) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/api/admin/scholarship-settings/${id}`, editData);
      setEditingId(null);
      fetchSettings();
      alert("Updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update.");
    }
  };

  const toggleActive = async (id) => {
    try {
      await axios.patch(`${process.env.REACT_APP_API_URL}/api/admin/scholarship-settings/${id}/toggle`);
      fetchSettings();
    } catch (err) {
      console.error(err);
      alert("Failed to toggle active status.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <AdminSidebar>
      <AdminTopbar />

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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {settings.map((setting) => (
              <tr key={setting.id}>
                <td>{setting.id}</td>
                <td>{setting.type}</td>
                <td>
                  {editingId === setting.id ? (
                    <select name="amount_type" value={editData.amount_type} onChange={handleChange}>
                      <option value="fixed">Fixed</option>
                      <option value="custom">Custom</option>
                    </select>
                  ) : (
                    setting.amount_type
                  )}
                </td>
                <td>
                  {editingId === setting.id ? (
                    <input
                      type="number"
                      name="amount_value"
                      value={editData.amount_value || ""}
                      onChange={handleChange}
                    />
                  ) : (
                    setting.amount_value || "-"
                  )}
                </td>
                <td>
                  {editingId === setting.id ? (
                    <input
                      type="number"
                      name="percentage"
                      value={editData.percentage || ""}
                      onChange={handleChange}
                    />
                  ) : (
                    setting.percentage || "-"
                  )}
                </td>
                <td>
                  <button
                    onClick={() => toggleActive(setting.id)}
                    style={{
                      cursor: "pointer",
                      background: setting.active ? "green" : "red",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      padding: "2px 8px"
                    }}
                  >
                    {setting.active ? "Yes" : "No"}
                  </button>
                </td>
                <td>
                  {editingId === setting.id ? (
                    <>
                      <button onClick={() => handleSave(setting.id)}>Save</button>
                      <button onClick={() => setEditingId(null)}>Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => handleEdit(setting)}>Edit</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminSidebar>
  );
}
