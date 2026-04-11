import { logout, getRole } from "../authUtils";

function Home() {
  const role = getRole();

  return (
    <div style={{ maxWidth: 600, margin: "60px auto", padding: "0 20px" }}>
      <h2>Accueil</h2>
      <p style={{ marginTop: 12, color: "#555" }}>Connecté avec le rôle : <strong>{role}</strong></p>
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

export default Home;
