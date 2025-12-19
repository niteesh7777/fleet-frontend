import PropTypes from "prop-types";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";

export default function DeleteRouteModal({ route, onClose, onConfirm }) {
    if (!route) return null;

    return (
        <Modal isOpen={!!route} onClose={onClose} title="Delete Route">
            <div className="space-y-4">
                <p className="text-[var(--text-secondary)]">
                    Are you sure you want to delete the route{" "}
                    <span className="font-semibold text-[var(--text-primary)]">
                        {route.name}
                    </span>
                    ? This action cannot be undone.
                </p>

                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={() => onConfirm(route._id)}>
                        Delete Route
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

DeleteRouteModal.propTypes = {
    route: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
};
