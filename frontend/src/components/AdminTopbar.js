function AdminTopbar() {
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
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
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
    </div>
  );
}

export default AdminTopbar;
