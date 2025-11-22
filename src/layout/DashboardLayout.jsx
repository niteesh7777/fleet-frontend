import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import api from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { MdDashboard } from "react-icons/md";
import { FaCarSide, FaIdBadge, FaUsers } from "react-icons/fa";
import { MdRoute } from "react-icons/md";
import { RiToolsFill } from "react-icons/ri";
import { IoMenu, IoClose } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import ThemeToggle from "../components/ui/ThemeToggle";

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout"); // backend clears cookie
    } catch (error) {
      console.log("Logout error:", error);
      // Even if backend fails, continue with local logout
    }

    logout(); // clear Zustand + localStorage
    navigate("/login"); // redirect
  };
  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-all duration-300">
      {/* Sidebar */}
      <aside
        className={`${collapsed ? "w-20" : "w-64"
          } bg-[var(--bg-elevated)] border-r border-[var(--border-primary)] p-5 transition-all duration-300 shadow-lg`}
      >
        {/* Collapse Button */}
        <button
          onClick={toggleSidebar}
          className="text-[var(--text-secondary)] mb-6 p-2 bg-[var(--bg-secondary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <IoMenu size={22} /> : <IoClose size={22} />}
        </button>

        {/* Sidebar Title */}
        {!collapsed && (
          <div className="mb-8 transition-opacity duration-200">
            <h2 className="text-2xl font-bold text-gradient">
              🚚 Fleet Admin
            </h2>
            <p className="text-xs text-[var(--text-tertiary)] mt-1">
              Management System
            </p>
          </div>
        )}

        {/* Navigation */}
        <nav className="space-y-2 mt-4">
          <SidebarItem
            collapsed={collapsed}
            to="/dashboard"
            icon={<MdDashboard size={20} />}
            label="Dashboard"
          />

          <SidebarItem
            collapsed={collapsed}
            to="/dashboard/vehicles"
            icon={<FaCarSide size={20} />}
            label="Vehicles"
          />

          <SidebarItem
            collapsed={collapsed}
            to="/dashboard/drivers"
            icon={<FaIdBadge size={20} />}
            label="Drivers"
          />

          <SidebarItem
            collapsed={collapsed}
            to="/dashboard/trips"
            icon={<MdRoute size={20} />}
            label="Trips"
          />

          <SidebarItem
            collapsed={collapsed}
            to="/dashboard/maintenance"
            icon={<RiToolsFill size={20} />}
            label="Maintenance"
          />

          <SidebarItem
            collapsed={collapsed}
            to="/dashboard/clients"
            icon={<FaUsers size={20} />}
            label="Clients"
          />
        </nav>


      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 bg-[var(--bg-elevated)] border-b border-[var(--border-primary)] flex items-center justify-between px-6 shadow-sm">
          <h1 className="text-xl font-semibold text-[var(--text-primary)]">
            Dashboard
          </h1>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Info */}
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[var(--bg-secondary)]">
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-[var(--text-tertiary)] capitalize">
                  {user?.role || 'Admin'}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-danger text-white rounded-lg hover:opacity-90 transition-opacity shadow-md"
              title="Logout"
            >
              <FiLogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

function SidebarItem({ to, icon, label, collapsed }) {
  const baseClasses = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium
     ${isActive
      ? "bg-gradient-primary text-white shadow-md"
      : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
    }`;

  return (
    <NavLink to={to} end={to === "/dashboard"} className={baseClasses} title={collapsed ? label : ""}>
      <span className={collapsed ? "mx-auto" : ""}>{icon}</span>
      {!collapsed && (
        <span className="whitespace-nowrap transition-opacity duration-200">
          {label}
        </span>
      )}
    </NavLink>
  );
}
