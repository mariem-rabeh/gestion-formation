import { useState, useEffect } from "react";

const API_URL = "http://localhost:8081/api/formateurs";

function getToken() {
  return localStorage.getItem("token");
}

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`
});

// ✅ Fonctions de validation
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidTel = (tel) => /^\d{8,}$/.test(tel);

function Formateurs() {
  const [formateurs, setFormateurs] = useState([]);
  const [employeurs, setEmployeurs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [error, setError] = useState("");

  const emptyForm = { nom: "", prenom: "", email: "", tel: "", type: "interne", employeurId: "" };
  const [form, setForm] = useState(emptyForm);

  const fetchFormateurs = async () => {
    const res = await fetch(API_URL, { headers: authHeaders() });
    setFormateurs(await res.json());
  };

  const fetchEmployeurs = async () => {
    const res = await fetch(`${API_URL}/employeurs`, { headers: authHeaders() });
    setEmployeurs(await res.json());
  };

  useEffect(() => {
    fetchFormateurs();
    fetchEmployeurs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === "type" && value === "interne" ? { employeurId: "" } : {})
    }));
  };

  const handleAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError("");
  };

  const handleEdit = (f) => {
    setForm({
      nom: f.nom, prenom: f.prenom,
      email: f.email || "", tel: f.tel || "",
      type: f.type, employeurId: f.employeur?.id || ""
    });
    setEditingId(f.id);
    setShowForm(true);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ Validations
    if (!form.nom.trim()) return setError("Le nom est obligatoire");
    if (!form.prenom.trim()) return setError("Le prénom est obligatoire");
    if (form.email && !isValidEmail(form.email)) return setError("Format email invalide (ex: nom@domaine.com)");
    if (form.tel && !isValidTel(form.tel)) return setError("Téléphone invalide — minimum 8 chiffres");
    if (form.type === "externe" && !form.employeurId) return setError("Veuillez sélectionner un employeur");

    const body = {
      nom: form.nom, prenom: form.prenom,
      email: form.email, tel: form.tel, type: form.type,
      employeur: form.type === "externe" && form.employeurId
        ? { id: parseInt(form.employeurId) } : null
    };

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    try {
      const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(body) });
      if (!res.ok) throw new Error();
      setShowForm(false);
      fetchFormateurs();
    } catch {
      setError("Erreur lors de l'enregistrement");
    }
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE", headers: authHeaders() });
    setConfirmDeleteId(null);
    fetchFormateurs();
  };

  const inputStyle = (invalid) => ({
    padding: "9px 12px", borderRadius: 8, fontSize: 14,
    border: `1px solid ${invalid ? "#E24B4A" : "#ddd"}`,
    width: "100%", boxSizing: "border-box"
  });

  const btnStyle = (color) => ({
    padding: "8px 16px", borderRadius: 8, border: "none",
    background: color, color: "#fff", fontSize: 13,
    cursor: "pointer", fontWeight: 500
  });

  const badgeStyle = (type) => ({
    padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
    background: type === "interne" ? "#e8f5e9" : "#fff3e0",
    color: type === "interne" ? "#2e7d32" : "#e65100"
  });

  return (
    <div style={{ maxWidth: 960, margin: "40px auto", padding: "0 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Gestion des Formateurs</h2>
        <button onClick={handleAdd} style={btnStyle("#378ADD")}>+ Ajouter</button>
      </div>

      {error && (
        <div style={{
          background: "#fef2f2", border: "1px solid #fca5a5",
          borderRadius: 8, padding: "10px 14px", marginTop: 12,
          color: "#E24B4A", fontSize: 13
        }}>⚠️ {error}</div>
      )}

      {/* ✅ Formulaire */}
      {showForm && (
        <div style={{
          background: "#f9f9f9", border: "1px solid #e0e0e0",
          borderRadius: 10, padding: 24, marginTop: 24
        }}>
          <h3 style={{ marginTop: 0 }}>{editingId ? "Modifier le formateur" : "Nouveau formateur"}</h3>
          <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

            {/* Nom */}
            <div>
              <input name="nom" placeholder="Nom *" value={form.nom}
                onChange={handleChange} required
                style={inputStyle(!form.nom.trim() && form.nom !== "")} />
              {!form.nom.trim() && form.nom !== "" && (
                <p style={{ color: "#E24B4A", fontSize: 12, margin: "4px 0 0" }}>Nom obligatoire</p>
              )}
            </div>

            {/* Prénom */}
            <div>
              <input name="prenom" placeholder="Prénom *" value={form.prenom}
                onChange={handleChange} required
                style={inputStyle(!form.prenom.trim() && form.prenom !== "")} />
              {!form.prenom.trim() && form.prenom !== "" && (
                <p style={{ color: "#E24B4A", fontSize: 12, margin: "4px 0 0" }}>Prénom obligatoire</p>
              )}
            </div>

            {/* Email */}
            <div>
              <input name="email" type="text" placeholder="Email (ex: nom@domaine.com)"
                value={form.email} onChange={handleChange}
                style={inputStyle(form.email && !isValidEmail(form.email))} />
              {form.email && !isValidEmail(form.email) && (
                <p style={{ color: "#E24B4A", fontSize: 12, margin: "4px 0 0" }}>Format email invalide</p>
              )}
            </div>

            {/* Téléphone */}
            <div>
              <input name="tel" placeholder="Téléphone (8 chiffres min)"
                value={form.tel} onChange={handleChange}
                style={inputStyle(form.tel && !isValidTel(form.tel))} />
              {form.tel && !isValidTel(form.tel) && (
                <p style={{ color: "#E24B4A", fontSize: 12, margin: "4px 0 0" }}>Minimum 8 chiffres</p>
              )}
            </div>

            {/* Type */}
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontSize: 13, color: "#555", display: "block", marginBottom: 6 }}>
                Type de formateur *
              </label>
              <select name="type" value={form.type} onChange={handleChange}
                style={inputStyle(false)}>
                <option value="interne">Interne (Green Building)</option>
                <option value="externe">Externe (autre structure)</option>
              </select>
            </div>

            {/* Employeur conditionnel */}
            {form.type === "externe" && (
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ fontSize: 13, color: "#555", display: "block", marginBottom: 6 }}>
                  Employeur * <span style={{ color: "#888" }}>(obligatoire pour formateur externe)</span>
                </label>
                <select name="employeurId" value={form.employeurId}
                  onChange={handleChange} required
                  style={inputStyle(!form.employeurId)}>
                  <option value="">-- Sélectionner un employeur --</option>
                  {employeurs.map(e => (
                    <option key={e.id} value={e.id}>{e.nomEmployeur}</option>
                  ))}
                </select>
                {!form.employeurId && (
                  <p style={{ color: "#E24B4A", fontSize: 12, margin: "4px 0 0" }}>
                    Employeur obligatoire pour un formateur externe
                  </p>
                )}
              </div>
            )}

            <div style={{ gridColumn: "1 / -1", display: "flex", gap: 10 }}>
              <button type="submit" style={btnStyle("#378ADD")}>
                {editingId ? "Enregistrer" : "Ajouter"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={btnStyle("#aaa")}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <table style={{
        width: "100%", marginTop: 24, borderCollapse: "collapse",
        fontSize: 14, background: "#fff", borderRadius: 10, overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
      }}>
        <thead style={{ background: "#378ADD", color: "#fff" }}>
          <tr>
            {["#", "Nom", "Prénom", "Email", "Tél", "Type", "Employeur", "Actions"].map(h => (
              <th key={h} style={{ padding: "12px 14px", textAlign: "left" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {formateurs.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ padding: 20, textAlign: "center", color: "#888" }}>
                Aucun formateur enregistré
              </td>
            </tr>
          ) : (
            formateurs.map((f, i) => (
              <tr key={f.id} style={{
                borderBottom: "1px solid #eee",
                background: i % 2 === 0 ? "#fff" : "#fafafa"
              }}>
                <td style={{ padding: "10px 14px" }}>{i + 1}</td>
                <td style={{ padding: "10px 14px", fontWeight: 500 }}>{f.nom}</td>
                <td style={{ padding: "10px 14px" }}>{f.prenom}</td>
                <td style={{ padding: "10px 14px" }}>{f.email || "—"}</td>
                <td style={{ padding: "10px 14px" }}>{f.tel || "—"}</td>
                <td style={{ padding: "10px 14px" }}>
                  <span style={badgeStyle(f.type)}>{f.type}</span>
                </td>
                <td style={{ padding: "10px 14px" }}>
                  {f.employeur ? f.employeur.nomEmployeur : "—"}
                </td>
                <td style={{ padding: "10px 14px", display: "flex", gap: 8 }}>
                  <button onClick={() => handleEdit(f)} style={btnStyle("#f0a500")}>Modifier</button>
                  <button onClick={() => setConfirmDeleteId(f.id)} style={btnStyle("#E24B4A")}>Supprimer</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal suppression */}
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

export default Formateurs;