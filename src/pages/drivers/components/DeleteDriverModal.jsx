export default function DeleteDriverModal({
  open,
  onClose,
  onConfirm,
  driver,
}) {
  if (!open || !driver) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1A1A1A] p-6 rounded-xl w-full max-w-md border border-gray-800">
        <h2 className="text-xl font-semibold text-white mb-4">Delete Driver</h2>

        <p className="text-gray-300 mb-6">
          Are you sure you want to delete{" "}
          <span className="text-red-400 font-semibold">
            {driver.user?.name}
          </span>
          ? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirm(driver._id)}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
