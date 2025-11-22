import Card from "../../../components/ui/Card";
import StatusBadge from "../../../components/ui/StatusBadge";
import Button from "../../../components/ui/Button";

export default function TripsTable({ trips, onEdit, onDelete }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[var(--bg-secondary)]">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">#</th>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Client</th>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Driver</th>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Vehicle</th>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Route</th>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Amount</th>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--border-primary)]">
            {trips.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-8 text-center text-[var(--text-tertiary)]">
                  No trips found.
                </td>
              </tr>
            ) : (
              trips.map((t, i) => (
                <tr key={t._id} className="table-row-hover transition-colors">
                  <td className="px-4 py-4 text-sm text-[var(--text-tertiary)]">{i + 1}</td>
                  <td className="px-4 py-4 font-medium text-[var(--text-primary)]">{t.client?.name}</td>
                  <td className="px-4 py-4 text-[var(--text-secondary)]">{t.driver?.user?.name}</td>
                  <td className="px-4 py-4 font-mono text-sm text-[var(--text-primary)]">{t.vehicle?.vehicleNo}</td>
                  <td className="px-4 py-4 text-[var(--text-secondary)]">
                    {t.startLocation} → {t.endLocation}
                  </td>
                  <td className="px-4 py-4 font-medium text-[var(--text-primary)]">₹{t.totalAmount}</td>

                  <td className="px-4 py-4">
                    <StatusBadge status={t.status} />
                  </td>

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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
