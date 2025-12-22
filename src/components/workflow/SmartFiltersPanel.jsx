import { useState } from "react";
import { FiFilter, FiSave, FiTrash2 } from "react-icons/fi";
import Button from "../ui/Button";
import Card from "../ui/Card";
import toast from "react-hot-toast";

/**
 * Smart Filters Panel
 * Save and quickly access common filter combinations
 */
export default function SmartFiltersPanel({ onApplyFilter }) {
  const [savedFilters, setSavedFilters] = useState([
    {
      id: 1,
      name: "Available Vehicles",
      description: "All vehicles ready for assignment",
      filters: { status: "available" },
      count: 23,
      color: "green",
    },
    {
      id: 2,
      name: "Active Trips Today",
      description: "Trips in progress today",
      filters: { status: "in-transit", dateRange: "today" },
      count: 8,
      color: "blue",
    },
    {
      id: 3,
      name: "Overdue Maintenance",
      description: "Vehicles requiring immediate attention",
      filters: { maintenanceStatus: "overdue" },
      count: 5,
      color: "red",
    },
    {
      id: 4,
      name: "Idle Drivers",
      description: "Drivers available for assignment",
      filters: { driverStatus: "available" },
      count: 12,
      color: "purple",
    },
  ]);

  const applyFilter = (filter) => {
    toast.success(`Applied filter: ${filter.name}`);
    console.log("SmartFiltersPanel: Applying filter:", filter.filters);

    // Debug: Transform frontend filters to backend-expected format
    const backendFilters = transformFiltersForBackend(filter.filters);
    console.log(
      "SmartFiltersPanel: Transformed filters for backend:",
      backendFilters
    );

    onApplyFilter?.(backendFilters);
  };

  // Helper function to transform frontend filters to backend format
  const transformFiltersForBackend = (frontendFilters) => {
    const backendFilters = { ...frontendFilters };

    // Transform status values for trips
    if (backendFilters.status === "in-progress") {
      backendFilters.status = "in-transit";
    }

    // Transform date range filter
    if (backendFilters.dateRange === "today") {
      const today = new Date();
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0,
        0,
        0,
        0
      );
      const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59,
        999
      );

      delete backendFilters.dateRange;
      backendFilters.startDate = startOfDay.toISOString();
      backendFilters.endDate = endOfDay.toISOString();
    }

    return backendFilters;
  };

  const deleteFilter = (filterId) => {
    setSavedFilters((prev) => prev.filter((f) => f.id !== filterId));
    toast.success("Filter deleted");
  };

  const colorClasses = {
    green: "border-green-500/30 bg-green-500/10 text-green-600",
    blue: "border-blue-500/30 bg-blue-500/10 text-blue-600",
    red: "border-red-500/30 bg-red-500/10 text-red-600",
    purple: "border-purple-500/30 bg-purple-500/10 text-purple-600",
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <FiFilter size={20} className="text-blue-600" />
            Smart Filters
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Quick access to saved filter combinations
          </p>
        </div>
        <Button variant="outline" size="sm" icon={<FiSave size={16} />}>
          Save Current
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {savedFilters.map((filter) => (
          <div
            key={filter.id}
            className={`relative p-4 rounded-lg border-2 transition-all hover:shadow-md ${
              colorClasses[filter.color]
            }`}
          >
            <button
              onClick={() => deleteFilter(filter.id)}
              className="absolute top-2 right-2 p-1 hover:bg-red-500/20 rounded text-red-600 transition-colors"
              title="Delete filter"
            >
              <FiTrash2 size={14} />
            </button>

            <div className="mb-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{filter.count}</span>
                <FiFilter size={20} />
              </div>
            </div>

            <h4 className="font-semibold text-[var(--text-primary)] text-sm mb-1">
              {filter.name}
            </h4>
            <p className="text-xs text-[var(--text-secondary)] mb-3">
              {filter.description}
            </p>

            <button
              onClick={() => applyFilter(filter)}
              className="w-full py-2 px-3 bg-[var(--bg-elevated)] hover:bg-[var(--bg-secondary)] rounded text-sm font-medium transition-colors"
            >
              Apply Filter
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}
