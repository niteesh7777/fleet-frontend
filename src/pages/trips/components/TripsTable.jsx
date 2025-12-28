import Card from "../../../components/ui/Card";
import StatusBadge from "../../../components/ui/StatusBadge";
import Button from "../../../components/ui/Button";
import { FiNavigation, FiClock, FiEye } from "react-icons/fi";
import CompleteTripButton from "./CompleteTripButton";
import { useAuthStore } from "../../../store/authStore";

export default function TripsTable({
  trips,
  onEdit,
  onDelete,
  onUpdateProgress,
  onViewTimeline,
  onTripComplete,
}) {
  const { user } = useAuthStore();
  const isAdmin = [
    "company_owner",
    "company_admin",
    "company_manager",
  ].includes(user?.companyRole);

  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[var(--bg-secondary)]">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                #
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Client
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Driver
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Vehicle
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Route
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Amount
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Progress
              </th>
              {isAdmin && (
                <th className="px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--border-primary)]">
            {trips.length === 0 ? (
              <tr>
                <td
                  colSpan={isAdmin ? "9" : "8"}
                  className="py-8 text-center text-[var(--text-tertiary)]"
                >
                  No trips found.
                </td>
              </tr>
            ) : (
              trips.map((t, i) => (
                <tr key={t._id} className="table-row-hover transition-colors">
                  <td className="px-4 py-4 text-sm text-[var(--text-tertiary)]">
                    {i + 1}
                  </td>
                  <td className="px-4 py-4 font-medium text-[var(--text-primary)]">
                    {t.clientId?.name}
                  </td>
                  <td className="px-4 py-4 text-[var(--text-secondary)]">
                    {t.driverIds?.[0]?.licenseNo || "—"}
                  </td>
                  <td className="px-4 py-4 font-mono text-sm text-[var(--text-primary)]">
                    {t.vehicleIds?.[0]?.vehicleNo || "—"}
                  </td>
                  <td className="px-4 py-4 text-[var(--text-secondary)]">
                    {t.routeId?.source?.name} → {t.routeId?.destination?.name}
                  </td>
                  <td className="px-4 py-4 font-medium text-[var(--text-primary)]">
                    ₹{t.tripCost}
                  </td>

                  <td className="px-4 py-4">
                    <StatusBadge status={t.status} />
                  </td>

                  {/* Progress Actions Column */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {/* Update Progress - Only for active trips */}
                      {("pending",
                      "in-progress",
                      "delayed",
                      "at-waypoint").includes(t.status) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onUpdateProgress?.(t)}
                          icon={<FiNavigation size={14} />}
                          className="text-blue-600 hover:text-blue-700"
                          title="Update progress"
                        >
                          Update
                        </Button>
                      )}

                      {/* View Timeline - Always available */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewTimeline?.(t)}
                        icon={<FiEye size={14} />}
                        className="text-purple-600 hover:text-purple-700"
                        title="View timeline"
                      >
                        Timeline
                      </Button>

                      {/* Complete Trip Button */}
                      <CompleteTripButton
                        trip={t}
                        onSuccess={() => onTripComplete?.(t)}
                        variant="ghost"
                        className="text-green-600 hover:text-green-700"
                      />
                    </div>
                  </td>

                  {/* Management Actions Column */}
                  {isAdmin && (
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(t)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[var(--danger)] hover:text-[var(--danger)] hover:bg-[var(--danger-light)]"
                          onClick={() => onDelete(t)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
