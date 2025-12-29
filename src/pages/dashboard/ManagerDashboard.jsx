import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCarSide, FaIdBadge, FaUsers } from "react-icons/fa";
import { MdRoute } from "react-icons/md";
import { FiTrendingUp, FiTrendingDown, FiPlus } from "react-icons/fi";
import api from "../../api/axiosClient";
import LoadingSkeleton from "../../components/ui/LoadingSkeleton";
import Card from "../../components/ui/Card";
import { useAuthStore } from "../../store/authStore";
import Button from "../../components/ui/Button";
import QuickActionsPanel from "../../components/workflow/QuickActionsPanel";
import SmartFiltersPanel from "../../components/workflow/SmartFiltersPanel";

export default function ManagerDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    vehicles: 0,
    drivers: 0,
    trips: 0,
    clients: 0,
    activeTrips: 0,
    availableVehicles: 0,
    activeDrivers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const [vehiclesRes, tripsRes, driversRes, clientsRes] = await Promise.all(
        [
          api
            .get("/vehicles")
            .catch(() => ({ data: { data: { vehicles: [] } } })),
          api.get("/trips").catch(() => ({ data: { data: { items: [] } } })),
          api
            .get("/drivers")
            .catch(() => ({ data: { data: { drivers: [] } } })),
          api
            .get("/clients")
            .catch(() => ({ data: { data: { clients: [] } } })),
        ]
      );

      const vehicles = vehiclesRes.data.data?.vehicles || [];
      const trips = tripsRes.data.data?.items || [];
      const drivers = driversRes.data.data?.drivers || [];
      const clients = clientsRes.data.data?.clients || [];

      setStats({
        vehicles: vehicles.length,
        drivers: drivers.length,
        trips: trips.length,
        clients: clients.length,
        activeTrips: trips.filter((t) =>
          ["started", "in-transit"].includes(t.status)
        ).length,
        availableVehicles: vehicles.filter((v) => v.status === "available")
          .length,
        activeDrivers: drivers.filter((d) => d.status === "on-trip").length,
      });
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">
          Fleet Management Dashboard
        </h1>
        <LoadingSkeleton type="stat" count={4} />
      </div>
    );
  }

  const isOwnerOrAdmin = ["company_owner", "company_admin"].includes(
    user?.companyRole
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            Fleet Management
          </h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">
            Manage your fleet operations efficiently
          </p>
        </div>
        <Button
          onClick={() => navigate("/dashboard/trips/create")}
          icon={<FiPlus size={18} />}
        >
          Create Trip
        </Button>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <DashboardCard
          title="Total Vehicles"
          value={stats.vehicles}
          subtitle={`${stats.availableVehicles} available`}
          icon={<FaCarSide size={28} />}
          gradient="gradient-blue"
          onClick={() => navigate("/dashboard/vehicles")}
        />

        <DashboardCard
          title="Total Drivers"
          value={stats.drivers}
          subtitle={`${stats.activeDrivers} on trips`}
          icon={<FaIdBadge size={28} />}
          gradient="gradient-success"
          onClick={() => navigate("/dashboard/drivers")}
        />

        <DashboardCard
          title="Active Trips"
          value={stats.activeTrips}
          subtitle={`${stats.trips} total trips`}
          icon={<MdRoute size={28} />}
          gradient="gradient-warning"
          onClick={() => navigate("/dashboard/trips")}
          highlight
        />

        <DashboardCard
          title="Clients"
          value={stats.clients}
          icon={<FaUsers size={28} />}
          gradient="gradient-purple"
          onClick={() => navigate("/dashboard/clients")}
        />
      </div>

      {/* Workflow Automation (Owner/Admin only) */}
      {isOwnerOrAdmin && (
        <>
          <QuickActionsPanel />

          <div className="mt-6">
            <SmartFiltersPanel onApplyFilter={() => {}} />
          </div>
        </>
      )}

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 mt-6">
        <Card hover>
          <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">
            Fleet Operations
          </h3>
          <div className="space-y-2">
            <QuickActionButton
              label="Manage Vehicles"
              onClick={() => navigate("/dashboard/vehicles")}
              icon="🚗"
            />
            <QuickActionButton
              label="View Live Tracking"
              onClick={() => navigate("/dashboard/drivers/live-tracking")}
              icon="📍"
            />
            <QuickActionButton
              label="Schedule Maintenance"
              onClick={() => navigate("/dashboard/maintenance")}
              icon="🔧"
            />
          </div>
        </Card>

        <Card hover>
          <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">
            Trip Management
          </h3>
          <div className="space-y-2">
            <QuickActionButton
              label="Create New Trip"
              onClick={() => navigate("/dashboard/trips/create")}
              icon="🗺️"
            />
            <QuickActionButton
              label="View All Trips"
              onClick={() => navigate("/dashboard/trips")}
              icon="📋"
            />
            <QuickActionButton
              label="Manage Routes"
              onClick={() => navigate("/dashboard/routes")}
              icon="🛣️"
            />
          </div>
        </Card>

        <Card hover>
          <h3 className="text-lg font-semibold mb-4 text-[var(--text-primary)]">
            Team & Clients
          </h3>
          <div className="space-y-2">
            <QuickActionButton
              label="Manage Drivers"
              onClick={() => navigate("/dashboard/drivers")}
              icon="👤"
            />
            <QuickActionButton
              label="View Clients"
              onClick={() => navigate("/dashboard/clients")}
              icon="🏢"
            />
            {isOwnerOrAdmin && (
              <QuickActionButton
                label="Admin Panel"
                onClick={() => navigate("/dashboard/admin")}
                icon="⚙️"
              />
            )}
          </div>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">
          System Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatusItem label="API Status" status="Operational" isGood={true} />
          <StatusItem label="Database" status="Connected" isGood={true} />
          <StatusItem label="Last Sync" status="2 minutes ago" isGood={true} />
        </div>
      </Card>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  subtitle,
  icon,
  gradient,
  onClick,
  highlight,
}) {
  return (
    <Card
      hover
      className={`relative overflow-hidden cursor-pointer ${highlight ? "ring-2 ring-[var(--warning)]" : ""}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1">
          <p className="text-sm text-[var(--text-secondary)] mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-[var(--text-primary)] mb-1">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-[var(--text-tertiary)]">{subtitle}</p>
          )}
        </div>
        <div className={`${gradient} p-3 rounded-xl text-white shadow-lg`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

function QuickActionButton({ label, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors border border-[var(--border-primary)] text-left"
    >
      <span className="text-xl">{icon}</span>
      <span className="text-sm font-medium text-[var(--text-primary)]">
        {label}
      </span>
    </button>
  );
}

function StatusItem({ label, status, isGood }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-secondary)]">
      <span className="text-sm text-[var(--text-secondary)]">{label}</span>
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            isGood ? "bg-[var(--success)]" : "bg-[var(--danger)]"
          }`}
        />
        <span className="text-sm font-medium text-[var(--text-primary)]">
          {status}
        </span>
      </div>
    </div>
  );
}
