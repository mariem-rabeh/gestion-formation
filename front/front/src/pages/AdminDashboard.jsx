import { logout } from "../authUtils";

function AdminDashboard() {
  return (
    <div style={{ maxWidth: 600, margin: "60px auto", padding: "0 20px" }}>
      <h2>Dashboard Admin</h2>
      <p style={{ marginTop: 12, color: "#555" }}>
        Bienvenue, vous avez accès à toutes les fonctionnalités.
      </p>
      <button
        onClick={logout}
        style={{
          marginTop: 24, padding: "10px 20px", borderRadius: 8,
          border: "none", background: "#E24B4A", color: "#fff",
          fontSize: 14, cursor: "pointer"
        }}
      >
        Se déconnecter
      </button>
    </div>
  );
}

export default AdminDashboard;
