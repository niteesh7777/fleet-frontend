import PropTypes from "prop-types";
import {
  FiEdit,
  FiTrash,
  FiMapPin,
  FiClock,
  FiDollarSign,
} from "react-icons/fi";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import EmptyState from "../../../components/ui/EmptyState";
import { calculateRouteEstimate } from "../../../utils/routeValidation";

export default function RoutesTable({ routes, onEdit, onDelete }) {
  if (routes.length === 0) {
    return (
      <EmptyState
        title="No routes found"
        message="Create your first route to get started"
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--border-primary)]">
            <th className="text-left p-4 text-sm font-semibold text-[var(--text-primary)]">
              Route Name
            </th>
            <th className="text-left p-4 text-sm font-semibold text-[var(--text-primary)]">
              Source → Destination
            </th>
            <th className="text-left p-4 text-sm font-semibold text-[var(--text-primary)]">
              Distance
            </th>
            <th className="text-left p-4 text-sm font-semibold text-[var(--text-primary)]">
              Duration
            </th>
            <th className="text-left p-4 text-sm font-semibold text-[var(--text-primary)]">
              Waypoints
            </th>
            <th className="text-left p-4 text-sm font-semibold text-[var(--text-primary)]">
              Tolls
            </th>
            <th className="text-left p-4 text-sm font-semibold text-[var(--text-primary)]">
              Est. Cost
            </th>
            <th className="text-left p-4 text-sm font-semibold text-[var(--text-primary)]">
              Status
            </th>
            <th className="text-right p-4 text-sm font-semibold text-[var(--text-primary)]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => (
            <tr
              key={route._id}
              className="border-b border-[var(--border-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
            >
              <td className="p-4">
                <div className="font-medium text-[var(--text-primary)]">
                  {route.name}
                </div>
              </td>
              <td className="p-4">
                <div className="text-sm text-[var(--text-secondary)]">
                  {route.source?.name} → {route.destination?.name}
                </div>
              </td>
              <td className="p-4">
                <div className="text-sm text-[var(--text-secondary)]">
                  {route.distanceKm} km
                </div>
              </td>
              <td className="p-4">
                <div className="text-sm text-[var(--text-secondary)]">
                  {route.estimatedDurationHr} hrs
                </div>
              </td>
              <td className="p-4">
                <div className="text-sm text-[var(--text-secondary)]">
                  {route.waypoints?.length || 0}
                </div>
              </td>
              <td className="p-4">
                <div className="text-sm text-[var(--text-secondary)]">
                  {route.tolls?.length || 0} tolls
                </div>
              </td>
              <td className="p-4">
                {(() => {
                  const estimate = calculateRouteEstimate(route);
                  return (
                    <div className="text-sm">
                      <div className="font-medium text-[var(--text-primary)]">
                        ₹{estimate.totalCost}
                      </div>
                      <div className="text-xs text-[var(--text-secondary)]">
                        Fuel: ₹{estimate.fuelCost} | Tolls: ₹{estimate.tollCost}
                      </div>
                    </div>
                  );
                })()}
              </td>
              <td className="p-4">
                <Badge variant={route.isActive ? "success" : "secondary"}>
                  {route.isActive ? "Active" : "Inactive"}
                </Badge>
              </td>
              <td className="p-4">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<FiEdit size={16} />}
                    onClick={() => onEdit(route)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<FiTrash size={16} />}
                    onClick={() => onDelete(route)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

RoutesTable.propTypes = {
  routes: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
