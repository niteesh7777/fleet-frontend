import { useEffect, useState } from "react";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

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

  if (!trip) return null;

  return (
    <Modal isOpen={open} onClose={onClose} title={`Edit Trip — ${trip.startLocation} → ${trip.endLocation}`} className="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Start Location */}
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">Start Location</label>
          <Input
            value={form.startLocation}
            onChange={(e) => update("startLocation", e.target.value)}
          />
        </div>

        {/* End Location */}
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">End Location</label>
          <Input
            value={form.endLocation}
            onChange={(e) => update("endLocation", e.target.value)}
          />
        </div>

        {/* Amount */}
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">Total Amount (₹)</label>
          <Input
            type="number"
            value={form.totalAmount}
            onChange={(e) => update("totalAmount", e.target.value)}
          />
        </div>

        {/* Advance */}
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">Advance Payment (₹)</label>
          <Input
            type="number"
            value={form.advancePayment}
            onChange={(e) => update("advancePayment", e.target.value)}
          />
        </div>

        {/* Status */}
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">Status</label>
          <select
            value={form.status}
            onChange={(e) => update("status", e.target.value)}
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg py-2.5 px-4 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          >
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
          >
            Update Trip
          </Button>
        </div>
      </form>
    </Modal>
  );
}
