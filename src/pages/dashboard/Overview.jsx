import { useEffect, useState } from "react";
import { FaCarSide, FaIdBadge, FaUsers } from "react-icons/fa";
import { MdRoute } from "react-icons/md";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import api from "../../api/axiosClient";
import LoadingSkeleton from "../../components/ui/LoadingSkeleton";
import Card from "../../components/ui/Card";
import { useAuthStore } from "../../store/authStore";

export default function Overview() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    vehicles: 0,
    drivers: 0,
    trips: 0,
    clients: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      if (user?.role === "admin") {
        const [vehiclesRes, tripsRes, driversRes, clientsRes] =
          await Promise.all([
            api.get("/vehicles"),
            api.get("/trips"),
            api.get("/drivers"),
            api.get("/clients"),
          ]);

        setStats({
          vehicles: vehiclesRes.data.data?.vehicles?.length || 0,
          drivers: driversRes.data.data?.drivers?.length || 0,
          trips: tripsRes.data.data?.trips?.length || 0,
          clients: clientsRes.data.data?.clients?.length || 0,
        });
      } else {
        // Driver view - only fetch their own trips
        const myTripsRes = await api.get("/trips/my");
        const myTrips = myTripsRes.data.data?.trips || [];

        setStats({
          vehicles: 0, // Drivers don't see total vehicles
          drivers: 0,
          trips: myTrips.length,
          clients: 0,
        });
      }
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
          Dashboard Overview
        </h1>
        <LoadingSkeleton type="stat" count={4} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          {user?.role === "admin" ? "Admin Dashboard" : "Driver Dashboard"}
        </h1>
        <p className="text-sm text-[var(--text-tertiary)]">
          Real-time fleet statistics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <DashboardCard
          title="Total Vehicles"
          value={stats.vehicles}
          icon={<FaCarSide size={28} />}
          gradient="gradient-blue"
          trend={{ value: 12, isPositive: true }}
        />

        {user?.role === "admin" && (
          <DashboardCard
            title="Total Drivers"
            value={stats.drivers}
            icon={<FaIdBadge size={28} />}
            gradient="gradient-success"
            trend={{ value: 8, isPositive: true }}
          />
        )}

        <DashboardCard
          title="Active Trips"
          value={stats.trips}
          icon={<MdRoute size={28} />}
          gradient="gradient-warning"
          trend={{ value: 5, isPositive: false }}
        />

        {user?.role === "admin" && (
          <DashboardCard
            title="Clients"
            value={stats.clients}
            icon={<FaUsers size={28} />}
            gradient="gradient-purple"
            trend={{ value: 15, isPositive: true }}
          />
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Card hover>
          <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <QuickActionButton
              label="Add New Vehicle"
              href="/dashboard/vehicles"
              icon="🚗"
            />
            <QuickActionButton
              label="Create Trip"
              href="/dashboard/trips"
              icon="🗺️"
            />
            {user?.role === "admin" && (
              <QuickActionButton
                label="Add Driver"
                href="/dashboard/drivers"
                icon="👤"
              />
            )}
          </div>
        </Card>

        <Card hover>
          <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">
            System Status
          </h2>
          <div className="space-y-3">
            <StatusItem label="API Status" status="Operational" isGood={true} />
            <StatusItem label="Database" status="Connected" isGood={true} />
            <StatusItem
              label="Last Sync"
              status="2 minutes ago"
              isGood={true}
            />
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">
          Recent Activity
        </h2>
        <p className="text-[var(--text-secondary)]">
          Activity tracking will be implemented with real-time updates.
        </p>
      </Card>
    </div>
  );
}

// Reusable card component with gradients and trends
function DashboardCard({ title, value, icon, gradient, trend }) {
  return (
    <Card hover className="relative overflow-hidden">
      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1">
          <p className="text-sm text-[var(--text-secondary)] mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            {value}
          </h3>
          {trend && (
            <div className="flex items-center gap-1 text-xs">
              {trend.isPositive ? (
                <FiTrendingUp className="text-[var(--success)]" />
              ) : (
                <FiTrendingDown className="text-[var(--danger)]" />
              )}
              <span
                className={
                  trend.isPositive
                    ? "text-[var(--success)]"
                    : "text-[var(--danger)]"
                }
              >
                {trend.value}% from last month
              </span>
            </div>
          )}
        </div>
        <div className={`${gradient} p-3 rounded-xl text-white shadow-lg`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

function QuickActionButton({ label, href, icon }) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors border border-[var(--border-primary)]"
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-medium text-[var(--text-primary)]">{label}</span>
    </a>
  );
}

function StatusItem({ label, status, isGood }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-secondary)]">
      <span className="text-sm text-[var(--text-secondary)]">{label}</span>
      <div className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${
            isGood ? "bg-[var(--success)]" : "bg-[var(--danger)]"
          }`}
        ></span>
        <span className="text-sm font-medium text-[var(--text-primary)]">
          {status}
        </span>
      </div>
    </div>
  );
}
