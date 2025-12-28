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

  // Check companyRole for multi-tenant architecture
  if (!allowedRoles.includes(user.companyRole)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}
