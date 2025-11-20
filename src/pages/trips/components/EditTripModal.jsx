import { useEffect, useState } from "react";

export default function EditTripModal({ open, onClose, trip, onSubmit }) {
  const [form, setForm] = useState({
    startLocation: "",
    endLocation: "",
    totalAmount: "",
    advancePayment: "",
    status: "scheduled",
  });

  useEffect(() => {
    if (trip && open) {
      setForm({
        startLocation: trip.startLocation || "",
        endLocation: trip.endLocation || "",
        totalAmount: trip.totalAmount || "",
        advancePayment: trip.advancePayment || "",
        status: trip.status || "scheduled",
      });
    }
  }, [trip, open]);

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      startLocation: form.startLocation,
      endLocation: form.endLocation,
      totalAmount: Number(form.totalAmount),
      advancePayment: Number(form.advancePayment),
      status: form.status,
    };

    onSubmit(trip._id, payload); // calls updateTrip from useTrips.js
    onClose();
  };

  if (!open || !trip) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-[#1A1A1A] w-full max-w-lg rounded-xl p-6 border border-gray-800">
        <h2 className="text-xl font-semibold text-white mb-4">
          Edit Trip — {trip.startLocation} → {trip.endLocation}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Start Location */}
          <div>
            <label className="text-gray-300">Start Location</label>
            <input
              type="text"
              value={form.startLocation}
              onChange={(e) => update("startLocation", e.target.value)}
              className="w-full mt-1 bg-[#222] text-gray-200 border border-gray-700 px-3 py-2 rounded"
            />
          </div>

          {/* End Location */}
          <div>
            <label className="text-gray-300">End Location</label>
            <input
              type="text"
              value={form.endLocation}
              onChange={(e) => update("endLocation", e.target.value)}
              className="w-full mt-1 bg-[#222] text-gray-200 border border-gray-700 px-3 py-2 rounded"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="text-gray-300">Total Amount (₹)</label>
            <input
              type="number"
              value={form.totalAmount}
              onChange={(e) => update("totalAmount", e.target.value)}
              className="w-full mt-1 bg-[#222] text-gray-200 border border-gray-700 px-3 py-2 rounded"
            />
          </div>

          {/* Advance */}
          <div>
            <label className="text-gray-300">Advance Payment (₹)</label>
            <input
              type="number"
              value={form.advancePayment}
              onChange={(e) => update("advancePayment", e.target.value)}
              className="w-full mt-1 bg-[#222] text-gray-200 border border-gray-700 px-3 py-2 rounded"
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-gray-300">Status</label>
            <select
              value={form.status}
              onChange={(e) => update("status", e.target.value)}
              className="w-full mt-1 bg-[#222] text-gray-200 border border-gray-700 px-3 py-2 rounded"
            >
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
            >
              Update Trip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
