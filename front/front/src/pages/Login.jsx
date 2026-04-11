import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

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

      const token = await response.text(); // le backend retourne le token en String

      // ✅ Stocker le token
      localStorage.setItem("token", token);

      // ✅ Rediriger selon le rôle
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.roles?.[0];

      if (role === "ROLE_ADMIN") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      setError("Erreur de connexion au serveur");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto", padding: "0 20px" }}>
      <h2>Connexion</h2>

      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 24 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #ccc", fontSize: 14 }}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #ccc", fontSize: 14 }}
        />

        {error && (
          <p style={{ color: "#E24B4A", fontSize: 13, margin: 0 }}>{error}</p>
        )}

        <button
          type="submit"
          style={{
            padding: "10px", borderRadius: 8, border: "none",
            background: "#378ADD", color: "#fff", fontSize: 14,
            cursor: "pointer", fontWeight: 500
          }}
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}

export default Login;
