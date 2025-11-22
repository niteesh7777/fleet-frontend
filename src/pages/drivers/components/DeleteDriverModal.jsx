import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";

export default function DeleteDriverModal({
  open,
  onClose,
  onConfirm,
  driver,
}) {
  if (!driver) return null;

  return (
    <Modal isOpen={open} onClose={onClose} title="Delete Driver">
      <p className="text-[var(--text-secondary)] mb-6">
        Are you sure you want to delete{" "}
        <span className="text-[var(--danger)] font-semibold">
          {driver.user?.name}
        </span>
        ? This action cannot be undone.
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
          onClick={() => onConfirm(driver._id)}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
}
