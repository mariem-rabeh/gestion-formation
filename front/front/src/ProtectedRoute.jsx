import { Navigate } from "react-router-dom";
import { isAuthenticated, getRole } from "./authUtils";

// ✅ Route protégée — redirige vers /login si non connecté
// ✅ requiredRole peut être une string "ROLE_ADMIN"
//    ou un tableau ["ROLE_USER", "ROLE_ADMIN"]
const ProtectedRoute = ({ children, requiredRole }) => {

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const allowed = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!allowed.includes(getRole())) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;