export default function DeleteClientModal({
  open,
  onClose,
  onConfirm,
  client,
}) {
  if (!open || !client) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-[#1A1A1A] p-6 rounded-lg max-w-md border border-gray-800">
        <h2 className="text-xl text-white">Delete Client</h2>
        <p className="text-gray-300 mt-2 mb-6">
          Delete <span className="font-semibold">{client.name}</span>?
        </p>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 rounded">
            Cancel
          </button>
          <button
            onClick={() => onConfirm(client._id)}
            className="px-4 py-2 bg-red-600 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
