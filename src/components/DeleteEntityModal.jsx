import { useState, useEffect } from "react";
import Modal from "./ui/Modal";
import Button from "./ui/Button";
import Card from "./ui/Card";
import { FiAlertCircle, FiInfo } from "react-icons/fi";

/**
 * Generic reusable delete entity modal
 * Eliminates duplication across DeleteDriverModal, DeleteTripModal, etc.
 *
 * @param {boolean} open - Modal open state
 * @param {Function} onClose - Close modal callback
 * @param {Function} onConfirm - Confirm delete callback (receives entity ID)
 * @param {Object} entity - Entity to delete
 * @param {string} entityType - Type of entity (for display: 'driver', 'vehicle', etc.)
 * @param {string} entityName - Display name of entity
 * @param {Object} apiService - API service with getDependencies method
 * @param {Function} renderEntityDetails - Optional custom entity details renderer
 * @param {Function} renderDependencies - Custom dependencies renderer
 * @param {string} title - Optional custom modal title
 * @param {string} deleteNote - Optional note about what happens on delete
 *
 * @example
 * <DeleteEntityModal
 *   open={deleteModalOpen}
 *   onClose={() => setDeleteModalOpen(false)}
 *   onConfirm={handleConfirmDelete}
 *   entity={driver}
 *   entityType="driver"
 *   entityName={driver?.user?.name}
 *   apiService={driverApi}
 *   renderDependencies={(deps) => (
 *     <>
 *       <li>• {deps.activeTrips} active trip(s)</li>
 *       <li>• {deps.assignedVehicles} assigned vehicle(s)</li>
 *     </>
 *   )}
 *   deleteNote="Driver will be unassigned from all vehicles."
 * />
 */
export default function DeleteEntityModal({
  open,
  onClose,
  onConfirm,
  entity,
  entityType = "item",
  entityName,
  apiService,
  renderEntityDetails,
  renderDependencies,
  title,
  deleteNote,
}) {
  const [loading, setLoading] = useState(false);
  const [dependencies, setDependencies] = useState(null);

  useEffect(() => {
    if (open && entity && apiService?.getDependencies) {
      fetchDependencies();
    }
  }, [open, entity]);

  const fetchDependencies = async () => {
    setLoading(true);
    try {
      const deps = await apiService.getDependencies(entity._id);
      setDependencies(deps);
    } catch (error) {
      console.error("Failed to fetch dependencies:", error);
      setDependencies(null);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    onConfirm(entity._id);
  };

  if (!entity) return null;

  const modalTitle =
    title ||
    `Delete ${entityType.charAt(0).toUpperCase() + entityType.slice(1)}`;

  return (
    <Modal isOpen={open} onClose={onClose} title={modalTitle}>
      <div className="space-y-4">
        {/* Confirmation message */}
        <div>
          <p className="text-[var(--text-secondary)]">
            Are you sure you want to delete{" "}
            {entityName ? (
              <span className="font-semibold text-[var(--danger)]">
                {entityName}
              </span>
            ) : (
              `this ${entityType}`
            )}
            ?
          </p>

          {/* Custom entity details */}
          {renderEntityDetails && (
            <div className="mt-2">{renderEntityDetails(entity)}</div>
          )}
        </div>

        {/* Loading state */}
        {loading && (
          <Card className="p-4">
            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--primary)]"></div>
              <span>Checking dependencies...</span>
            </div>
          </Card>
        )}

        {/* Dependencies display */}
        {!loading && dependencies && (
          <Card
            className={`p-4 ${
              dependencies.canDelete
                ? "bg-[var(--info)]/10 border-[var(--info)]"
                : "bg-[var(--danger)]/10 border-[var(--danger)]"
            }`}
          >
            <div className="flex gap-3">
              {dependencies.canDelete ? (
                <FiInfo
                  className="text-[var(--info)] flex-shrink-0 mt-0.5"
                  size={20}
                />
              ) : (
                <FiAlertCircle
                  className="text-[var(--danger)] flex-shrink-0 mt-0.5"
                  size={20}
                />
              )}
              <div className="flex-1">
                <p
                  className={`font-semibold mb-2 ${
                    dependencies.canDelete
                      ? "text-[var(--info)]"
                      : "text-[var(--danger)]"
                  }`}
                >
                  {dependencies.canDelete
                    ? "Impact Assessment"
                    : "Cannot Delete"}
                </p>

                {/* Custom dependencies renderer */}
                {renderDependencies && (
                  <ul className="text-sm text-[var(--text-secondary)] space-y-1">
                    {renderDependencies(dependencies)}
                  </ul>
                )}

                {/* Blocking reasons */}
                {!dependencies.canDelete &&
                  dependencies.blockingReasons &&
                  dependencies.blockingReasons.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[var(--danger)]/20">
                      <p className="text-sm font-medium text-[var(--danger)] mb-1">
                        Action Required:
                      </p>
                      <ul className="text-sm text-[var(--danger)] space-y-1">
                        {dependencies.blockingReasons.map((reason, index) => (
                          <li key={index}>• {reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            </div>
          </Card>
        )}

        {/* Delete note */}
        {deleteNote && dependencies?.canDelete && (
          <p className="text-sm text-[var(--text-tertiary)] italic">
            Note: {deleteNote}
          </p>
        )}

        {/* Action buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            disabled={loading || (dependencies && !dependencies.canDelete)}
          >
            Delete {entityType.charAt(0).toUpperCase() + entityType.slice(1)}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
