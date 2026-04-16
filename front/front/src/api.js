// src/api.js
// Centralized API layer for all backend calls

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
export const getUsers = () => request("GET", "/users");
export const createUser = (data) => request("POST", "/users", data);
export const updateUser = (id, data) => request("PUT", `/users/${id}`, data);
export const deleteUser = (id) => request("DELETE", `/users/${id}`);

// ─── FORMATIONS ────────────────────────────────────────
export const getFormations = () => request("GET", "/formations");
export const createFormation = (data) => request("POST", "/formations", data);
export const updateFormation = (id, data) => request("PUT", `/formations/${id}`, data);
export const deleteFormation = (id) => request("DELETE", `/formations/${id}`);

/**
 * Associer des participants à une formation
 * @param {number} formationId
 * @param {number[]} participantIds
 */
export const setFormationParticipants = (formationId, participantIds) =>
  request("PUT", `/formations/${formationId}/participants`, participantIds);

// ─── FORMATEURS ────────────────────────────────────────
export const formateurApi = {
  getAll: () => request("GET", "/formateurs"),
  create: (data) => request("POST", "/formateurs", data),
  update: (id, data) => request("PUT", `/formateurs/${id}`, data),
  delete: (id) => request("DELETE", `/formateurs/${id}`),
};

// ─── PARTICIPANTS ──────────────────────────────────────
export const participantApi = {
  getAll: () => request("GET", "/participants"),
  create: (data) => request("POST", "/participants", data),
  update: (id, data) => request("PUT", `/participants/${id}`, data),
  delete: (id) => request("DELETE", `/participants/${id}`),
};

// ─── DOMAINES ──────────────────────────────────────────
export const domaineApi = {
  getAll: () => request("GET", "/domaines"),
  create: (data) => request("POST", "/domaines", data),
  update: (id, data) => request("PUT", `/domaines/${id}`, data),
  delete: (id) => request("DELETE", `/domaines/${id}`),
};

// ─── PROFILS ───────────────────────────────────────────
export const profilApi = {
  getAll: () => request("GET", "/profils"),
  create: (data) => request("POST", "/profils", data),
  update: (id, data) => request("PUT", `/profils/${id}`, data),
  delete: (id) => request("DELETE", `/profils/${id}`),
};

// ─── STRUCTURES ────────────────────────────────────────
export const structureApi = {
  getAll: () => request("GET", "/structures"),
  create: (data) => request("POST", "/structures", data),
  update: (id, data) => request("PUT", `/structures/${id}`, data),
  delete: (id) => request("DELETE", `/structures/${id}`),
};

// ─── EMPLOYEURS ────────────────────────────────────────
export const employeurApi = {
  getAll: () => request("GET", "/employeurs"),
  create: (data) => request("POST", "/employeurs", data),
  update: (id, data) => request("PUT", `/employeurs/${id}`, data),
  delete: (id) => request("DELETE", `/employeurs/${id}`),
};
