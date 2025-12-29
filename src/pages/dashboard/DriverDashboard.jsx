import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdRoute, MdCheckCircle, MdSchedule, MdCancel } from "react-icons/md";
import { FiClock, FiMapPin, FiTrendingUp } from "react-icons/fi";
import { FaCarSide } from "react-icons/fa";
import api from "../../api/axiosClient";
import LoadingSkeleton from "../../components/ui/LoadingSkeleton";
import Card from "../../components/ui/Card";
import { useAuthStore } from "../../store/authStore";
import Button from "../../components/ui/Button";

export default function DriverDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    myTrips: 0,
    scheduled: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
  });
  const [recentTrips, setRecentTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDriverData();
    }
  }, [user]);

  const fetchDriverData = async () => {
    try {
      setLoading(true);

      // Fetch driver's trips
      const myTripsRes = await api.get("/trips/my");
      const myTrips =
        myTripsRes.data.data?.trips || myTripsRes.data.data?.items || [];

      // Calculate stats
      const scheduled = myTrips.filter((t) => t.status === "scheduled").length;
      const inProgress = myTrips.filter((t) =>
        ["started", "in-transit"].includes(t.status)
      ).length;
      const completed = myTrips.filter((t) => t.status === "completed").length;
      const cancelled = myTrips.filter((t) => t.status === "cancelled").length;

      setStats({
        myTrips: myTrips.length,
        scheduled,
        inProgress,
        completed,
        cancelled,
      });

      // Get recent trips (last 5)
      setRecentTrips(myTrips.slice(0, 5));
    } catch (err) {
      console.error("Failed to fetch driver data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">
          My Dashboard
        </h1>
        <LoadingSkeleton type="stat" count={4} />
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
          Welcome back, {user?.name || "Driver"}! 👋
        </h1>
        <p className="text-[var(--text-secondary)]">
          Here's what's happening with your trips today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Trips"
          value={stats.myTrips}
          icon={<MdRoute size={24} />}
          gradient="gradient-blue"
        />

        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon={<FaCarSide size={24} />}
          gradient="gradient-warning"
          highlight
        />

        <StatCard
          title="Scheduled"
          value={stats.scheduled}
          icon={<MdSchedule size={24} />}
          gradient="gradient-purple"
        />

        <StatCard
          title="Completed"
          value={stats.completed}
          icon={<MdCheckCircle size={24} />}
          gradient="gradient-success"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card hover>
          <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <ActionButton
              label="View My Trips"
              onClick={() => navigate("/dashboard/trips")}
              icon={<MdRoute size={20} />}
              variant="primary"
            />
            <ActionButton
              label="Update Location"
              onClick={() => navigate("/dashboard/drivers/live-tracking")}
              icon={<FiMapPin size={20} />}
              variant="secondary"
            />
            <ActionButton
              label="My Profile"
              onClick={() => navigate("/profile")}
              icon={<FiClock size={20} />}
              variant="secondary"
            />
          </div>
        </Card>

        <Card hover>
          <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">
            Today's Summary
          </h2>
          <div className="space-y-3">
            <SummaryItem
              label="Active Trips"
              value={stats.inProgress}
              color="text-[var(--warning)]"
            />
            <SummaryItem
              label="Upcoming Trips"
              value={stats.scheduled}
              color="text-[var(--primary)]"
            />
            <SummaryItem
              label="This Month"
              value={stats.completed}
              color="text-[var(--success)]"
            />
          </div>
        </Card>
      </div>

      {/* Recent Trips */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Recent Trips
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard/trips")}
          >
            View All
          </Button>
        </div>

        {recentTrips.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[var(--text-secondary)]">
              No trips assigned yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTrips.map((trip) => (
              <TripItem key={trip._id} trip={trip} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon, gradient, highlight }) {
  return (
    <Card
      hover
      className={`relative overflow-hidden ${highlight ? "ring-2 ring-[var(--warning)]" : ""}`}
    >
      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1">
          <p className="text-sm text-[var(--text-secondary)] mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-[var(--text-primary)]">
            {value}
          </h3>
        </div>
        <div className={`${gradient} p-3 rounded-xl text-white shadow-lg`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

function ActionButton({ label, onClick, icon, variant = "primary" }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors border
        ${
          variant === "primary"
            ? "bg-gradient-primary text-white hover:opacity-90 border-transparent"
            : "bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)] border-[var(--border-primary)]"
        }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

function SummaryItem({ label, value, color }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-secondary)]">
      <span className="text-[var(--text-secondary)]">{label}</span>
      <span className={`font-bold text-lg ${color}`}>{value}</span>
    </div>
  );
}

function TripItem({ trip }) {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    const colors = {
      scheduled: "bg-[var(--primary)] text-white",
      started: "bg-[var(--warning)] text-white",
      "in-transit": "bg-[var(--warning)] text-white",
      completed: "bg-[var(--success)] text-white",
      cancelled: "bg-[var(--danger)] text-white",
    };
    return (
      colors[status] || "bg-[var(--bg-tertiary)] text-[var(--text-primary)]"
    );
  };

  return (
    <div
      onClick={() => navigate(`/dashboard/trips`)}
      className="p-4 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer border border-[var(--border-primary)]"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <p className="font-semibold text-[var(--text-primary)]">
            {trip.tripCode || `Trip #${trip._id?.slice(-6)}`}
          </p>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {trip.source?.name || trip.source?.address} →{" "}
            {trip.destination?.name || trip.destination?.address}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            trip.status
          )}`}
        >
          {trip.status}
        </span>
      </div>
      <div className="flex items-center gap-4 text-xs text-[var(--text-tertiary)] mt-2">
        <span className="flex items-center gap-1">
          <FiClock size={14} />
          {trip.startTime
            ? new Date(trip.startTime).toLocaleDateString()
            : "Not scheduled"}
        </span>
        {trip.distanceKm && (
          <span className="flex items-center gap-1">
            <FiMapPin size={14} />
            {trip.distanceKm} km
          </span>
        )}
      </div>
    </div>
  );
}
