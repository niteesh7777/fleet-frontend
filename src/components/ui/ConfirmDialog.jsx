import PropTypes from "prop-types";
import Modal from "./Modal";
import Button from "./Button";
import { FiAlertTriangle, FiTrash2, FiX } from "react-icons/fi";

/**
 * Confirmation dialog for critical actions
 * Prevents accidental deletions and destructive operations
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger", // danger, warning, info
  loading = false,
}) {
  const icons = {
    danger: <FiTrash2 size={48} className="text-red-500" />,
    warning: <FiAlertTriangle size={48} className="text-yellow-500" />,
    info: <FiAlertTriangle size={48} className="text-blue-500" />,
  };

  const buttonVariants = {
    danger: "danger",
    warning: "warning",
    info: "primary",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="small">
      <div className="text-center space-y-4">
        <div className="flex justify-center">{icons[variant]}</div>

        <h2 className="text-2xl font-bold text-[var(--text-primary)]">
          {title}
        </h2>

        <p className="text-[var(--text-secondary)]">{message}</p>

        <div className="flex gap-3 justify-center pt-4">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
            icon={<FiX size={18} />}
          >
            {cancelText}
          </Button>
          <Button
            variant={buttonVariants[variant]}
            onClick={onConfirm}
            loading={loading}
            icon={
              variant === "danger" ? (
                <FiTrash2 size={18} />
              ) : (
                <FiAlertTriangle size={18} />
              )
            }
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  variant: PropTypes.oneOf(["danger", "warning", "info"]),
  loading: PropTypes.bool,
};
