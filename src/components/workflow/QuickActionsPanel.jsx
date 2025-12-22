import { useNavigate } from "react-router-dom";
import { FiPlus, FiUsers, FiTruck, FiMap, FiZap } from "react-icons/fi";
import { MdAutoMode } from "react-icons/md";
import Card from "../ui/Card";

/**
 * Quick Actions Panel
 * One-click access to common workflows
 */
export default function QuickActionsPanel() {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: "create-trip-map",
      title: "Create Trip (Map)",
      description: "Visual trip creation with map",
      icon: <FiMap size={24} />,
      color: "blue",
      action: () => navigate("/dashboard/trips"),
      badge: "Popular",
    },
    {
      id: "assign-driver",
      title: "Quick Assign",
      description: "Auto-assign available driver",
      icon: <MdAutoMode size={24} />,
      color: "green",
      action: () => handleAutoAssign(),
      badge: "Auto",
    },
    {
      id: "add-vehicle",
      title: "Add Vehicle",
      description: "Register new vehicle",
      icon: <FiTruck size={24} />,
      color: "purple",
      action: () => navigate("/dashboard/vehicles"),
    },
    {
      id: "add-driver",
      title: "Add Driver",
      description: "Onboard new driver",
      icon: <FiUsers size={24} />,
      color: "orange",
      action: () => navigate("/dashboard/drivers"),
    },
    {
      id: "batch-operations",
      title: "Batch Operations",
      description: "Process multiple items",
      icon: <FiZap size={24} />,
      color: "red",
      action: () => navigate("/dashboard/vehicles"),
      badge: "New",
    },
  ];

  const handleAutoAssign = () => {
    // Auto-assignment logic would be implemented here
    console.log("Auto-assigning trips to available drivers...");
  };

  const colorClasses = {
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30 hover:border-blue-500/50 text-blue-600",
    green:
      "from-green-500/20 to-green-600/10 border-green-500/30 hover:border-green-500/50 text-green-600",
    purple:
      "from-purple-500/20 to-purple-600/10 border-purple-500/30 hover:border-purple-500/50 text-purple-600",
    orange:
      "from-orange-500/20 to-orange-600/10 border-orange-500/30 hover:border-orange-500/50 text-orange-600",
    red: "from-red-500/20 to-red-600/10 border-red-500/30 hover:border-red-500/50 text-red-600",
  };

  const badgeColors = {
    Popular: "bg-blue-500 text-white",
    Auto: "bg-green-500 text-white",
    New: "bg-red-500 text-white",
  };

  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
          <FiZap size={20} className="text-blue-600" />
          Quick Actions
        </h3>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Common tasks at your fingertips
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={action.action}
            className={`relative p-4 rounded-lg border-2 bg-gradient-to-br transition-all hover:scale-105 hover:shadow-lg text-left ${
              colorClasses[action.color]
            }`}
          >
            {action.badge && (
              <span
                className={`absolute top-2 right-2 px-2 py-0.5 text-xs font-bold rounded ${
                  badgeColors[action.badge]
                }`}
              >
                {action.badge}
              </span>
            )}
            <div className="mb-3">{action.icon}</div>
            <h4 className="font-semibold text-[var(--text-primary)] text-sm mb-1">
              {action.title}
            </h4>
            <p className="text-xs text-[var(--text-secondary)]">
              {action.description}
            </p>
          </button>
        ))}
      </div>
    </Card>
  );
}
