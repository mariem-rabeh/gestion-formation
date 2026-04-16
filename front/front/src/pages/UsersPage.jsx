// src/pages/UsersPage.jsx
import { useState, useEffect } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "../api";

const ROLES = ["ROLE_ADMIN", "ROLE_USER", "ROLE_RESPONSABLE"];

const emptyForm = { email: "", password: "", role: "ROLE_USER" };

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch {
      setError("Erreur de chargement");
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    setError("");
    if (!form.email) return setError("Email requis");
    if (!editId && !form.password) return setError("Mot de passe requis");

    setLoading(true);
    try {
      if (editId) {
        await updateUser(editId, form);
      } else {
        await createUser(form);
      }
      setForm(emptyForm);
      setEditId(null);
      await load();
    } catch (e) {
      setError(e.message || "Erreur");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditId(user.id);
    setForm({
      email: user.email,
      password: "",
      role: user.roles?.[0]?.name ?? "ROLE_USER",
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cet utilisateur ?")) return;
    await deleteUser(id);
    await load();
  };

  const s = styles;

  return (
    <div style={s.page}>
      <h2 style={s.title}>👥 Gestion des Utilisateurs</h2>

      {/* ── Formulaire ── */}
      <div style={s.card}>
        <h3 style={s.cardTitle}>{editId ? "✏️ Modifier utilisateur" : "➕ Nouvel utilisateur"}</h3>

        <div style={s.grid}>
          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input
              style={s.input}
              type="email"
              placeholder="email@exemple.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div style={s.field}>
            <label style={s.label}>Mot de passe {editId && "(laisser vide = inchangé)"}</label>
            <input
              style={s.input}
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <div style={s.field}>
            <label style={s.label}>Rôle</label>
            <select
              style={s.input}
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        {error && <p style={s.error}>{error}</p>}

        <div style={s.row}>
          <button style={s.btnPrimary} onClick={handleSubmit} disabled={loading}>
            {loading ? "..." : editId ? "Enregistrer" : "Créer"}
          </button>
          {editId && (
            <button style={s.btnSecondary} onClick={() => { setEditId(null); setForm(emptyForm); }}>
              Annuler
            </button>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div style={s.card}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>ID</th>
              <th style={s.th}>Email</th>
              <th style={s.th}>Rôle(s)</th>
              <th style={s.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={s.tr}>
                <td style={s.td}>{u.id}</td>
                <td style={s.td}>{u.email}</td>
                <td style={s.td}>
                  {u.roles?.map((r) => (
                    <span key={r.name} style={roleBadge(r.name)}>{r.name}</span>
                  ))}
                </td>
                <td style={s.td}>
                  <button style={s.btnEdit} onClick={() => handleEdit(u)}>Modifier</button>
                  <button style={s.btnDelete} onClick={() => handleDelete(u.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p style={s.empty}>Aucun utilisateur</p>}
      </div>
    </div>
  );
}

const roleBadge = (role) => ({
  display: "inline-block",
  padding: "2px 8px",
  borderRadius: 12,
  fontSize: 11,
  fontWeight: 600,
  marginRight: 4,
  background: role === "ROLE_ADMIN" ? "#fee2e2" : role === "ROLE_RESPONSABLE" ? "#fef9c3" : "#dbeafe",
  color: role === "ROLE_ADMIN" ? "#dc2626" : role === "ROLE_RESPONSABLE" ? "#92400e" : "#1d4ed8",
});

const styles = {
  page: { maxWidth: 900, margin: "0 auto", padding: "24px 16px" },
  title: { fontSize: 22, fontWeight: 700, marginBottom: 20 },
  card: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: 20, marginBottom: 20 },
  cardTitle: { fontSize: 15, fontWeight: 600, marginBottom: 16 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 },
  field: { display: "flex", flexDirection: "column", gap: 4 },
  label: { fontSize: 12, fontWeight: 500, color: "#6b7280" },
  input: { padding: "8px 12px", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 13 },
  error: { color: "#dc2626", fontSize: 13, marginBottom: 8 },
  row: { display: "flex", gap: 8 },
  btnPrimary: { padding: "8px 20px", borderRadius: 6, border: "none", background: "#3b82f6", color: "#fff", fontWeight: 500, cursor: "pointer" },
  btnSecondary: { padding: "8px 20px", borderRadius: 6, border: "1px solid #d1d5db", background: "#fff", cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "10px 12px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280", borderBottom: "1px solid #e5e7eb", background: "#f9fafb" },
  td: { padding: "10px 12px", fontSize: 13, borderBottom: "1px solid #f3f4f6" },
  tr: {},
  btnEdit: { padding: "4px 12px", marginRight: 6, borderRadius: 5, border: "none", background: "#dbeafe", color: "#1d4ed8", cursor: "pointer", fontSize: 12 },
  btnDelete: { padding: "4px 12px", borderRadius: 5, border: "none", background: "#fee2e2", color: "#dc2626", cursor: "pointer", fontSize: 12 },
  empty: { textAlign: "center", color: "#9ca3af", padding: 20 },
};