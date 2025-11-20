import { FaCarSide } from "react-icons/fa";
import { FaIdBadge } from "react-icons/fa";
import { MdRoute } from "react-icons/md";
import { FaUsers } from "react-icons/fa";

export default function Overview() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Vehicles"
          value="12"
          icon={<FaCarSide size={28} className="text-blue-400" />}
        />

        <DashboardCard
          title="Total Drivers"
          value="8"
          icon={<FaIdBadge size={28} className="text-green-400" />}
        />

        <DashboardCard
          title="Active Trips"
          value="4"
          icon={<MdRoute size={28} className="text-yellow-400" />}
        />

        <DashboardCard
          title="Clients"
          value="6"
          icon={<FaUsers size={28} className="text-purple-400" />}
        />
      </div>

      {/* Future Section: Recent Activity */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-3 text-gray-300">
          Recent Activity
        </h2>
        <p className="text-gray-400">We will add recent logs here later.</p>
      </div>
    </div>
  );
}

// Reusable card component
function DashboardCard({ title, value, icon }) {
  return (
    <div className="bg-[#1A1A1A] p-6 rounded-xl border border-gray-800 shadow-md flex items-start gap-4 hover:bg-[#222] transition">
      <div>{icon}</div>

      <div>
        <p className="text-gray-400">{title}</p>
        <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
      </div>
    </div>
  );
}
