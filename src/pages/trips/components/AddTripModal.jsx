import { useEffect, useState } from "react";
import useTripLookups from "../hooks/useTripLookups";

export default function AddTripModal({ open, onClose, onSubmit }) {
  const { drivers, vehicles, clients, fetchAll } = useTripLookups();

  const [form, setForm] = useState({
    clientId: "",
    driverId: "",
    vehicleId: "",
    startLocation: "",
    endLocation: "",
    totalAmount: "",
    advancePayment: "",
    status: "scheduled",
  });

  useEffect(() => {
    if (open) fetchAll();
  }, [open]);

  const update = (key, val) => setForm((s) => ({ ...s, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      totalAmount: Number(form.totalAmount),
      advancePayment: Number(form.advancePayment),
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-[#1A1A1A] w-full max-w-lg rounded-xl p-6 border border-gray-800">
        <h2 className="text-xl text-white font-semibold mb-4">Add Trip</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Client */}
          <select
            value={form.clientId}
            onChange={(e) => update("clientId", e.target.value)}
            className="w-full bg-[#222] border border-gray-700 text-gray-200 px-3 py-2 rounded"
          >
            <option value="">Select Client</option>
            {clients.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Driver */}
          <select
            value={form.driverId}
            onChange={(e) => update("driverId", e.target.value)}
            className="w-full bg-[#222] border border-gray-700 text-gray-200 px-3 py-2 rounded"
          >
            <option value="">Select Driver</option>
            {drivers.map((d) => (
              <option key={d._id} value={d._id}>
                {d.user?.name} — {d.licenseNo}
              </option>
            ))}
          </select>

          {/* Vehicle */}
          <select
            value={form.vehicleId}
            onChange={(e) => update("vehicleId", e.target.value)}
            className="w-full bg-[#222] border border-gray-700 text-gray-200 px-3 py-2 rounded"
          >
            <option value="">Select Vehicle</option>
            {vehicles.map((v) => (
              <option key={v._id} value={v._id}>
                {v.vehicleNo} — {v.model}
              </option>
            ))}
          </select>

          {/* Start & End */}
          <input
            type="text"
            placeholder="Start Location"
            value={form.startLocation}
            onChange={(e) => update("startLocation", e.target.value)}
            className="w-full bg-[#222] border border-gray-700 text-gray-200 px-3 py-2 rounded"
          />

          <input
            type="text"
            placeholder="End Location"
            value={form.endLocation}
            onChange={(e) => update("endLocation", e.target.value)}
            className="w-full bg-[#222] border border-gray-700 text-gray-200 px-3 py-2 rounded"
          />

          {/* Amounts */}
          <input
            type="number"
            placeholder="Total Amount"
            value={form.totalAmount}
            onChange={(e) => update("totalAmount", e.target.value)}
            className="w-full bg-[#222] border border-gray-700 text-gray-200 px-3 py-2 rounded"
          />

          <input
            type="number"
            placeholder="Advance Payment"
            value={form.advancePayment}
            onChange={(e) => update("advancePayment", e.target.value)}
            className="w-full bg-[#222] border border-gray-700 text-gray-200 px-3 py-2 rounded"
          />

          {/* Status */}
          <select
            value={form.status}
            onChange={(e) => update("status", e.target.value)}
            className="w-full bg-[#222] border border-gray-700 text-gray-200 px-3 py-2 rounded"
          >
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 rounded"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 rounded">
              Add Trip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
