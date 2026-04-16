// src/components/SimpleTablePage.jsx
// Composant générique pour les tables secondaires (Domaine, Profil, Structure, Employeur)
import { useState, useEffect } from "react";

/**
 * Props:
 * - title: string (ex: "Domaines")
 * - api: { getAll, create, update, delete }
 * - labelKey: string (champ à afficher, ex: "libelle" ou "nomEmployeur")
 * - placeholder: string
 */
export default function SimpleTablePage({ title, api, labelKey, placeholder }) {
  const [items, setItems] = useState([]);
  const [value, setValue] = useState("");
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    const data = await api.getAll();
    setItems(data);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    if (!value.trim()) return setError("Champ requis");
    setError("");
    try {
      if (editId) {
        await api.update(editId, { [labelKey]: value });
      } else {
        await api.create({ [labelKey]: value });
      }
      setValue("");
      setEditId(null);
      await load();
    } catch {
      setError("Erreur lors de l'enregistrement");
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setValue(item[labelKey]);
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cet élément ?")) return;
    await api.delete(id);
    await load();
  };

  const s = styles;

  return (
    <div style={s.page}>
      <h2 style={s.title}>{title}</h2>

      <div style={s.card}>
        <div style={s.row}>
          <input
            style={s.input}
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <button style={s.btnPrimary} onClick={handleSubmit}>
            {editId ? "Enregistrer" : "Ajouter"}
          </button>
          {editId && (
            <button style={s.btnSecondary} onClick={() => { setEditId(null); setValue(""); }}>
              Annuler
            </button>
          )}
        </div>
        {error && <p style={s.error}>{error}</p>}
      </div>

      <div style={s.card}>
        {items.length === 0 ? (
          <p style={s.empty}>Aucun élément</p>
        ) : (
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>ID</th>
                <th style={s.th}>Libellé</th>
                <th style={s.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td style={s.td}>{item.id}</td>
                  <td style={s.td}>{item[labelKey]}</td>
                  <td style={s.td}>
                    <button style={s.btnEdit} onClick={() => handleEdit(item)}>Modifier</button>
                    <button style={s.btnDelete} onClick={() => handleDelete(item.id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: 700, margin: "0 auto", padding: "24px 16px" },
  title: { fontSize: 22, fontWeight: 700, marginBottom: 20 },
  card: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: 20, marginBottom: 20 },
  row: { display: "flex", gap: 8, alignItems: "center" },
  input: { flex: 1, padding: "9px 12px", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 13 },
  btnPrimary: { padding: "9px 20px", borderRadius: 6, border: "none", background: "#3b82f6", color: "#fff", fontWeight: 500, cursor: "pointer" },
  btnSecondary: { padding: "9px 16px", borderRadius: 6, border: "1px solid #d1d5db", background: "#fff", cursor: "pointer" },
  error: { color: "#dc2626", fontSize: 13, marginTop: 8 },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "10px 12px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#6b7280", borderBottom: "1px solid #e5e7eb", background: "#f9fafb" },
  td: { padding: "10px 12px", fontSize: 13, borderBottom: "1px solid #f3f4f6" },
  btnEdit: { padding: "4px 12px", marginRight: 6, borderRadius: 5, border: "none", background: "#dbeafe", color: "#1d4ed8", cursor: "pointer", fontSize: 12 },
  btnDelete: { padding: "4px 12px", borderRadius: 5, border: "none", background: "#fee2e2", color: "#dc2626", cursor: "pointer", fontSize: 12 },
  empty: { textAlign: "center", color: "#9ca3af", padding: 20 },
};