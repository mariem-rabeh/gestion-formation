import { Navigate } from "react-router-dom";
import { isAuthenticated, getRole } from "./authUtils";

// ✅ Route protégée — redirige vers /login si non connecté
// ✅ Si requiredRole est précisé — redirige vers /unauthorized si mauvais rôle
const ProtectedRoute = ({ children, requiredRole }) => {

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && getRole() !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
