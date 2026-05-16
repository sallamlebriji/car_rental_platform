import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedTypes, requiredPermissions }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-8">Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedTypes && !allowedTypes.includes(user.type)) {
    return <Navigate to="/" replace />;
  }

  if (requiredPermissions?.length) {
    const permissions = user?.permissions || [];
    const hasPermissions = requiredPermissions.every((permission) => permissions.includes(permission));
    if (!hasPermissions) {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
}
