import { useNavigate } from "react-router-dom";
import { logout } from "../authUtils";

function AdminDashboard() {
  const navigate = useNavigate();

  const modules = [
    {
      category: "👤 Gestion des utilisateurs",
      items: [
        { label: "Utilisateurs", path: "/admin/users", color: "#6366f1", icon: "👥" },
      ]
    },
    {
      category: "📚 Gestion des formations",
      items: [
        { label: "Formations", path: "/formations", color: "#3b82f6", icon: "📋" },
        { label: "Formateurs", path: "/formateurs", color: "#0ea5e9", icon: "🧑‍🏫" },
        { label: "Participants", path: "/participants", color: "#06b6d4", icon: "🙋" },
      ]
    },
    {
      category: "🗂️ Tables secondaires",
      items: [
        { label: "Domaines", path: "/admin/domaines", color: "#f59e0b", icon: "🏷️" },
        { label: "Structures", path: "/admin/structures", color: "#10b981", icon: "🏢" },
        { label: "Profils", path: "/admin/profils", color: "#8b5cf6", icon: "🪪" },
        { label: "Employeurs", path: "/admin/employeurs", color: "#f97316", icon: "🏭" },
      ]
    }
  ];

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 20px", fontFamily: "system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 24 }}>🛠️ Dashboard Administrateur</h2>
          <p style={{ margin: "6px 0 0", color: "#888", fontSize: 14 }}>
            Accès illimité à toutes les fonctionnalités
          </p>
        </div>
        <button
          onClick={logout}
          style={{
            padding: "9px 18px", borderRadius: 8, border: "none",
            background: "#E24B4A", color: "#fff", fontSize: 14,
            cursor: "pointer", fontWeight: 500
          }}
        >
          Se déconnecter
        </button>
      </div>

      {/* Modules */}
      {modules.map((section) => (
        <div key={section.category} style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "#6b7280", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>
            {section.category}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
            {section.items.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  padding: "16px 12px", borderRadius: 10, border: "none",
                  background: item.color, color: "#fff",
                  fontSize: 14, cursor: "pointer", fontWeight: 500,
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                  transition: "opacity 0.15s"
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                <span style={{ fontSize: 22 }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;