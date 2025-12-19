import { useState } from "react";
import { FaChartBar, FaUsers, FaUserShield } from "react-icons/fa";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import SystemStats from "./components/SystemStats";
import UserManagement from "./components/UserManagement";
import RoleManagement from "./components/RoleManagement";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("stats");

  const tabs = [
    { id: "stats", label: "System Stats", icon: <FaChartBar size={16} /> },
    { id: "users", label: "User Management", icon: <FaUsers size={16} /> },
    { id: "roles", label: "Role Management", icon: <FaUserShield size={16} /> },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
          Admin Panel
        </h1>
        <p className="text-[var(--text-secondary)]">
          Comprehensive system oversight and user management.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-[var(--bg-secondary)] p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-white text-[var(--text-primary)] shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "stats" && <SystemStats />}
        {activeTab === "users" && <UserManagement />}
        {activeTab === "roles" && <RoleManagement />}
      </div>
    </div>
  );
}
