// src/api.js
const BASE_URL = "http://localhost:8081/api";

function getToken() {
  return localStorage.getItem("token");
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

async function request(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: authHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `Erreur ${res.status}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// ─── USERS ─────────────────────────────────────────────
// ✅ Fix : /admin/users au lieu de /users
export const getUsers    = ()           => request("GET",    "/admin/users");
export const createUser  = (data)       => request("POST",   "/admin/users", data);
export const updateUser  = (id, data)   => request("PUT",    `/admin/users/${id}`, data);
export const deleteUser  = (id)         => request("DELETE", `/admin/users/${id}`);

// ─── FORMATIONS ────────────────────────────────────────
export const getFormations    = ()           => request("GET",    "/formations");
export const createFormation  = (data)       => request("POST",   "/formations", data);
export const updateFormation  = (id, data)   => request("PUT",    `/formations/${id}`, data);
export const deleteFormation  = (id)         => request("DELETE", `/formations/${id}`);

export const setFormationParticipants = (formationId, participantIds) =>
  request("PUT", `/formations/${formationId}/participants`, participantIds);

export const assignFormateur = (formationId, formateurId) =>
  request("PUT", `/formations/${formationId}/formateur/${formateurId}`);

export const planifierFormation = (formationId, data) =>
  request("PUT", `/formations/${formationId}/planifier`, data);

// ─── FORMATEURS ────────────────────────────────────────
export const formateurApi = {
  getAll:  ()           => request("GET",    "/formateurs"),
  create:  (data)       => request("POST",   "/formateurs", data),
  update:  (id, data)   => request("PUT",    `/formateurs/${id}`, data),
  delete:  (id)         => request("DELETE", `/formateurs/${id}`),
};

// ─── PARTICIPANTS ──────────────────────────────────────
export const participantApi = {
  getAll:  ()           => request("GET",    "/participants"),
  create:  (data)       => request("POST",   "/participants", data),
  update:  (id, data)   => request("PUT",    `/participants/${id}`, data),
  delete:  (id)         => request("DELETE", `/participants/${id}`),
};

// ─── DOMAINES ──────────────────────────────────────────
export const domaineApi = {
  getAll:  ()           => request("GET",    "/domaines"),
  create:  (data)       => request("POST",   "/domaines", data),
  update:  (id, data)   => request("PUT",    `/domaines/${id}`, data),
  delete:  (id)         => request("DELETE", `/domaines/${id}`),
};

// ─── PROFILS ───────────────────────────────────────────
export const profilApi = {
  getAll:  ()           => request("GET",    "/profils"),
  create:  (data)       => request("POST",   "/profils", data),
  update:  (id, data)   => request("PUT",    `/profils/${id}`, data),
  delete:  (id)         => request("DELETE", `/profils/${id}`),
};

// ─── STRUCTURES ────────────────────────────────────────
export const structureApi = {
  getAll:  ()           => request("GET",    "/structures"),
  create:  (data)       => request("POST",   "/structures", data),
  update:  (id, data)   => request("PUT",    `/structures/${id}`, data),
  delete:  (id)         => request("DELETE", `/structures/${id}`),
};

// ─── EMPLOYEURS ────────────────────────────────────────
export const employeurApi = {
  getAll:  ()           => request("GET",    "/employeurs"),
  create:  (data)       => request("POST",   "/employeurs", data),
  update:  (id, data)   => request("PUT",    `/employeurs/${id}`, data),
  delete:  (id)         => request("DELETE", `/employeurs/${id}`),
};