import { useState, useEffect } from "react";

const API_URL = "http://localhost:8081/api/participants";

function getToken() {
  return localStorage.getItem("token");
}

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`
});

// ✅ Validation email
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// ✅ Validation téléphone (8 chiffres minimum)
const isValidTel = (tel) => /^\d{8,}$/.test(tel);

function Participants() {
  const [participants, setParticipants] = useState([]);
  const [structures, setStructures] = useState([]);
  const [profils, setProfils] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [error, setError] = useState("");

  const emptyForm = { nom: "", prenom: "", email: "", tel: "", structureId: "", profilId: "" };
  const [form, setForm] = useState(emptyForm);

  // ✅ Charger données
  const fetchAll = async () => {
    const [pRes, sRes, prRes] = await Promise.all([
      fetch(API_URL, { headers: authHeaders() }),
      fetch(`${API_URL}/structures`, { headers: authHeaders() }),
      fetch(`${API_URL}/profils`, { headers: authHeaders() })
    ]);
    setParticipants(await pRes.json());
    setStructures(await sRes.json());
    setProfils(await prRes.json());
  };

  useEffect(() => { fetchAll(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError("");
  };

  const handleEdit = (p) => {
    setForm({
      nom: p.nom,
      prenom: p.prenom,
      email: p.email || "",
      tel: p.tel || "",
      structureId: p.structure?.id || "",
      profilId: p.profil?.id || ""
    });
    setEditingId(p.id);
    setShowForm(true);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ Validations
    if (!form.nom.trim() || !form.prenom.trim()) return setError("Nom et prénom obligatoires");
    if (!isValidEmail(form.email)) return setError("Email invalide (ex: nom@domaine.com)");
    if (form.tel && !isValidTel(form.tel)) return setError("Téléphone invalide (8 chiffres minimum)");
    if (!form.structureId) return setError("Veuillez sélectionner une structure");
    if (!form.profilId) return setError("Veuillez sélectionner un profil");

    const body = {
      nom: form.nom,
      prenom: form.prenom,
      email: form.email,
      tel: form.tel,
      structure: { id: parseInt(form.structureId) },
      profil: { id: parseInt(form.profilId) }
    };

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    try {
      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }
      setShowForm(false);
      fetchAll();
    } catch (err) {
      setError(err.message || "Erreur lors de l'enregistrement");
    }
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE", headers: authHeaders() });
    setConfirmDeleteId(null);
    fetchAll();
  };

  const inputStyle = {
    padding: "9px 12px", borderRadius: 8,
    border: "1px solid #ddd", fontSize: 14,
    width: "100%", boxSizing: "border-box"
  };

  const btnStyle = (color) => ({
    padding: "8px 16px", borderRadius: 8, border: "none",
    background: color, color: "#fff", fontSize: 13,
    cursor: "pointer", fontWeight: 500
  });

  return (
    <div style={{ maxWidth: 1000, margin: "40px auto", padding: "0 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0 }}>Gestion des Participants</h2>
        <button onClick={handleAdd} style={btnStyle("#378ADD")}>+ Ajouter</button>
      </div>

      {error && <p style={{ color: "#E24B4A", marginTop: 12, fontSize: 13 }}>{error}</p>}

      {/* ✅ Formulaire */}
      {showForm && (
        <div style={{
          background: "#f9f9f9", border: "1px solid #e0e0e0",
          borderRadius: 10, padding: 24, marginTop: 24
        }}>
          <h3 style={{ marginTop: 0 }}>
            {editingId ? "Modifier le participant" : "Nouveau participant"}
          </h3>
          <form onSubmit={handleSubmit}
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

            <input name="nom" placeholder="Nom *" value={form.nom}
              onChange={handleChange} required style={inputStyle} />
            <input name="prenom" placeholder="Prénom *" value={form.prenom}
              onChange={handleChange} required style={inputStyle} />

            {/* ✅ Email avec validation visuelle */}
            <div>
              <input name="email" type="email" placeholder="Email * (ex: nom@domaine.com)"
                value={form.email} onChange={handleChange} required style={{
                  ...inputStyle,
                  borderColor: form.email && !isValidEmail(form.email) ? "#E24B4A" : "#ddd"
                }} />
              {form.email && !isValidEmail(form.email) && (
                <p style={{ color: "#E24B4A", fontSize: 12, margin: "4px 0 0" }}>
                  Format email invalide
                </p>
              )}
            </div>

            {/* ✅ Téléphone avec validation visuelle */}
            <div>
              <input name="tel" placeholder="Téléphone (8 chiffres min)"
                value={form.tel} onChange={handleChange} style={{
                  ...inputStyle,
                  borderColor: form.tel && !isValidTel(form.tel) ? "#E24B4A" : "#ddd"
                }} />
              {form.tel && !isValidTel(form.tel) && (
                <p style={{ color: "#E24B4A", fontSize: 12, margin: "4px 0 0" }}>
                  Minimum 8 chiffres
                </p>
              )}
            </div>

            {/* ✅ Dropdown Structure */}
            <div>
              <label style={{ fontSize: 13, color: "#555", display: "block", marginBottom: 6 }}>
                Structure *
              </label>
              <select name="structureId" value={form.structureId}
                onChange={handleChange} required style={inputStyle}>
                <option value="">-- Sélectionner --</option>
                {structures.map(s => (
                  <option key={s.id} value={s.id}>{s.libelle}</option>
                ))}
              </select>
            </div>

            {/* ✅ Dropdown Profil */}
            <div>
              <label style={{ fontSize: 13, color: "#555", display: "block", marginBottom: 6 }}>
                Profil *
              </label>
              <select name="profilId" value={form.profilId}
                onChange={handleChange} required style={inputStyle}>
                <option value="">-- Sélectionner --</option>
                {profils.map(p => (
                  <option key={p.id} value={p.id}>{p.libelle}</option>
                ))}
              </select>
            </div>

            <div style={{ gridColumn: "1 / -1", display: "flex", gap: 10 }}>
              <button type="submit" style={btnStyle("#378ADD")}>
                {editingId ? "Enregistrer" : "Ajouter"}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                style={btnStyle("#aaa")}>Annuler</button>
            </div>
          </form>
        </div>
      )}

      {/* ✅ Table */}
      <table style={{
        width: "100%", marginTop: 24, borderCollapse: "collapse",
        fontSize: 14, background: "#fff", borderRadius: 10, overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)"
      }}>
        <thead style={{ background: "#378ADD", color: "#fff" }}>
          <tr>
            {["#", "Nom", "Prénom", "Email", "Tél", "Structure", "Profil", "Actions"].map(h => (
              <th key={h} style={{ padding: "12px 14px", textAlign: "left" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {participants.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ padding: 20, textAlign: "center", color: "#888" }}>
                Aucun participant enregistré
              </td>
            </tr>
          ) : (
            participants.map((p, i) => (
              <tr key={p.id} style={{
                borderBottom: "1px solid #eee",
                background: i % 2 === 0 ? "#fff" : "#fafafa"
              }}>
                <td style={{ padding: "10px 14px" }}>{i + 1}</td>
                <td style={{ padding: "10px 14px", fontWeight: 500 }}>{p.nom}</td>
                <td style={{ padding: "10px 14px" }}>{p.prenom}</td>
                <td style={{ padding: "10px 14px" }}>{p.email || "—"}</td>
                <td style={{ padding: "10px 14px" }}>{p.tel || "—"}</td>
                <td style={{ padding: "10px 14px" }}>{p.structure?.libelle || "—"}</td>
                <td style={{ padding: "10px 14px" }}>{p.profil?.libelle || "—"}</td>
                <td style={{ padding: "10px 14px", display: "flex", gap: 8 }}>
                  <button onClick={() => handleEdit(p)} style={btnStyle("#f0a500")}>Modifier</button>
                  <button onClick={() => setConfirmDeleteId(p.id)} style={btnStyle("#E24B4A")}>Supprimer</button>
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

export default Participants;
