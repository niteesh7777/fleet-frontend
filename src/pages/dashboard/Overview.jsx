import { useAuthStore } from "../../store/authStore";
import { isDriver } from "../../utils/roleUtils";
import DriverDashboard from "./DriverDashboard";
import ManagerDashboard from "./ManagerDashboard";

/**
 * Smart Dashboard Router
 * Displays role-specific dashboard based on user's company role
 */
export default function Overview() {
  const { user } = useAuthStore();

  // Route to role-specific dashboard
  if (isDriver(user)) {
    return <DriverDashboard />;
  }

  // All other roles (owner, admin, manager) get the manager dashboard
  return <ManagerDashboard />;
}
