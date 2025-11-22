import Card from "../../../components/ui/Card";
import StatusBadge from "../../../components/ui/StatusBadge";
import Button from "../../../components/ui/Button";

export default function DriversTable({ drivers, onEdit, onDelete }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[var(--bg-secondary)]">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">#</th>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Phone</th>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">License No</th>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Exp</th>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--border-primary)]">
            {drivers.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-8 text-center text-[var(--text-tertiary)]">
                  No drivers found.
                </td>
              </tr>
            ) : (
              drivers.map((d, i) => (
                <tr key={d._id} className="table-row-hover transition-colors">
                  <td className="px-4 py-4 text-sm text-[var(--text-tertiary)]">{i + 1}</td>
                  <td className="px-4 py-4 font-medium text-[var(--text-primary)]">
                    {d.user?.name}
                  </td>
                  <td className="px-4 py-4 text-[var(--text-secondary)]">
                    {d.user?.email}
                  </td>
                  <td className="px-4 py-4 text-[var(--text-secondary)]">
                    {d.contact.phone}
                  </td>
                  <td className="px-4 py-4 font-mono text-sm text-[var(--text-primary)]">
                    {d.licenseNo}
                  </td>
                  <td className="px-4 py-4 text-[var(--text-secondary)]">
                    {d.experienceYears} yrs
                  </td>

                  <td className="px-4 py-4">
                    <StatusBadge status={d.status} />
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(d)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[var(--danger)] hover:text-[var(--danger)] hover:bg-[var(--danger-light)]"
                        onClick={() => onDelete(d)}
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
