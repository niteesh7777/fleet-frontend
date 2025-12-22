import { useEffect, useState } from "react";
import {
  FaCarSide,
  FaIdBadge,
  FaUsers,
  FaRoute,
  FaTools,
  FaUser,
  FaChartBar,
} from "react-icons/fa";
import { MdRoute } from "react-icons/md";
import Card from "../../../components/ui/Card";
import LoadingSkeleton from "../../../components/ui/LoadingSkeleton";
import api from "../../../api/axiosClient";

export default function SystemStats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDrivers: 0,
    totalClients: 0,
    totalVehicles: 0,
    activeTrips: 0,
    totalRoutes: 0,
    maintenanceCount: 0,
    systemHealth: "Good",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Fetch all stats in parallel
      const [
        usersRes,
        driversRes,
        clientsRes,
        vehiclesRes,
        tripsRes,
        routesRes,
        maintenanceRes,
      ] = await Promise.all([
        api.get("/users"), // Assuming endpoint exists
        api.get("/drivers"),
        api.get("/clients"),
        api.get("/vehicles"),
        api.get("/trips"),
        api.get("/routes"),
        api.get("/maintenance"),
      ]);

      setStats({
        totalUsers: usersRes.data.data?.length || 0,
        totalDrivers: driversRes.data.data?.drivers?.length || 0,
        totalClients: clientsRes.data.data?.clients?.length || 0,
        totalVehicles: vehiclesRes.data.data?.vehicles?.length || 0,
        activeTrips:
          tripsRes.data.data?.items?.filter((t) => t.status === "in-transit")
            .length || 0,
        totalRoutes: routesRes.data.data?.length || 0,
        maintenanceCount: maintenanceRes.data.data?.length || 0,
        systemHealth: "Good", // Could be calculated based on error rates
      });
    } catch (err) {
      console.error("Failed to fetch admin stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <LoadingSkeleton type="stat" />
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <FaUser size={24} />,
      color: "text-blue-600",
    },
    {
      title: "Total Drivers",
      value: stats.totalDrivers,
      icon: <FaIdBadge size={24} />,
      color: "text-green-600",
    },
    {
      title: "Total Clients",
      value: stats.totalClients,
      icon: <FaUsers size={24} />,
      color: "text-purple-600",
    },
    {
      title: "Total Vehicles",
      value: stats.totalVehicles,
      icon: <FaCarSide size={24} />,
      color: "text-orange-600",
    },
    {
      title: "Active Trips",
      value: stats.activeTrips,
      icon: <MdRoute size={24} />,
      color: "text-red-600",
    },
    {
      title: "Total Routes",
      value: stats.totalRoutes,
      icon: <FaRoute size={24} />,
      color: "text-indigo-600",
    },
    {
      title: "Maintenance Tasks",
      value: stats.maintenanceCount,
      icon: <FaTools size={24} />,
      color: "text-yellow-600",
    },
    {
      title: "System Health",
      value: stats.systemHealth,
      icon: <FaChartBar size={24} />,
      color: "text-teal-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[var(--text-secondary)] mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} opacity-80`}>{stat.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Additional Charts/Graphs could go here */}
      <Card>
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          System Overview
        </h3>
        <p className="text-[var(--text-secondary)]">
          Detailed analytics and system performance metrics will be displayed
          here.
        </p>
      </Card>
    </div>
  );
}
