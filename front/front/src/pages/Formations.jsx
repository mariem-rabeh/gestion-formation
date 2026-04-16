import { useState, useEffect } from "react";

const API_URL = "http://localhost:8081/api/formations";

function getToken() {
  return localStorage.getItem("token");
}

function Formations() {
  const [formations, setFormations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    titre: "", annee: "", duree: "", budget: ""  });

  // ✅ Charger toutes les formations
  const fetchFormations = async () => {
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (!res.ok) throw new Error("Erreur chargement");
      const data = await res.json();
      setFormations(data);
    } catch {
      setError("Impossible de charger les formations");
    }
  };

  useEffect(() => { fetchFormations(); }, []);

  // ✅ Gérer changement formulaire
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Ouvrir formulaire ajout
  const handleAdd = () => {
    setForm({ titre: "", annee: "", duree: "", budget: "" });
    setEditingId(null);
    setShowForm(true);
    setError("");
  };

  // ✅ Ouvrir formulaire modification
  const handleEdit = (f) => {
    setForm({ titre: f.titre, annee: f.annee, duree: f.duree, budget: f.budget });
    setEditingId(f.id);
    setShowForm(true);
    setError("");
  };

  // ✅ Soumettre ajout ou modification
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation frontend
    if (!form.titre.trim()) return setError("Le titre est obligatoire");
    if (parseInt(form.duree) <= 0) return setError("La durée doit être > 0");

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          titre: form.titre,
          annee: parseInt(form.annee),
          duree: parseInt(form.duree),
          budget: parseFloat(form.budget) || 0
        })
      });
      if (!res.ok) throw new Error("Erreur serveur");
      setShowForm(false);
      fetchFormations();
    } catch {
      setError("Erreur lors de l'enregistrement");
    }
  };

  // ✅ Supprimer
  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setConfirmDeleteId(null);
      fetchFormations();
    } catch {
      setError("Erreur lors de la suppression");
    }
  };

  const inputStyle = {
    padding: "9px 12px", borderRadius: 8,
    border: "1px solid #ddd", fontSize: 14, width: "100%", boxSizing: "border-box"
  };

  const btnStyle = (color) => ({
    padding: "8px 16px", borderRadius: 8, border: "none",
    background: color, color: "#fff", fontSize: 13,
    cursor: "pointer", fontWeight: 500
  });

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Gestion des Formations</h2>
        <button onClick={handleAdd} style={btnStyle("#378ADD")}>+ Ajouter</button>
      </div>

      {error && (
        <p style={{ color: "#E24B4A", marginTop: 12, fontSize: 13 }}>{error}</p>
      )}

      {/* ✅ Formulaire Ajout / Modification */}
      {showForm && (
        <div style={{
          background: "#f9f9f9", border: "1px solid #e0e0e0",
          borderRadius: 10, padding: 24, marginTop: 24
        }}>
          <h3 style={{ marginTop: 0 }}>{editingId ? "Modifier la formation" : "Nouvelle formation"}</h3>
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
            <input
              name="titre" placeholder="Titre *" value={form.titre}
              onChange={handleChange} required style={inputStyle}
            />
            <input
              name="annee" type="number" placeholder="Année (ex: 2025)"
              value={form.annee} onChange={handleChange} required style={inputStyle}
            />
            <input
              name="duree" type="number" placeholder="Durée (jours) *"
              value={form.duree} onChange={handleChange} required min="1" style={inputStyle}
            />
            <input
              name="budget" type="number" placeholder="Budget (DT)"
              value={form.budget} onChange={handleChange} style={inputStyle}
            />
            <div style={{ display: "flex", gap: 10 }}>
              <button type="submit" style={btnStyle("#378ADD")}>
                {editingId ? "Enregistrer" : "Ajouter"}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                style={btnStyle("#aaa")}>Annuler</button>
            </div>
          </form>
        </div>
      )}

      {/* ✅ Table liste formations */}
      <table style={{
        width: "100%", marginTop: 24, borderCollapse: "collapse",
        fontSize: 14, background: "#fff", borderRadius: 10, overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
      }}>
        <thead style={{ background: "#378ADD", color: "#fff" }}>
          <tr>
            {["#", "Titre", "Année", "Durée (j)", "Budget (DT)", "Actions"].map(h => (
              <th key={h} style={{ padding: "12px 14px", textAlign: "left" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {formations.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ padding: 20, textAlign: "center", color: "#888" }}>
                Aucune formation enregistrée
              </td>
            </tr>
          ) : (
            formations.map((f, i) => (
              <tr key={f.id} style={{ borderBottom: "1px solid #eee",
                background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ padding: "10px 14px" }}>{i + 1}</td>
                <td style={{ padding: "10px 14px", fontWeight: 500 }}>{f.titre}</td>
                <td style={{ padding: "10px 14px" }}>{f.annee}</td>
                <td style={{ padding: "10px 14px" }}>{f.duree} j</td>
                <td style={{ padding: "10px 14px" }}>{f.budget.toLocaleString()} DT</td>
                <td style={{ padding: "10px 14px", display: "flex", gap: 8 }}>
                  <button onClick={() => handleEdit(f)} style={btnStyle("#f0a500")}>
                    Modifier
                  </button>
                  <button onClick={() => setConfirmDeleteId(f.id)} style={btnStyle("#E24B4A")}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ✅ Modal confirmation suppression */}
      {confirmDeleteId && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999
        }}>
          <div style={{
            background: "#fff", borderRadius: 12, padding: 32,
            maxWidth: 360, width: "90%", textAlign: "center"
          }}>
            <h3 style={{ marginTop: 0 }}>Confirmer la suppression</h3>
            <p style={{ color: "#555" }}>Cette action est irréversible.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20 }}>
              <button onClick={() => handleDelete(confirmDeleteId)} style={btnStyle("#E24B4A")}>
                Supprimer
              </button>
              <button onClick={() => setConfirmDeleteId(null)} style={btnStyle("#aaa")}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Formations;