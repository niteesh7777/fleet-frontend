import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";

export default function DeleteTripModal({ open, onClose, onConfirm, trip }) {
  if (!trip) return null;

  return (
    <Modal isOpen={open} onClose={onClose} title="Delete Trip">
      <p className="text-[var(--text-secondary)] mb-6">
        Are you sure you want to delete the trip <br />
        <span className="text-[var(--text-primary)] font-semibold">
          {trip.startLocation} → {trip.endLocation}
        </span>
        ?
      </p>

      <div className="flex justify-end gap-3">
        <Button
          variant="ghost"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={() => onConfirm(trip._id)}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
}
