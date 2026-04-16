import { useState, useEffect, useMemo } from "react";
import {
  getFormations,
  createFormation,
  updateFormation,
  deleteFormation,
  planifierFormation,
  formateurApi,
  participantApi,
  domaineApi,
} from "../api";

// ─── empty state helpers ──────────────────────────────────────────────────────

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

const emptyPlan = {
  formateurId: "",
  dateDebut: "",
  dateFin: "",
  participantIds: [],
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function FormationPlannerPage() {
  // ── data ──
  const [formations, setFormations] = useState([]);
  const [formateurs, setFormateurs] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [domaines, setDomaines] = useState([]);

  // ── ui state ──
  const [tab, setTab] = useState("list");         // "list" | "form" | "plan"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ── form (create/edit) ──
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  // ── planner ──
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [plan, setPlan] = useState(emptyPlan);
  const [search, setSearch] = useState("");

  // ── load all data ──────────────────────────────────────────────────────────
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
    } catch {
      setError("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // ── helpers ───────────────────────────────────────────────────────────────
  const notify = (msg, isError = false) => {
    if (isError) { setError(msg); setSuccess(""); }
    else { setSuccess(msg); setError(""); }
  };

  const goList = () => setTab("list");

  // ── filtered participants list (search) ────────────────────────────────────
  const filteredParticipants = useMemo(() => {
    if (!search.trim()) return participants;
    const q = search.toLowerCase();
    return participants.filter(
      (p) =>
        p.nom.toLowerCase().includes(q) ||
        p.prenom.toLowerCase().includes(q) ||
        (p.email || "").toLowerCase().includes(q)
    );
  }, [participants, search]);

  // ─── PLANNER ──────────────────────────────────────────────────────────────
  const openPlanner = (formation) => {
    setSelectedFormation(formation);
    setPlan({
      formateurId: formation.formateur?.id ?? "",
      dateDebut: formation.dateDebut ?? "",
      dateFin: formation.dateFin ?? "",
      participantIds: (formation.participants ?? []).map((p) => p.id),
    });
    setSearch("");
    setError("");
    setSuccess("");
    setTab("plan");
  };

  const toggleParticipant = (id) => {
    setPlan((prev) => {
      const set = new Set(prev.participantIds);
      set.has(id) ? set.delete(id) : set.add(id);
      return { ...prev, participantIds: [...set] };
    });
  };

  const selectAll = () =>
    setPlan((prev) => ({
      ...prev,
      participantIds: filteredParticipants.map((p) => p.id),
    }));

  const clearAll = () =>
    setPlan((prev) => ({ ...prev, participantIds: [] }));

  const savePlan = async () => {
    if (plan.dateDebut && plan.dateFin && plan.dateDebut > plan.dateFin) {
      return notify("La date de fin doit être après la date de début", true);
    }
    setLoading(true);
    try {
      await planifierFormation(selectedFormation.id, {
        formateurId: plan.formateurId ? Number(plan.formateurId) : null,
        dateDebut: plan.dateDebut || null,
        dateFin: plan.dateFin || null,
        participantIds: plan.participantIds,
      });
      notify("✅ Planification enregistrée !");
      await load();
      goList();
    } catch (e) {
      notify(e.message || "Erreur lors de la sauvegarde", true);
    } finally {
      setLoading(false);
    }
  };

  // ─── FORM (create / edit) ─────────────────────────────────────────────────
  const handleSubmit = async () => {
    setError("");
    if (!form.titre.trim()) return notify("Le titre est requis", true);
    if (form.duree <= 0) return notify("La durée doit être supérieure à 0", true);
    if (form.budget < 0) return notify("Budget invalide", true);
    if (form.dateDebut && form.dateFin && form.dateDebut > form.dateFin)
      return notify("La date de fin doit être après la date de début", true);

    setLoading(true);
    try {
      const payload = {
        ...form,
        annee: Number(form.annee),
        duree: Number(form.duree),
        budget: Number(form.budget),
        domaine: form.domaine ? { id: Number(form.domaine) } : null,
        formateur: form.formateur ? { id: Number(form.formateur) } : null,
      };
      if (editId) {
        await updateFormation(editId, payload);
        notify("✅ Formation modifiée !");
      } else {
        await createFormation(payload);
        notify("✅ Formation créée !");
      }
      setForm(emptyForm);
      setEditId(null);
      await load();
      goList();
    } catch (e) {
      notify(e.message || "Erreur lors de l'enregistrement", true);
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
    setError("");
    setSuccess("");
    setTab("form");
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cette formation ?")) return;
    setLoading(true);
    try {
      await deleteFormation(id);
      notify("Formation supprimée !");
      await load();
    } catch {
      notify("Erreur lors de la suppression", true);
    } finally {
      setLoading(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={s.page}>
      {/* ── Header ── */}
      <div style={s.header}>
        <h2 style={s.pageTitle}>📋 Gestion des Formations</h2>
        <div style={s.tabBar}>
          <TabBtn active={tab === "list"} onClick={goList}>Liste</TabBtn>
          <TabBtn
            active={tab === "form" && !editId}
            onClick={() => { setEditId(null); setForm(emptyForm); setError(""); setSuccess(""); setTab("form"); }}
          >
            + Nouvelle formation
          </TabBtn>
        </div>
      </div>

      {/* ── Alerts ── */}
      {loading && <p style={s.info}>⏳ Chargement…</p>}
      {error   && <p style={s.alertError}>{error}</p>}
      {success && <p style={s.alertSuccess}>{success}</p>}

      {/* ════════════════════════════════════════════
          TAB : LISTE
      ════════════════════════════════════════════ */}
      {tab === "list" && (
        <div style={s.card}>
          {formations.length === 0 ? (
            <p style={s.empty}>Aucune formation enregistrée.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={s.table}>
                <thead>
                  <tr>
                    {["Titre", "Année", "Durée", "Dates", "Formateur", "Participants", "Actions"].map(
                      (h) => <th key={h} style={s.th}>{h}</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {formations.map((f) => (
                    <tr key={f.id} style={s.row}>
                      <td style={s.td}><strong>{f.titre}</strong></td>
                      <td style={s.td}>{f.annee}</td>
                      <td style={s.td}>{f.duree}j</td>
                      <td style={{ ...s.td, fontSize: 12, color: "#555" }}>
                        {f.dateDebut
                          ? <>{fmt(f.dateDebut)} → {fmt(f.dateFin)}</>
                          : <span style={{ color: "#bbb" }}>—</span>}
                      </td>
                      <td style={s.td}>
                        {f.formateur
                          ? <span style={s.badge}>{f.formateur.prenom} {f.formateur.nom}</span>
                          : <span style={{ color: "#bbb" }}>—</span>}
                      </td>
                      <td style={{ ...s.td, textAlign: "center" }}>
                        <span style={s.countBadge}>{f.participants?.length ?? 0}</span>
                      </td>
                      <td style={s.td}>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          <Btn color="#3b82f6" onClick={() => openPlanner(f)}>📅 Planifier</Btn>
                          <Btn color="#f59e0b" onClick={() => handleEdit(f)}>✏️ Modifier</Btn>
                          <Btn color="#ef4444" onClick={() => handleDelete(f.id)}>🗑 Supprimer</Btn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════
          TAB : FORMULAIRE création / édition
      ════════════════════════════════════════════ */}
      {tab === "form" && (
        <div style={s.card}>
          <h3 style={s.sectionTitle}>{editId ? "✏️ Modifier" : "➕ Créer"} une formation</h3>

          <div style={s.grid2}>
            <Field label="Titre *">
              <input style={s.input} placeholder="Titre de la formation"
                value={form.titre}
                onChange={(e) => setForm({ ...form, titre: e.target.value })} />
            </Field>

            <Field label="Année *">
              <input style={s.input} type="number" min="2000" max="2100"
                value={form.annee}
                onChange={(e) => setForm({ ...form, annee: e.target.value })} />
            </Field>

            <Field label="Durée (jours) *">
              <input style={s.input} type="number" min="1"
                value={form.duree}
                onChange={(e) => setForm({ ...form, duree: e.target.value })} />
            </Field>

            <Field label="Budget (DT)">
              <input style={s.input} type="number" min="0"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })} />
            </Field>

            <Field label="Date de début">
              <input style={s.input} type="date"
                value={form.dateDebut}
                onChange={(e) => setForm({ ...form, dateDebut: e.target.value })} />
            </Field>

            <Field label="Date de fin">
              <input style={s.input} type="date"
                value={form.dateFin}
                min={form.dateDebut || undefined}
                onChange={(e) => setForm({ ...form, dateFin: e.target.value })} />
            </Field>

            <Field label="Domaine">
              <select style={s.input}
                value={form.domaine ?? ""}
                onChange={(e) => setForm({ ...form, domaine: e.target.value || null })}>
                <option value="">— Aucun —</option>
                {domaines.map((d) => (
                  <option key={d.id} value={d.id}>{d.libelle ?? d.nom}</option>
                ))}
              </select>
            </Field>

            <Field label="Formateur">
              <select style={s.input}
                value={form.formateur ?? ""}
                onChange={(e) => setForm({ ...form, formateur: e.target.value || null })}>
                <option value="">— Non assigné —</option>
                {formateurs.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.prenom} {f.nom} ({f.type})
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <Btn color="#10b981" onClick={handleSubmit} disabled={loading}>
              {loading ? "Enregistrement…" : editId ? "Enregistrer les modifications" : "Créer la formation"}
            </Btn>
            <Btn color="#6b7280" onClick={goList}>Annuler</Btn>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════
          TAB : PLANIFICATION
      ════════════════════════════════════════════ */}
      {tab === "plan" && selectedFormation && (
        <div style={s.card}>
          <h3 style={s.sectionTitle}>
            📅 Planifier : <em>{selectedFormation.titre}</em>
          </h3>

          {/* ── Formateur + Dates ── */}
          <div style={s.grid2}>
            <Field label="Formateur *">
              <select style={s.input}
                value={plan.formateurId}
                onChange={(e) => setPlan({ ...plan, formateurId: e.target.value })}>
                <option value="">— Non assigné —</option>
                {formateurs.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.prenom} {f.nom}
                    {f.type === "externe" ? ` (externe — ${f.employeur?.nom ?? "?"})` : " (interne)"}
                  </option>
                ))}
              </select>
            </Field>

            <div /> {/* spacer */}

            <Field label="Date de début">
              <input style={s.input} type="date"
                value={plan.dateDebut}
                onChange={(e) => setPlan({ ...plan, dateDebut: e.target.value })} />
            </Field>

            <Field label="Date de fin">
              <input style={s.input} type="date"
                value={plan.dateFin}
                min={plan.dateDebut || undefined}
                onChange={(e) => setPlan({ ...plan, dateFin: e.target.value })} />
            </Field>
          </div>

          {/* ── Participants ── */}
          <div style={{ marginTop: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <h4 style={{ margin: 0 }}>
                👥 Participants{" "}
                <span style={s.countBadge}>{plan.participantIds.length} sélectionné(s)</span>
              </h4>
              <div style={{ display: "flex", gap: 6 }}>
                <Btn color="#6366f1" onClick={selectAll} small>Tout sélectionner</Btn>
                <Btn color="#6b7280" onClick={clearAll} small>Tout effacer</Btn>
              </div>
            </div>

            {/* Search */}
            <input
              style={{ ...s.input, marginBottom: 12 }}
              placeholder="🔍 Rechercher un participant (nom, prénom, email)…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* Grid */}
            {filteredParticipants.length === 0 ? (
              <p style={s.empty}>Aucun participant trouvé.</p>
            ) : (
              <div style={s.participantGrid}>
                {filteredParticipants.map((p) => {
                  const checked = plan.participantIds.includes(p.id);
                  return (
                    <div
                      key={p.id}
                      style={{ ...s.participantCard, ...(checked ? s.participantCardActive : {}) }}
                      onClick={() => toggleParticipant(p.id)}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        readOnly
                        style={{ marginRight: 8, cursor: "pointer" }}
                      />
                      <div>
                        <div style={{ fontWeight: 600 }}>{p.prenom} {p.nom}</div>
                        <div style={{ fontSize: 11, color: "#888" }}>
                          {p.profil?.libelle ?? p.profil?.nom ?? "—"} · {p.structure?.nom ?? "—"}
                        </div>
                        {p.email && (
                          <div style={{ fontSize: 11, color: "#aaa" }}>{p.email}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Actions ── */}
          <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
            <Btn color="#10b981" onClick={savePlan} disabled={loading}>
              {loading ? "Enregistrement…" : "💾 Sauvegarder la planification"}
            </Btn>
            <Btn color="#6b7280" onClick={goList}>Annuler</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Small helpers ─────────────────────────────────────────────────────────────

function fmt(d) {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

function Field({ label, children }) {
  return (
    <div>
      <label style={s.label}>{label}</label>
      {children}
    </div>
  );
}

function Btn({ color, onClick, children, disabled, small }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? "#ccc" : color,
        color: "#fff",
        border: "none",
        borderRadius: 6,
        padding: small ? "4px 10px" : "8px 16px",
        fontSize: small ? 12 : 14,
        cursor: disabled ? "not-allowed" : "pointer",
        fontWeight: 500,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}

function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 18px",
        border: "none",
        borderRadius: 6,
        cursor: "pointer",
        fontWeight: active ? 700 : 400,
        background: active ? "#3b82f6" : "#e5e7eb",
        color: active ? "#fff" : "#374151",
        fontSize: 14,
      }}
    >
      {children}
    </button>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const s = {
  page: { maxWidth: 1100, margin: "auto", padding: "24px 16px", fontFamily: "system-ui, sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 },
  pageTitle: { margin: 0, fontSize: 22, fontWeight: 700 },
  tabBar: { display: "flex", gap: 8 },
  card: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: 24, boxShadow: "0 1px 4px #0001" },
  sectionTitle: { marginTop: 0, fontSize: 18, fontWeight: 600, marginBottom: 20 },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 24px" },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 4 },
  input: { width: "100%", padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 14, boxSizing: "border-box" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px 12px", background: "#f3f4f6", fontSize: 13, fontWeight: 600, borderBottom: "2px solid #e5e7eb" },
  td: { padding: "10px 12px", borderBottom: "1px solid #f3f4f6", fontSize: 14, verticalAlign: "middle" },
  row: { transition: "background 0.1s" },
  badge: { background: "#dbeafe", color: "#1d4ed8", borderRadius: 12, padding: "2px 8px", fontSize: 12, fontWeight: 600 },
  countBadge: { background: "#e0e7ff", color: "#4338ca", borderRadius: 12, padding: "2px 8px", fontSize: 12, fontWeight: 700 },
  participantGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 },
  participantCard: {
    display: "flex", alignItems: "flex-start", gap: 6,
    border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 12px",
    cursor: "pointer", transition: "background 0.15s, border-color 0.15s",
    background: "#fafafa",
  },
  participantCardActive: { background: "#eff6ff", borderColor: "#93c5fd" },
  info: { textAlign: "center", color: "#6b7280" },
  alertError: { background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: "10px 16px", color: "#b91c1c" },
  alertSuccess: { background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8, padding: "10px 16px", color: "#15803d" },
  empty: { textAlign: "center", color: "#9ca3af", padding: "30px 0" },
};