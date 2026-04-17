import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Validation email
  const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ Validations frontend
    if (!email.trim()) return setError("L'email est obligatoire");
    if (!isValidEmail(email)) return setError("Format email invalide");
    if (!password.trim()) return setError("Le mot de passe est obligatoire");
    if (password.length < 2) return setError("Mot de passe trop court");

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8081/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setError("Email ou mot de passe incorrect");
        return;
      }

      const token = await response.text();
      localStorage.setItem("token", token);

      // ✅ Redirection selon le rôle
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.roles?.[0];

      if (role === "ROLE_ADMIN") {
        navigate("/admin");
      } else if (role === "ROLE_RESPONSABLE") {
        navigate("/responsable");   // ✅ FIX — redirection ajoutée
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (hasError) => ({
    padding: "10px 14px", borderRadius: 8, fontSize: 14,
    border: `1px solid ${hasError ? "#E24B4A" : "#ccc"}`,
    outline: "none", width: "100%", boxSizing: "border-box"
  });

  return (
    <div style={{ maxWidth: 400, margin: "100px auto", padding: "0 20px" }}>
      <h2 style={{ marginBottom: 8 }}>Connexion</h2>
      <p style={{ color: "#888", fontSize: 13, marginBottom: 24 }}>
        Entrez vos identifiants pour accéder à l'application
      </p>

      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

        {/* ✅ Email */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 500, color: "#555", display: "block", marginBottom: 4 }}>
            Email *
          </label>
          <input
            type="email"
            placeholder="exemple@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle(email && !isValidEmail(email))}
          />
          {email && !isValidEmail(email) && (
            <p style={{ color: "#E24B4A", fontSize: 12, margin: "4px 0 0" }}>
              Format email invalide
            </p>
          )}
        </div>

        {/* ✅ Mot de passe */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 500, color: "#555", display: "block", marginBottom: 4 }}>
            Mot de passe *
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle(false)}
          />
        </div>

        {/* ✅ Message d'erreur */}
        {error && (
          <div style={{
            background: "#fef2f2", border: "1px solid #fca5a5",
            borderRadius: 8, padding: "10px 14px",
            color: "#E24B4A", fontSize: 13
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* ✅ Bouton */}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "11px", borderRadius: 8, border: "none",
            background: loading ? "#aaa" : "#378ADD",
            color: "#fff", fontSize: 14,
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 600, marginTop: 4
          }}
        >
          {loading ? "Connexion en cours..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}

export default Login;