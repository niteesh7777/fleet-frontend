export default function DeleteTripModal({ open, onClose, onConfirm, trip }) {
  if (!open || !trip) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-[#1A1A1A] max-w-md p-6 rounded-lg border border-gray-800">
        <h2 className="text-xl text-white font-semibold mb-4">Delete Trip</h2>

        <p className="text-gray-300 mb-6">
          Are you sure you want to delete the trip <br />
          <span className="text-white font-semibold">
            {trip.startLocation} → {trip.endLocation}
          </span>
          ?
        </p>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 rounded">
            Cancel
          </button>
          <button
            onClick={() => onConfirm(trip._id)}
            className="px-4 py-2 bg-red-600 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
