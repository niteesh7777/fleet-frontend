import PropTypes from "prop-types";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";

export default function DeleteMaintenanceModal({ log, onClose, onConfirm }) {
    if (!log) return null;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <Modal isOpen={!!log} onClose={onClose} title="Delete Maintenance Log">
            <div className="space-y-4">
                <p className="text-[var(--text-secondary)]">
                    Are you sure you want to delete this maintenance log?
                </p>

                <div className="bg-[var(--bg-secondary)] p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                        <span className="text-sm text-[var(--text-tertiary)]">Vehicle:</span>
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                            {log.vehicleId?.vehicleNo || "N/A"}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-[var(--text-tertiary)]">Service Type:</span>
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                            {log.serviceType}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-[var(--text-tertiary)]">Service Date:</span>
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                            {formatDate(log.serviceDate)}
                        </span>
                    </div>
                </div>

                <p className="text-sm text-[var(--text-tertiary)]">
                    This action cannot be undone.
                </p>

                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={() => onConfirm(log._id)}>
                        Delete Log
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

DeleteMaintenanceModal.propTypes = {
    log: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
};
