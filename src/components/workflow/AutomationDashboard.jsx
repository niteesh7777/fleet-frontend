import { useState } from "react";
import { FiZap, FiClock, FiTrendingUp, FiSettings } from "react-icons/fi";
import { MdAutoMode } from "react-icons/md";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Toggle from "../ui/Toggle";
import { useNotificationStore } from "../../store/notificationStore";

/**
 * Workflow Automation Dashboard
 * Centralized control for automated admin tasks
 */
export default function AutomationDashboard() {
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const [automationRules, setAutomationRules] = useState([
    {
      id: 1,
      name: "Auto-Assign Trips to Nearest Drivers",
      description:
        "Automatically assign new trips to available drivers based on proximity",
      enabled: true,
      category: "trip-assignment",
      icon: <MdAutoMode size={24} />,
      stats: { triggered: 45, lastRun: "2 hours ago" },
    },
    {
      id: 2,
      name: "Maintenance Reminders",
      description:
        "Send automatic reminders when vehicles are due for maintenance",
      enabled: true,
      category: "maintenance",
      icon: <FiClock size={24} />,
      stats: { triggered: 12, lastRun: "1 day ago" },
    },
    {
      id: 3,
      name: "Route Optimization Suggestions",
      description:
        "Analyze and suggest optimal routes based on traffic and distance",
      enabled: false,
      category: "routes",
      icon: <FiTrendingUp size={24} />,
      stats: { triggered: 8, lastRun: "3 days ago" },
    },
    {
      id: 4,
      name: "Smart Trip Scheduling",
      description: "Optimize trip schedules to maximize vehicle utilization",
      enabled: true,
      category: "scheduling",
      icon: <FiZap size={24} />,
      stats: { triggered: 23, lastRun: "5 hours ago" },
    },
    {
      id: 5,
      name: "Driver Performance Alerts",
      description:
        "Notify when driver performance metrics fall below threshold",
      enabled: false,
      category: "monitoring",
      icon: <FiSettings size={24} />,
      stats: { triggered: 3, lastRun: "1 week ago" },
    },
  ]);

  const toggleRule = (ruleId) => {
    setAutomationRules((prev) =>
      prev.map((rule) => {
        if (rule.id === ruleId) {
          const newEnabled = !rule.enabled;
          addNotification({
            type: newEnabled ? "success" : "info",
            title: `Automation ${newEnabled ? "Enabled" : "Disabled"}`,
            message: `${rule.name} has been ${newEnabled ? "enabled" : "disabled"}`,
          });
          return { ...rule, enabled: newEnabled };
        }
        return rule;
      })
    );
  };

  const categories = [
    { key: "all", label: "All Automations", count: automationRules.length },
    { key: "trip-assignment", label: "Trip Assignment", count: 1 },
    { key: "maintenance", label: "Maintenance", count: 1 },
    { key: "routes", label: "Routes", count: 1 },
    { key: "scheduling", label: "Scheduling", count: 1 },
    { key: "monitoring", label: "Monitoring", count: 1 },
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredRules =
    selectedCategory === "all"
      ? automationRules
      : automationRules.filter((rule) => rule.category === selectedCategory);

  const enabledCount = automationRules.filter((r) => r.enabled).length;
  const totalTriggered = automationRules.reduce(
    (sum, r) => sum + r.stats.triggered,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] flex items-center gap-3">
            <MdAutoMode size={32} className="text-blue-600" />
            Workflow Automation
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Streamline operations with intelligent automation
          </p>
        </div>
        <Button icon={<FiSettings size={18} />} variant="outline">
          Configure Rules
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">
                Active Rules
              </p>
              <p className="text-3xl font-bold text-blue-600 mt-1">
                {enabledCount}/{automationRules.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <FiZap size={24} className="text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">
                Total Triggered
              </p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {totalTriggered}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <FiTrendingUp size={24} className="text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Time Saved</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">12.5h</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
              <FiClock size={24} className="text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Category Filter */}
      <Card>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === category.key
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
              }`}
            >
              {category.label}
              <span className="ml-2 text-xs opacity-75">
                ({category.count})
              </span>
            </button>
          ))}
        </div>
      </Card>

      {/* Automation Rules */}
      <div className="grid grid-cols-1 gap-4">
        {filteredRules.map((rule) => (
          <Card
            key={rule.id}
            className={`transition-all hover:shadow-lg ${
              rule.enabled ? "border-blue-500/30" : "opacity-60"
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  rule.enabled
                    ? "bg-blue-500/20 text-blue-600"
                    : "bg-[var(--bg-secondary)] text-[var(--text-tertiary)]"
                }`}
              >
                {rule.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                      {rule.name}
                      {rule.enabled && (
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-600 text-xs font-medium rounded">
                          Active
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                      {rule.description}
                    </p>
                  </div>
                  <Toggle
                    enabled={rule.enabled}
                    onChange={() => toggleRule(rule.id)}
                  />
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm text-[var(--text-tertiary)] mt-3">
                  <div className="flex items-center gap-2">
                    <FiZap size={14} />
                    <span>Triggered: {rule.stats.triggered} times</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiClock size={14} />
                    <span>Last run: {rule.stats.lastRun}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-1">
              Need more automation?
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Create custom rules or request new automation features
            </p>
          </div>
          <Button icon={<FiSettings size={18} />}>Create Custom Rule</Button>
        </div>
      </Card>
    </div>
  );
}
