import { useEffect, useState } from "react";
import useTripLookups from "../hooks/useTripLookups";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

export default function AddTripModal({ open, onClose, onSubmit }) {
  const { drivers, vehicles, clients, routes, fetchAll } = useTripLookups();

  const [form, setForm] = useState({
    routeId: "",
    clientId: "",
    driverId: "",
    driverIds: [],
    vehicleId: "",
    vehicleIds: [],
    goodsInfo: "",
    loadWeightKg: "",
    tripCost: "",
    startTime: "",
    status: "scheduled",
  });

  useEffect(() => {
    if (open) fetchAll();
  }, [open]);

  const update = (key, val) => setForm((s) => ({ ...s, [key]: val }));

  const handleRouteChange = (routeId) => {
    const selectedRoute = routes.find((r) => r._id === routeId);
    if (selectedRoute) {
      // Auto-calculate cost based on route
      const baseCost = selectedRoute.distanceKm * 25; // ₹25 per km
      const tollsCost =
        selectedRoute.tolls?.reduce((sum, toll) => sum + (toll.cost || 0), 0) ||
        0;
      const estimatedCost = baseCost + tollsCost;

      setForm((prev) => ({
        ...prev,
        routeId,
        tripCost: estimatedCost.toString(),
      }));
    } else {
      update("routeId", routeId);
    }
  };

  const generateTripCode = () => {
    const prefix = "TRP";
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 3).toUpperCase();
    return `${prefix}_${timestamp}_${random}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert to backend schema format
    const payload = {
      tripCode: generateTripCode(),
      routeId: form.routeId,
      clientId: form.clientId,
      vehicleIds: form.vehicleIds.length
        ? form.vehicleIds
        : [form.vehicleId].filter(Boolean),
      driverIds: form.driverIds.length
        ? form.driverIds
        : [form.driverId].filter(Boolean),
      goodsInfo: form.goodsInfo || "General cargo",
      loadWeightKg: Number(form.loadWeightKg) || 0,
      tripCost: Number(form.tripCost) || 0,
      startTime: form.startTime
        ? new Date(form.startTime).toISOString()
        : new Date().toISOString(),
      status: form.status,
    };
    onSubmit(payload);
    onClose();
  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Add Trip"
      className="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Route Selection */}
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">
            Route *
          </label>
          <select
            value={form.routeId}
            onChange={(e) => handleRouteChange(e.target.value)}
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg py-2.5 px-4 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            required
          >
            <option value="">Select Route</option>
            {routes.map((r) => (
              <option key={r._id} value={r._id}>
                {r.name} - {r.source?.name} → {r.destination?.name} (
                {r.distanceKm}km)
              </option>
            ))}
          </select>
        </div>

        {/* Client */}
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">
            Client
          </label>
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
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">
            Driver
          </label>
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
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">
            Vehicle
          </label>
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

        {/* Goods Information */}
        <Input
          placeholder="Goods Description (e.g., Electronics, Furniture)"
          value={form.goodsInfo}
          onChange={(e) => update("goodsInfo", e.target.value)}
          required
        />

        {/* Load Weight */}
        <Input
          type="number"
          placeholder="Load Weight (kg)"
          value={form.loadWeightKg}
          onChange={(e) => update("loadWeightKg", e.target.value)}
          min="0"
          step="0.1"
        />

        {/* Trip Cost (Auto-calculated from route) */}
        <Input
          type="number"
          placeholder="Trip Cost (₹)"
          value={form.tripCost}
          onChange={(e) => update("tripCost", e.target.value)}
          min="0"
          step="0.01"
          disabled={!!form.routeId}
        />

        {/* Start Time */}
        <Input
          type="datetime-local"
          placeholder="Start Time"
          value={form.startTime}
          onChange={(e) => update("startTime", e.target.value)}
        />

        {/* Status */}
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">
            Status
          </label>
          <select
            value={form.status}
            onChange={(e) => update("status", e.target.value)}
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg py-2.5 px-4 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          >
            <option value="scheduled">Scheduled</option>
            <option value="in-transit">In Transit</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Add Trip</Button>
        </div>
      </form>
    </Modal>
  );
}
