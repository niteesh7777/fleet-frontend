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

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const logout = useAuthStore((state) => state.logout);
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
    <div className="flex min-h-screen bg-[#111] text-gray-200 transition-all duration-300">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } bg-[#1A1A1A] border-r border-gray-800 p-5 transition-all duration-300`}
      >
        {/* Collapse Button */}
        <button
          onClick={toggleSidebar}
          className="text-gray-300 mb-6 p-2 bg-gray-800 rounded hover:bg-gray-700 transition"
        >
          {collapsed ? <IoMenu size={22} /> : <IoClose size={22} />}
        </button>

        {/* Sidebar Title */}
        {!collapsed && (
          <h2 className="text-2xl font-bold mb-8 transition-opacity duration-200">
            🚚 Fleet Admin
          </h2>
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
        <header className="h-16 bg-[#1A1A1A] border-b border-gray-800 flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold">Dashboard</h1>

          <button
            onClick={handleLogout}
            className="cursor-pointer px-3 py-1 bg-red-600 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

function SidebarItem({ to, icon, label, collapsed }) {
  const baseClasses = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-md transition-all
     ${
       isActive ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-800"
     }`;

  return (
    <NavLink to={to} className={baseClasses}>
      {icon}
      {!collapsed && (
        <span className="whitespace-nowrap transition-opacity duration-200">
          {label}
        </span>
      )}
    </NavLink>
  );
}
