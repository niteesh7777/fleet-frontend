import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";

export default function DeleteClientModal({
  open,
  onClose,
  onConfirm,
  client,
}) {
  if (!client) return null;

  return (
    <Modal isOpen={open} onClose={onClose} title="Delete Client">
      <p className="text-[var(--text-secondary)] mb-6">
        Delete <span className="font-semibold text-[var(--text-primary)]">{client.name}</span>?
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
          onClick={() => onConfirm(client._id)}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
}
