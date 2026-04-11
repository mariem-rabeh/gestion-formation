import { useNavigate } from "react-router-dom";

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 600, margin: "60px auto", padding: "0 20px", textAlign: "center" }}>
      <h2 style={{ color: "#E24B4A" }}>403 — Accès refusé</h2>
      <p style={{ marginTop: 12, color: "#555" }}>
        Vous n'avez pas les permissions nécessaires pour accéder à cette page.
      </p>
      <button
        onClick={() => navigate(-1)}
        style={{
          marginTop: 24, padding: "10px 20px", borderRadius: 8,
          border: "none", background: "#378ADD", color: "#fff",
          fontSize: 14, cursor: "pointer"
        }}
      >
        Retour
      </button>
    </div>
  );
}

export default Unauthorized;
