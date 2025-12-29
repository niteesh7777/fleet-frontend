import { useState, useEffect } from "react";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import StatusBadge from "../../components/ui/StatusBadge";
import { FiAlertCircle, FiInfo } from "react-icons/fi";
import { vehicleApi } from "../../api/endpoints";

export default function DeleteVehicleModal({
  open,
  onClose,
  onConfirm,
  vehicle,
}) {
  const [loading, setLoading] = useState(false);
  const [dependencies, setDependencies] = useState(null);

  useEffect(() => {
    if (open && vehicle) {
      fetchDependencies();
    }
  }, [open, vehicle]);

  const fetchDependencies = async () => {
    setLoading(true);
    try {
      const deps = await vehicleApi.getDependencies(vehicle._id);
      setDependencies(deps);
    } catch (error) {
      console.error("Failed to fetch dependencies:", error);
      setDependencies(null);
    } finally {
      setLoading(false);
    }
  };

  if (!vehicle) return null;

  return (
    <Modal isOpen={open} onClose={onClose} title="Delete Vehicle">
      <div className="space-y-4">
        <div>
          <p className="text-(--text-secondary) mb-2">
            Are you sure you want to delete this vehicle?
          </p>
          <div className="flex items-center gap-3">
            <span className="text-(--danger) font-semibold text-lg">
              {vehicle.vehicleNo}
            </span>
            <span className="text-(--text-secondary)">•</span>
            <span className="text-(--text-primary) font-medium">
              {vehicle.model}
            </span>
            <StatusBadge status={vehicle.status} />
          </div>
        </div>

        {loading ? (
          <Card className="p-4">
            <div className="flex items-center gap-2 text-(--text-secondary)">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-(--primary)"></div>
              <span>Checking dependencies...</span>
            </div>
          </Card>
        ) : dependencies ? (
          <Card
            className={`p-4 ${
              dependencies.canDelete
                ? "bg-(--info)/10 border-(--info)"
                : "bg-(--danger)/10 border-(--danger)"
            }`}
          >
            <div className="flex gap-3">
              {dependencies.canDelete ? (
                <FiInfo
                  className="text-(--info) flex-shrink-0 mt-0.5"
                  size={20}
                />
              ) : (
                <FiAlertCircle
                  className="text-(--danger) flex-shrink-0 mt-0.5"
                  size={20}
                />
              )}
              <div className="flex-1">
                <p
                  className={`font-semibold mb-2 ${
                    dependencies.canDelete ? "text-(--info)" : "text-(--danger)"
                  }`}
                >
                  {dependencies.canDelete
                    ? "Impact Assessment"
                    : "Cannot Delete"}
                </p>
                <ul className="text-sm text-(--text-secondary) space-y-1">
                  <li>• {dependencies.activeTrips} active trip(s)</li>
                  <li>• {dependencies.assignedDrivers} assigned driver(s)</li>
                </ul>

                {!dependencies.canDelete &&
                  dependencies.blockingReasons.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-(--danger)/20">
                      <p className="text-sm font-medium text-(--danger) mb-1">
                        Action Required:
                      </p>
                      <ul className="text-sm text-(--danger) space-y-1">
                        {dependencies.blockingReasons.map((reason, index) => (
                          <li key={index}>• {reason}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                {dependencies.canDelete && dependencies.assignedDrivers > 0 && (
                  <p className="text-xs text-(--text-secondary) mt-2">
                    Note: All drivers will be unassigned from this vehicle.
                  </p>
                )}
              </div>
            </div>
          </Card>
        ) : null}

        {!dependencies?.canDelete && dependencies && (
          <Card className="p-3 bg-(--warning)/10 border-(--warning)">
            <p className="text-sm text-(--text-secondary)">
              Complete or reassign active trips before deleting this vehicle.
            </p>
          </Card>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={() => onConfirm(vehicle._id)}
            disabled={loading || (dependencies && !dependencies.canDelete)}
          >
            {loading ? "Checking..." : "Delete"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
