import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function RoleGuard({
  children,
  allowedRoles = [],
  redirectTo = "/dashboard",
}) {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}
