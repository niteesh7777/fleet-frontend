import PropTypes from "prop-types";
import { FiEdit, FiTrash, FiCalendar } from "react-icons/fi";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import EmptyState from "../../../components/ui/EmptyState";

const SERVICE_TYPE_COLORS = {
    "oil-change": "blue",
    "engine-check": "purple",
    "tire-replacement": "orange",
    "brake-service": "red",
    "accident-repair": "danger",
    "general-service": "success",
    "pollution-check": "info",
    "insurance-renewal": "indigo",
    "other": "secondary",
};

const SERVICE_TYPE_LABELS = {
    "oil-change": "Oil Change",
    "engine-check": "Engine Check",
    "tire-replacement": "Tire Replacement",
    "brake-service": "Brake Service",
    "accident-repair": "Accident Repair",
    "general-service": "General Service",
    "pollution-check": "Pollution Check",
    "insurance-renewal": "Insurance Renewal",
    "other": "Other",
};

const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const formatCost = (cost) => {
    return `₹${cost.toLocaleString("en-IN")}`;
};

export default function MaintenanceTable({ logs, onEdit, onDelete }) {
    if (logs.length === 0) {
        return (
            <EmptyState
                title="No maintenance logs found"
                message="Create your first maintenance log to get started"
            />
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-[var(--border-primary)]">
                        <th className="text-left p-4 text-sm font-semibold text-[var(--text-primary)]">
                            Vehicle
                        </th>
                        <th className="text-left p-4 text-sm font-semibold text-[var(--text-primary)]">
                            Service Type
                        </th>
                        <th className="text-left p-4 text-sm font-semibold text-[var(--text-primary)]">
                            Description
                        </th>
                        <th className="text-left p-4 text-sm font-semibold text-[var(--text-primary)]">
                            Service Date
                        </th>
                        <th className="text-left p-4 text-sm font-semibold text-[var(--text-primary)]">
                            Cost
                        </th>
                        <th className="text-left p-4 text-sm font-semibold text-[var(--text-primary)]">
                            Next Due
                        </th>
                        <th className="text-left p-4 text-sm font-semibold text-[var(--text-primary)]">
                            Vendor
                        </th>
                        <th className="text-right p-4 text-sm font-semibold text-[var(--text-primary)]">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log) => (
                        <tr
                            key={log._id}
                            className="border-b border-[var(--border-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                        >
                            <td className="p-4">
                                <div className="font-medium text-[var(--text-primary)]">
                                    {log.vehicleId?.vehicleNo || log.vehicleId}
                                </div>
                                {log.vehicleId?.model && (
                                    <div className="text-xs text-[var(--text-tertiary)]">
                                        {log.vehicleId.model}
                                    </div>
                                )}
                            </td>
                            <td className="p-4">
                                <Badge variant={SERVICE_TYPE_COLORS[log.serviceType] || "secondary"}>
                                    {SERVICE_TYPE_LABELS[log.serviceType] || log.serviceType}
                                </Badge>
                            </td>
                            <td className="p-4">
                                <div className="text-sm text-[var(--text-secondary)] max-w-xs truncate">
                                    {log.description}
                                </div>
                            </td>
                            <td className="p-4">
                                <div className="text-sm text-[var(--text-secondary)]">
                                    {formatDate(log.serviceDate)}
                                </div>
                            </td>
                            <td className="p-4">
                                <div className="text-sm font-medium text-[var(--text-primary)]">
                                    {formatCost(log.cost)}
                                </div>
                            </td>
                            <td className="p-4">
                                <div className="text-sm text-[var(--text-secondary)] flex items-center gap-1">
                                    {log.nextDueDate ? (
                                        <>
                                            <FiCalendar size={14} />
                                            {formatDate(log.nextDueDate)}
                                        </>
                                    ) : (
                                        "-"
                                    )}
                                </div>
                            </td>
                            <td className="p-4">
                                <div className="text-sm text-[var(--text-secondary)]">
                                    {log.vendor?.name || "-"}
                                </div>
                            </td>
                            <td className="p-4">
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        icon={<FiEdit size={16} />}
                                        onClick={() => onEdit(log)}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        icon={<FiTrash size={16} />}
                                        onClick={() => onDelete(log)}
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

MaintenanceTable.propTypes = {
    logs: PropTypes.array.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};
