import { useState, useEffect } from "react";
import {
  getFormations,
  createFormation,
  updateFormation,
  deleteFormation,
  setFormationParticipants,
} from "../api";
import { formateurApi, participantApi, domaineApi } from "../api";

const emptyForm = {
  titre: "",
  annee: new Date().getFullYear(),
  duree: 1,
  budget: 0,
  dateDebut: "",
  dateFin: "",
  domaine: null,
  formateur: null,
};

export default function FormationPlannerPage() {
  const [formations, setFormations] = useState([]);
  const [formateurs, setFormateurs] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [domaines, setDomaines] = useState([]);

  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [selectedParticipants, setSelectedParticipants] = useState([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("list");

  const load = async () => {
    setLoading(true);
    try {
      const [f, fmt, p, d] = await Promise.all([
        getFormations(),
        formateurApi.getAll(),
        participantApi.getAll(),
        domaineApi.getAll(),
      ]);
      setFormations(f);
      setFormateurs(fmt);
      setParticipants(p);
      setDomaines(d);
    } catch (e) {
      setError("Erreur chargement données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // ── PLANIFICATION ──
  const openPlanner = (formation) => {
    setSelectedFormation(formation);
    setSelectedParticipants(formation.participants?.map((p) => p.id) ?? []);
    setTab("plan");
  };

  const toggleParticipant = (id) => {
    setSelectedParticipants((prev) => {
      const set = new Set(prev);
      set.has(id) ? set.delete(id) : set.add(id);
      return [...set];
    });
  };

  const savePlan = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await setFormationParticipants(selectedFormation.id, selectedParticipants);
      setSuccess("Planification enregistrée !");
      await load();
      setTab("list");
    } catch (e) {
      setError(e.response?.data?.message || "Erreur sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  // ── FORMULAIRE ──
  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!form.titre.trim()) return setError("Le titre est requis");
    if (form.duree <= 0) return setError("Durée invalide");
    if (form.budget < 0) return setError("Budget invalide");

    if (form.dateDebut && form.dateFin && form.dateDebut > form.dateFin) {
      return setError("Date fin doit être après date début");
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        domaine: form.domaine ? { id: Number(form.domaine) } : null,
        formateur: form.formateur ? { id: Number(form.formateur) } : null,
      };

      if (editId) {
        await updateFormation(editId, payload);
        setSuccess("Formation modifiée !");
      } else {
        await createFormation(payload);
        setSuccess("Formation créée !");
      }

      setForm(emptyForm);
      setEditId(null);
      await load();
      setTab("list");

    } catch (e) {
      setError(e.response?.data?.message || "Erreur enregistrement");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (f) => {
    setEditId(f.id);
    setForm({
      titre: f.titre,
      annee: f.annee,
      duree: f.duree,
      budget: f.budget,
      dateDebut: f.dateDebut ?? "",
      dateFin: f.dateFin ?? "",
      domaine: f.domaine?.id ?? null,
      formateur: f.formateur?.id ?? null,
    });
    setTab("form");
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cette formation ?")) return;

    setLoading(true);
    try {
      await deleteFormation(id);
      setSuccess("Formation supprimée !");
      await load();
    } catch {
      setError("Erreur suppression");
    } finally {
      setLoading(false);
    }
  };

  const s = styles;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h2 style={s.title}>📋 Gestion des Formations</h2>
        <div style={s.tabs}>
          <button style={tab === "list" ? s.tabActive : s.tab} onClick={() => setTab("list")}>
            Liste
          </button>
          <button style={tab === "form" ? s.tabActive : s.tab}
            onClick={() => { setTab("form"); setEditId(null); setForm(emptyForm); }}>
            + Nouvelle formation
          </button>
        </div>
      </div>

      {loading && <p style={{ textAlign: "center" }}>⏳ Chargement...</p>}
      {error && <p style={s.error}>{error}</p>}
      {success && <p style={s.success}>{success}</p>}

      {/* LISTE */}
      {tab === "list" && (
        <div style={s.card}>
          {formations.length === 0 ? (
            <p style={s.empty}>Aucune formation</p>
          ) : (
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Titre</th>
                  <th style={s.th}>Année</th>
                  <th style={s.th}>Durée</th>
                  <th style={s.th}>Dates</th>
                  <th style={s.th}>Formateur</th>
                  <th style={s.th}>Participants</th>
                  <th style={s.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {formations.map((f) => (
                  <tr key={f.id}>
                    <td style={s.td}><strong>{f.titre}</strong></td>
                    <td style={s.td}>{f.annee}</td>
                    <td style={s.td}>{f.duree}j</td>
                    <td style={{ ...s.td, fontSize: 11 }}>
                      {f.dateDebut} → {f.dateFin}
                    </td>
                    <td style={s.td}>
                      {f.formateur ? `${f.formateur.prenom} ${f.formateur.nom}` : "—"}
                    </td>
                    <td style={s.td}>{f.participants?.length ?? 0}</td>
                    <td style={s.td}>
                      <button style={s.btnBlue} onClick={() => openPlanner(f)}>Planifier</button>
                      <button style={s.btnEdit} onClick={() => handleEdit(f)}>Modifier</button>
                      <button style={s.btnDelete} onClick={() => handleDelete(f.id)}>Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* FORM */}
      {tab === "form" && (
        <div style={s.card}>
          <h3>{editId ? "Modifier" : "Créer"} formation</h3>

          <input style={s.input} placeholder="Titre"
            value={form.titre}
            onChange={(e) => setForm({ ...form, titre: e.target.value })} />

          <button style={s.btnPrimary} onClick={handleSubmit}>
            Enregistrer
          </button>
        </div>
      )}

      {/* PLANIFICATION */}
      {tab === "plan" && selectedFormation && (
        <div style={s.card}>
          <h3>Planification : {selectedFormation.titre}</h3>

          <div style={s.participantGrid}>
            {participants.map((p) => {
              const checked = selectedParticipants.includes(p.id);
              return (
                <div key={p.id}
                  style={{ ...s.participantCard, ...(checked ? s.participantCardActive : {}) }}
                  onClick={() => toggleParticipant(p.id)}
                >
                  <input type="checkbox" checked={checked} readOnly />
                  {p.prenom} {p.nom}
                </div>
              );
            })}
          </div>

          <button style={s.btnPrimary} onClick={savePlan}>
            Sauvegarder
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { maxWidth: 1000, margin: "auto", padding: 20 },
  header: { display: "flex", justifyContent: "space-between" },
  title: { fontSize: 22 },
  tabs: { display: "flex", gap: 10 },
  tab: { padding: 8, cursor: "pointer" },
  tabActive: { padding: 8, background: "#ddd" },
  card: { padding: 20, border: "1px solid #ddd", borderRadius: 8 },
  table: { width: "100%" },
  th: { textAlign: "left" },
  td: { padding: 8 },
  btnPrimary: { background: "blue", color: "#fff", padding: 10 },
  btnEdit: { background: "orange" },
  btnDelete: { background: "red", color: "#fff" },
  btnBlue: { background: "#3b82f6", color: "#fff" },
  input: { padding: 8, marginBottom: 10, width: "100%" },
  error: { color: "red" },
  success: { color: "green" },
  empty: { textAlign: "center" },
  participantGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  participantCard: { border: "1px solid #ccc", padding: 10, cursor: "pointer" },
  participantCardActive: { background: "#dbeafe" },
};

