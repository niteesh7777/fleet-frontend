import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import DashboardLayout from "./layout/DashboardLayout";
import Overview from "./pages/dashboard/Overview";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleGuard from "./components/RoleGuard";
import Vehicles from "./pages/vehicles/Vehicles";
import Drivers from "./pages/drivers/Drivers";
import LiveTracking from "./pages/drivers/LiveTracking";
import Trips from "./pages/trips/Trips";
import CreateTrip from "./pages/trips/CreateTrip";
import Clients from "./pages/clients/Clients";
import RoutesPage from "./pages/routes/Routes";
import Maintenance from "./pages/maintenance/Maintenance";
import Profile from "./pages/profile/Profile";
import AdminPanel from "./pages/admin/AdminPanel";
import WorkflowAutomation from "./pages/workflow/WorkflowAutomation";
import ToastProvider from "./components/ToastProvider";
import GlobalSearch from "./components/GlobalSearch";
import KeyboardShortcutsHelp from "./components/KeyboardShortcutsHelp";
import useKeyboardShortcuts from "./hooks/useKeyboardShortcuts";

function App() {
  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  return (
    <>
      <GlobalSearch />
      <KeyboardShortcutsHelp />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected dashboard layout */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route
              path="vehicles"
              element={
                <RoleGuard
                  allowedRoles={[
                    "company_owner",
                    "company_admin",
                    "company_manager",
                  ]}
                >
                  <Vehicles />
                </RoleGuard>
              }
            />
            <Route
              path="drivers"
              element={
                <RoleGuard
                  allowedRoles={[
                    "company_owner",
                    "company_admin",
                    "company_manager",
                  ]}
                >
                  <Drivers />
                </RoleGuard>
              }
            />
            <Route
              path="drivers/live-tracking"
              element={
                <RoleGuard
                  allowedRoles={[
                    "company_owner",
                    "company_admin",
                    "company_manager",
                  ]}
                >
                  <LiveTracking />
                </RoleGuard>
              }
            />
            <Route path="trips" element={<Trips />} />
            <Route path="trips/create" element={<CreateTrip />} />
            <Route
              path="clients"
              element={
                <RoleGuard
                  allowedRoles={[
                    "company_owner",
                    "company_admin",
                    "company_manager",
                  ]}
                >
                  <Clients />
                </RoleGuard>
              }
            />
            <Route
              path="routes"
              element={
                <RoleGuard
                  allowedRoles={[
                    "company_owner",
                    "company_admin",
                    "company_manager",
                  ]}
                >
                  <RoutesPage />
                </RoleGuard>
              }
            />
            <Route
              path="maintenance"
              element={
                <RoleGuard
                  allowedRoles={[
                    "company_owner",
                    "company_admin",
                    "company_manager",
                  ]}
                >
                  <Maintenance />
                </RoleGuard>
              }
            />
            <Route
              path="admin"
              element={
                <RoleGuard allowedRoles={["company_owner", "company_admin"]}>
                  <AdminPanel />
                </RoleGuard>
              }
            />
            <Route
              path="workflow"
              element={
                <RoleGuard
                  allowedRoles={[
                    "company_owner",
                    "company_admin",
                    "company_manager",
                  ]}
                >
                  <WorkflowAutomation />
                </RoleGuard>
              }
            />
          </Route>
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
      <ToastProvider />
    </>
  );
}

export default App;
