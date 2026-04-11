// ✅ Récupérer le token depuis localStorage
export const getToken = () => localStorage.getItem("token");

// ✅ Vérifier si le token existe et n'est pas expiré
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Date.now() / 1000;
    return payload.exp > now; // false si expiré
  } catch (e) {
    return false;
  }
};

// ✅ Récupérer le rôle depuis le token
export const getRole = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.roles?.[0] ?? null; // ex: "ROLE_ADMIN"
  } catch (e) {
    return null;
  }
};

// ✅ Déconnexion
export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};
