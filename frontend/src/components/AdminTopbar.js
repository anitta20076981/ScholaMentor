import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminTopbar() {
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setOpenMenu(!openMenu);
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div
      style={{
        width: "100%",
        background: "#ffffff",
        padding: "12px 25px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Left side title */}
      <h2 style={{ margin: 0, color: "#2d6cdf" }}>Admin Panel</h2>

      {/* Right side info */}
      <div style={{ position: "relative" }}>
        <div
          style={{ display: "flex", alignItems: "center", gap: "15px", cursor: "pointer" }}
          onClick={toggleMenu}
        >
          <span style={{ color: "#555", fontWeight: 500 }}>Welcome, Admin</span>
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Admin avatar"
            width="40"
            height="40"
            style={{
              borderRadius: "50%",
              border: "2px solid #2d6cdf",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Dropdown */}
        {openMenu && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "55px",
              background: "#fff",
              width: "160px",
              borderRadius: "8px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
              padding: "8px 0",
              zIndex: 20,
            }}
          >
            {/* <div
              style={{
                padding: "10px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
              onClick={() => alert("Go to Profile")}
            >
              Profile
            </div> */}

            <div
              style={{
                padding: "10px",
                cursor: "pointer",
                color: "red",
              }}
              onClick={handleLogout}
            >
              Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminTopbar;
