import { useState, useEffect } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from "recharts";
import { logout } from "../authUtils";

const BASE = "http://localhost:8081/api/stats";
const token = () => localStorage.getItem("token");
const get = (path) =>
  fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${token()}` },
  }).then((r) => r.json());

// ─── Palette couleurs ────────────────────────────────────────────────────────
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316"];

// ─── Carte KPI ───────────────────────────────────────────────────────────────
function KpiCard({ label, value, color, icon }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 12, padding: "20px 24px",
      boxShadow: "0 1px 6px rgba(0,0,0,0.08)", borderLeft: `4px solid ${color}`,
      display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 180
    }}>
      <span style={{ fontSize: 32 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 26, fontWeight: 700, color }}>{value}</div>
        <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

// ─── Titre de section ────────────────────────────────────────────────────────
function SectionTitle({ children }) {
  return (
    <h3 style={{
      fontSize: 15, fontWeight: 700, color: "#374151",
      borderBottom: "2px solid #e5e7eb", paddingBottom: 8, marginBottom: 20
    }}>
      {children}
    </h3>
  );
}

// ─── Camembert custom label ───────────────────────────────────────────────────
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
      {value > 0 ? `${value}%` : ""}
    </text>
  );
};

// ─── Composant principal ─────────────────────────────────────────────────────
export default function StatsDashboard() {
  const [resume, setResume]           = useState(null);
  const [parAnnee, setParAnnee]       = useState([]);
  const [parFormation, setParFormation] = useState([]);
  const [parProfil, setParProfil]     = useState([]);
  const [parStructure, setParStructure] = useState([]);
  const [comparaison, setComparaison] = useState(null);
  const [annee1, setAnnee1]           = useState(new Date().getFullYear() - 1);
  const [annee2, setAnnee2]           = useState(new Date().getFullYear());
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");

  // ── Chargement initial ────────────────────────────────────────────────────
  useEffect(() => {
    Promise.all([
      get("/resume"),
      get("/participants-par-annee"),
      get("/participants-par-formation"),
      get("/participants-par-profil"),
      get("/participants-par-structure"),
    ])
      .then(([r, a, f, p, s]) => {
        setResume(r);
        setParAnnee(a);
        setParFormation(f);
        setParProfil(p.slice(0, 4)); // max 4 profils pour camembert
        setParStructure(s);
      })
      .catch(() => setError("Erreur de chargement des statistiques"))
      .finally(() => setLoading(false));
  }, []);

  // ── Chargement comparaison ────────────────────────────────────────────────
  const loadComparaison = () => {
    get(`/comparaison-annees?annee1=${annee1}&annee2=${annee2}`)
      .then(setComparaison)
      .catch(() => setError("Erreur comparaison"));
  };

  useEffect(() => { loadComparaison(); }, []);

  if (loading) return (
    <div style={{ textAlign: "center", padding: 80, color: "#6b7280" }}>
      ⏳ Chargement des statistiques...
    </div>
  );

  if (error) return (
    <div style={{ textAlign: "center", padding: 80, color: "#ef4444" }}>
      ⚠️ {error}
    </div>
  );

  // ── Données comparaison pour graphique ────────────────────────────────────
  const comparData = comparaison ? [
    {
      name: "Participants",
      [annee1]: comparaison.participants1,
      [annee2]: comparaison.participants2,
    },
    {
      name: "Formations",
      [annee1]: comparaison.formations1,
      [annee2]: comparaison.formations2,
    },
  ] : [];

  const evolution = comparaison?.evolutionParticipants ?? 0;
  const evolutionColor = evolution >= 0 ? "#10b981" : "#ef4444";
  const evolutionIcon  = evolution >= 0 ? "📈" : "📉";

  return (
    <div style={{
      maxWidth: 1200, margin: "0 auto", padding: "32px 16px",
      fontFamily: "system-ui, sans-serif", background: "#f9fafb", minHeight: "100vh"
    }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>📊 Tableau de Bord — Statistiques</h2>
          <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: 14 }}>
            Centre de formation Excellent Training
          </p>
        </div>
        <button onClick={logout} style={{
          padding: "9px 18px", borderRadius: 8, border: "none",
          background: "#ef4444", color: "#fff", fontSize: 14, cursor: "pointer"
        }}>
          Se déconnecter
        </button>
      </div>

      {/* ════════════════════════════════════
          KPI CARDS
      ════════════════════════════════════ */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
        <KpiCard label="Total Formations"  value={resume?.totalFormations ?? 0}  color="#3b82f6" icon="📋" />
        <KpiCard label="Total Participants" value={resume?.totalParticipants ?? 0} color="#10b981" icon="👥" />
        <KpiCard label="Budget Total (DT)"
          value={(resume?.budgetTotal ?? 0).toLocaleString("fr-TN")}
          color="#f59e0b" icon="💰" />
      </div>

      {/* ════════════════════════════════════
          LIGNE 1 : Courbe + Histogramme
      ════════════════════════════════════ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>

        {/* 📈 Courbe : Participants par année */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
          <SectionTitle>📈 Évolution des participants par année</SectionTitle>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={parAnnee}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="annee" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: 8, fontSize: 13 }}
                formatter={(v) => [`${v} participants`, "Total"]}
              />
              <Line
                type="monotone" dataKey="total" stroke="#3b82f6"
                strokeWidth={3} dot={{ r: 5, fill: "#3b82f6" }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 📊 Histogramme : Participants par structure */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
          <SectionTitle>📊 Participants par structure</SectionTitle>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={parStructure} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="structure" type="category" tick={{ fontSize: 11 }} width={120} />
              <Tooltip
                contentStyle={{ borderRadius: 8, fontSize: 13 }}
                formatter={(v) => [`${v} participants`, "Total"]}
              />
              <Bar dataKey="total" radius={[0, 6, 6, 0]}>
                {parStructure.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ════════════════════════════════════
          LIGNE 2 : Camembert + Bar formation
      ════════════════════════════════════ */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>

        {/* 🥧 Camembert : Profils (max 4) */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
          <SectionTitle>🥧 Répartition par profil (%)</SectionTitle>
          {parProfil.length === 0 ? (
            <p style={{ textAlign: "center", color: "#9ca3af", padding: 40 }}>Aucun participant</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={parProfil} dataKey="pourcentage" nameKey="profil"
                    cx="50%" cy="50%" outerRadius={100}
                    labelLine={false} label={renderCustomLabel}
                  >
                    {parProfil.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v, n) => [`${v}%`, n]} />
                </PieChart>
              </ResponsiveContainer>
              {/* Légende manuelle */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 8 }}>
                {parProfil.map((p, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: COLORS[i % COLORS.length] }} />
                    <span>{p.profil} ({p.total})</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* 📋 Bar : Participants par formation */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
          <SectionTitle>📋 Participants par formation</SectionTitle>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={parFormation.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="formation" tick={{ fontSize: 10 }} interval={0}
                angle={-20} textAnchor="end" height={50} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: 8, fontSize: 13 }}
                formatter={(v) => [`${v} participants`, "Total"]}
              />
              <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                {parFormation.slice(0, 8).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ════════════════════════════════════
          COMPARAISON 2 ANNÉES
      ════════════════════════════════════ */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
        <SectionTitle>🔄 Comparaison entre 2 années successives</SectionTitle>

        {/* Sélecteurs années */}
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 24, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Année 1 :</label>
            <input type="number" value={annee1}
              onChange={(e) => setAnnee1(parseInt(e.target.value))}
              style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 14, width: 90 }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Année 2 :</label>
            <input type="number" value={annee2}
              onChange={(e) => setAnnee2(parseInt(e.target.value))}
              style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #d1d5db", fontSize: 14, width: 90 }}
            />
          </div>
          <button onClick={loadComparaison} style={{
            padding: "8px 20px", borderRadius: 8, border: "none",
            background: "#3b82f6", color: "#fff", fontSize: 14,
            cursor: "pointer", fontWeight: 500
          }}>
            Comparer
          </button>

          {/* Badge évolution */}
          {comparaison && (
            <div style={{
              padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600,
              background: evolution >= 0 ? "#d1fae5" : "#fee2e2",
              color: evolutionColor
            }}>
              {evolutionIcon} Évolution participants : {evolution >= 0 ? "+" : ""}{evolution}%
            </div>
          )}
        </div>

        {comparaison && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

            {/* Graphique comparaison */}
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={comparData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fontSize: 13 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} />
                <Legend />
                <Bar dataKey={String(annee1)} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey={String(annee2)} fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

            {/* Tableau détail */}
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  <th style={{ padding: "10px 12px", textAlign: "left", color: "#6b7280", fontWeight: 600, fontSize: 12 }}>
                    Indicateur
                  </th>
                  <th style={{ padding: "10px 12px", textAlign: "center", color: "#3b82f6", fontWeight: 700 }}>
                    {annee1}
                  </th>
                  <th style={{ padding: "10px 12px", textAlign: "center", color: "#10b981", fontWeight: 700 }}>
                    {annee2}
                  </th>
                  <th style={{ padding: "10px 12px", textAlign: "center", color: "#6b7280", fontWeight: 600, fontSize: 12 }}>
                    Évolution
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    label: "👥 Participants",
                    v1: comparaison.participants1,
                    v2: comparaison.participants2,
                  },
                  {
                    label: "📋 Formations",
                    v1: comparaison.formations1,
                    v2: comparaison.formations2,
                  },
                  {
                    label: "💰 Budget (DT)",
                    v1: comparaison.budget1.toLocaleString("fr-TN"),
                    v2: comparaison.budget2.toLocaleString("fr-TN"),
                    noEvol: true,
                  },
                ].map((row, i) => {
                  const diff = !row.noEvol ? row.v2 - row.v1 : null;
                  const pct  = !row.noEvol && row.v1 > 0
                    ? Math.round((diff / row.v1) * 100)
                    : null;
                  return (
                    <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "10px 12px", fontWeight: 500 }}>{row.label}</td>
                      <td style={{ padding: "10px 12px", textAlign: "center" }}>{row.v1}</td>
                      <td style={{ padding: "10px 12px", textAlign: "center" }}>{row.v2}</td>
                      <td style={{ padding: "10px 12px", textAlign: "center" }}>
                        {pct !== null ? (
                          <span style={{
                            padding: "2px 8px", borderRadius: 12, fontSize: 12, fontWeight: 600,
                            background: pct >= 0 ? "#d1fae5" : "#fee2e2",
                            color: pct >= 0 ? "#065f46" : "#991b1b"
                          }}>
                            {pct >= 0 ? "+" : ""}{pct}%
                          </span>
                        ) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
