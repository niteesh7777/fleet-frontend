import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import DashboardLayout from "./layout/DashboardLayout";
import Overview from "./pages/dashboard/Overview";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleGuard from "./components/RoleGuard";
import Vehicles from "./pages/vehicles/Vehicles";
import Drivers from "./pages/drivers/Drivers";
import Trips from "./pages/trips/Trips";
import Clients from "./pages/clients/Clients";
import RoutesPage from "./pages/routes/Routes";
import Maintenance from "./pages/maintenance/Maintenance";
import Profile from "./pages/profile/Profile";
import AdminPanel from "./pages/admin/AdminPanel";
import ToastProvider from "./components/ToastProvider";

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Protected dashboard layout */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route
              path="vehicles"
              element={
                <RoleGuard allowedRoles={["admin"]}>
                  <Vehicles />
                </RoleGuard>
              }
            />
            <Route
              path="drivers"
              element={
                <RoleGuard allowedRoles={["admin"]}>
                  <Drivers />
                </RoleGuard>
              }
            />
            <Route path="trips" element={<Trips />} />
            <Route
              path="clients"
              element={
                <RoleGuard allowedRoles={["admin"]}>
                  <Clients />
                </RoleGuard>
              }
            />
            <Route
              path="routes"
              element={
                <RoleGuard allowedRoles={["admin"]}>
                  <RoutesPage />
                </RoleGuard>
              }
            />
            <Route
              path="maintenance"
              element={
                <RoleGuard allowedRoles={["admin"]}>
                  <Maintenance />
                </RoleGuard>
              }
            />
            <Route
              path="admin"
              element={
                <RoleGuard allowedRoles={["admin"]}>
                  <AdminPanel />
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
