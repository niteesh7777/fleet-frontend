import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import api from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { MdDashboard } from "react-icons/md";
import { FaCarSide, FaIdBadge, FaUsers, FaUserShield } from "react-icons/fa";
import { MdRoute } from "react-icons/md";
import { MdOutlineMap } from "react-icons/md";
import { RiToolsFill } from "react-icons/ri";
import { IoMenu, IoClose } from "react-icons/io5";
import { FiLogOut, FiZap } from "react-icons/fi";
import ThemeToggle from "../components/ui/ThemeToggle";
import NotificationCenter from "../components/NotificationCenter";

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-all duration-300">
      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } bg-[var(--bg-elevated)] border-r border-[var(--border-primary)] p-5 transition-all duration-300 shadow-lg
        fixed lg:static inset-y-0 left-0 z-50 transform ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Collapse Button - Desktop Only */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:block text-[var(--text-secondary)] mb-6 p-2 bg-[var(--bg-secondary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <IoMenu size={22} /> : <IoClose size={22} />}
        </button>

        {/* Close Button - Mobile Only */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden text-[var(--text-secondary)] mb-6 p-2 bg-[var(--bg-secondary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
          aria-label="Close menu"
        >
          <IoClose size={22} />
        </button>

        {/* Sidebar Title */}
        {!collapsed && (
          <div className="mb-8 transition-opacity duration-200">
            <h2 className="text-2xl font-bold text-gradient">🚚 Fleet Admin</h2>
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

          {user?.role === "admin" && (
            <SidebarItem
              collapsed={collapsed}
              to="/dashboard/vehicles"
              icon={<FaCarSide size={20} />}
              label="Vehicles"
            />
          )}

          {user?.role === "admin" && (
            <SidebarItem
              collapsed={collapsed}
              to="/dashboard/drivers"
              icon={<FaIdBadge size={20} />}
              label="Drivers"
            />
          )}

          {user?.role === "admin" && (
            <SidebarItem
              collapsed={collapsed}
              to="/dashboard/drivers/live-tracking"
              icon={<MdOutlineMap size={20} />}
              label="Live Tracking"
            />
          )}

          <SidebarItem
            collapsed={collapsed}
            to="/dashboard/trips"
            icon={<MdRoute size={20} />}
            label="Trips"
          />

          {user?.role === "admin" && (
            <SidebarItem
              collapsed={collapsed}
              to="/dashboard/clients"
              icon={<FaUsers size={20} />}
              label="Clients"
            />
          )}

          {user?.role === "admin" && (
            <SidebarItem
              collapsed={collapsed}
              to="/dashboard/routes"
              icon={<MdOutlineMap size={20} />}
              label="Routes"
            />
          )}

          {user?.role === "admin" && (
            <SidebarItem
              collapsed={collapsed}
              to="/dashboard/maintenance"
              icon={<RiToolsFill size={20} />}
              label="Maintenance"
            />
          )}

          {user?.role === "admin" && (
            <SidebarItem
              collapsed={collapsed}
              to="/dashboard/workflow"
              icon={<FiZap size={20} />}
              label="Automation"
            />
          )}

          {user?.role === "admin" && (
            <SidebarItem
              collapsed={collapsed}
              to="/dashboard/admin"
              icon={<FaUserShield size={20} />}
              label="Admin Panel"
            />
          )}

          <SidebarItem
            collapsed={collapsed}
            to="/profile"
            icon={<MdDashboard size={20} />}
            label="Profile"
          />
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-[var(--bg-elevated)] border-b border-[var(--border-primary)] flex items-center justify-between px-6 shadow-sm">
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <IoMenu size={24} />
          </button>

          <h1 className="text-xl font-semibold text-[var(--text-primary)]">
            Dashboard
          </h1>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notification Center */}
            <NotificationCenter />

            {/* User Info */}
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[var(--bg-secondary)]">
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-[var(--text-tertiary)] capitalize">
                  {user?.role || "Admin"}
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
              <span>Logout</span>
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
     ${
       isActive
         ? "bg-gradient-primary text-white shadow-md"
         : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
     }`;

  return (
    <NavLink
      to={to}
      end={to === "/dashboard"}
      className={baseClasses}
      title={collapsed ? label : ""}
    >
      <span className={collapsed ? "mx-auto" : ""}>{icon}</span>
      {!collapsed && (
        <span className="whitespace-nowrap transition-opacity duration-200">
          {label}
        </span>
      )}
    </NavLink>
  );
}
