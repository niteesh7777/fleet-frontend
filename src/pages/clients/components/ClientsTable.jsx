import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

export default function ClientsTable({ clients, onEdit, onDelete }) {
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
              <th className="px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">City</th>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">GST</th>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--border-primary)]">
            {clients.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-[var(--text-tertiary)]">
                  No clients found.
                </td>
              </tr>
            ) : (
              clients.map((c, i) => (
                <tr key={c._id} className="table-row-hover transition-colors">
                  <td className="px-4 py-4 text-sm text-[var(--text-tertiary)]">{i + 1}</td>
                  <td className="px-4 py-4 font-medium text-[var(--text-primary)]">{c.name}</td>
                  <td className="px-4 py-4 text-[var(--text-secondary)]">{c.email}</td>
                  <td className="px-4 py-4 text-[var(--text-secondary)]">{c.phone}</td>
                  <td className="px-4 py-4 text-[var(--text-secondary)]">{c.address?.city}</td>
                  <td className="px-4 py-4 font-mono text-sm text-[var(--text-primary)]">{c.gstNumber}</td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(c)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[var(--danger)] hover:text-[var(--danger)] hover:bg-[var(--danger-light)]"
                        onClick={() => onDelete(c)}
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
