// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import Login from "./pages/Login";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import Unauthorized from "./pages/Unauthorized";

// ✅ Nouvelles pages
import UsersPage from "./pages/UsersPage";
import FormationPlannerPage from "./pages/FormationPlannerPage";
import SimpleTablePage from "./pages/SimpleTablePage";
import { domaineApi, profilApi, structureApi, employeurApi } from "./api";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Routes publiques */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Route protégée — tout utilisateur connecté */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />

        {/* Routes ADMIN */}
        <Route path="/admin" element={<ProtectedRoute requiredRole="ROLE_ADMIN"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute requiredRole="ROLE_ADMIN"><UsersPage /></ProtectedRoute>} />
        <Route path="/admin/domaines" element={
          <ProtectedRoute requiredRole="ROLE_ADMIN">
            <SimpleTablePage title="🏷️ Domaines" api={domaineApi} labelKey="libelle" placeholder="Ex: Informatique" />
          </ProtectedRoute>
        } />
        <Route path="/admin/profils" element={
          <ProtectedRoute requiredRole="ROLE_ADMIN">
            <SimpleTablePage title="👤 Profils" api={profilApi} labelKey="libelle" placeholder="Ex: Ingénieur" />
          </ProtectedRoute>
        } />
        <Route path="/admin/structures" element={
          <ProtectedRoute requiredRole="ROLE_ADMIN">
            <SimpleTablePage title="🏢 Structures" api={structureApi} labelKey="libelle" placeholder="Ex: DSI" />
          </ProtectedRoute>
        } />
        <Route path="/admin/employeurs" element={
          <ProtectedRoute requiredRole="ROLE_ADMIN">
            <SimpleTablePage title="🏭 Employeurs" api={employeurApi} labelKey="nomEmployeur" placeholder="Ex: Société XYZ" />
          </ProtectedRoute>
        } />

        {/* Route USER */}
        <Route path="/dashboard" element={<ProtectedRoute requiredRole="ROLE_USER"><UserDashboard /></ProtectedRoute>} />

        {/* Route formations — USER et ADMIN */}
        <Route path="/formations" element={<ProtectedRoute><FormationPlannerPage /></ProtectedRoute>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;