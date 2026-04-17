import { logout } from "../authUtils";
import { useNavigate } from "react-router-dom";

function ResponsableDashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 600, margin: "60px auto", padding: "0 20px" }}>
      <h2>Dashboard Responsable</h2>
      <p style={{ marginTop: 12, color: "#555" }}>
        Bienvenue, vous avez accès aux statistiques du centre de formation.
      </p>
      <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
        <button
          onClick={() => navigate("/stats")}
          style={{
            padding: "10px 20px", borderRadius: 8, border: "none",
            background: "#378ADD", color: "#fff", fontSize: 14, cursor: "pointer"
          }}
        >
          📊 Voir les statistiques
        </button>
      </div>
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

export default ResponsableDashboard;
