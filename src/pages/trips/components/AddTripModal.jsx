import { useEffect, useState } from "react";
import useTripLookups from "../hooks/useTripLookups";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

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

  return (
    <Modal isOpen={open} onClose={onClose} title="Add Trip" className="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Client */}
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">Client</label>
          <select
            value={form.clientId}
            onChange={(e) => update("clientId", e.target.value)}
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg py-2.5 px-4 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          >
            <option value="">Select Client</option>
            {clients.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Driver */}
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">Driver</label>
          <select
            value={form.driverId}
            onChange={(e) => update("driverId", e.target.value)}
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg py-2.5 px-4 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          >
            <option value="">Select Driver</option>
            {drivers.map((d) => (
              <option key={d._id} value={d._id}>
                {d.user?.name} — {d.licenseNo}
              </option>
            ))}
          </select>
        </div>

        {/* Vehicle */}
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">Vehicle</label>
          <select
            value={form.vehicleId}
            onChange={(e) => update("vehicleId", e.target.value)}
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg py-2.5 px-4 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          >
            <option value="">Select Vehicle</option>
            {vehicles.map((v) => (
              <option key={v._id} value={v._id}>
                {v.vehicleNo} — {v.model}
              </option>
            ))}
          </select>
        </div>

        {/* Start & End */}
        <Input
          placeholder="Start Location"
          value={form.startLocation}
          onChange={(e) => update("startLocation", e.target.value)}
        />

        <Input
          placeholder="End Location"
          value={form.endLocation}
          onChange={(e) => update("endLocation", e.target.value)}
        />

        {/* Amounts */}
        <Input
          type="number"
          placeholder="Total Amount"
          value={form.totalAmount}
          onChange={(e) => update("totalAmount", e.target.value)}
        />

        <Input
          type="number"
          placeholder="Advance Payment"
          value={form.advancePayment}
          onChange={(e) => update("advancePayment", e.target.value)}
        />

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
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit">
            Add Trip
          </Button>
        </div>
      </form>
    </Modal>
  );
}
