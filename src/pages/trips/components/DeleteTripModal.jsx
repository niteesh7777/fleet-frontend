import { useState, useEffect } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import StatusBadge from "../../../components/ui/StatusBadge";
import { FiAlertCircle, FiInfo } from "react-icons/fi";
import { tripApi } from "../../../api/endpoints";

export default function DeleteTripModal({ open, onClose, onConfirm, trip }) {
  const [loading, setLoading] = useState(false);
  const [dependencies, setDependencies] = useState(null);

  useEffect(() => {
    if (open && trip) {
      fetchDependencies();
    }
  }, [open, trip]);

  const fetchDependencies = async () => {
    setLoading(true);
    try {
      const deps = await tripApi.getDependencies(trip._id);
      setDependencies(deps);
    } catch (error) {
      console.error("Failed to fetch dependencies:", error);
      setDependencies(null);
    } finally {
      setLoading(false);
    }
  };

  if (!trip) return null;

  return (
    <Modal isOpen={open} onClose={onClose} title="Delete Trip">
      <div className="space-y-4">
        <div>
          <p className="text-(--text-secondary) mb-2">
            Are you sure you want to delete this trip?
          </p>
          <div className="flex items-center gap-2 text-(--text-primary) font-semibold">
            <span>{trip.startLocation || trip.source}</span>
            <span>→</span>
            <span>{trip.endLocation || trip.destination}</span>
          </div>
          {trip.tripCode && (
            <p className="text-sm text-(--text-secondary) mt-1">
              Trip Code: {trip.tripCode}
            </p>
          )}
        </div>

        {loading ? (
          <Card className="p-4">
            <div className="flex items-center gap-2 text-(--text-secondary)">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-(--primary)"></div>
              <span>Checking trip status...</span>
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
                  {dependencies.canDelete ? "Trip Status" : "Cannot Delete"}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-(--text-secondary)">
                      Status:
                    </span>
                    <StatusBadge status={dependencies.status} />
                  </div>
                  <ul className="text-sm text-(--text-secondary) space-y-1">
                    <li>• {dependencies.vehicleCount} vehicle(s) assigned</li>
                    <li>• {dependencies.driverCount} driver(s) assigned</li>
                  </ul>
                </div>

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

                {dependencies.canDelete && (
                  <p className="text-xs text-(--text-secondary) mt-2">
                    Note: Assigned vehicles and drivers will be released.
                  </p>
                )}
              </div>
            </div>
          </Card>
        ) : null}

        {!dependencies?.canDelete && dependencies && (
          <Card className="p-3 bg-(--warning)/10 border-(--warning)">
            <p className="text-sm text-(--text-secondary)">
              Complete or cancel the trip before deleting it.
            </p>
          </Card>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={() => onConfirm(trip._id)}
            disabled={loading || (dependencies && !dependencies.canDelete)}
          >
            {loading ? "Checking..." : "Delete"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
