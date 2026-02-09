import { useState, useMemo } from "react";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";

export default function EditVehicleModal({ open, onClose, onSubmit, vehicle }) {
  const initialForm = useMemo(
    () => ({
      vehicleNo: vehicle?.vehicleNo || "",
      model: vehicle?.model || "",
      manufacturer: vehicle?.manufacturer || "",
      year: vehicle?.year || new Date().getFullYear(),
      capacity: vehicle?.capacity || "",
      fuelType: vehicle?.fuelType || "diesel",
      type: vehicle?.type || "Truck",
      status: vehicle?.status || "available",
    }),
    [vehicle]
  );

  const [form, setForm] = useState(initialForm);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.vehicleNo || !form.model || !form.manufacturer) {
      toast.error("Please fill in all required fields");
      return;
    }

    onSubmit(vehicle._id, form);
  };

  if (!vehicle) return null;

  return (
    <Modal isOpen={open} onClose={onClose} title="Edit Vehicle">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">
            Vehicle Number <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            name="vehicleNo"
            value={form.vehicleNo}
            onChange={update}
            placeholder="e.g., ABC-1234"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">
            Model <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            name="model"
            value={form.model}
            onChange={update}
            placeholder="e.g., Actros 1843"
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">
            Manufacturer <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            name="manufacturer"
            value={form.manufacturer}
            onChange={update}
            placeholder="e.g., Mercedes-Benz"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">
              Year
            </label>
            <Input
              type="number"
              name="year"
              value={form.year}
              onChange={update}
              min="1900"
              max={new Date().getFullYear() + 1}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">
              Capacity (tons)
            </label>
            <Input
              type="number"
              name="capacity"
              value={form.capacity}
              onChange={update}
              placeholder="e.g., 20"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">
              Vehicle Type
            </label>
            <select
              name="type"
              value={form.type}
              onChange={update}
              className="w-full px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent text-[var(--text-primary)]"
            >
              <option value="Truck">Truck</option>
              <option value="Mini Truck">Mini Truck</option>
              <option value="Trailer">Trailer</option>
              <option value="Van">Van</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">
              Fuel Type
            </label>
            <select
              name="fuelType"
              value={form.fuelType}
              onChange={update}
              className="w-full px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent text-[var(--text-primary)]"
            >
              <option value="diesel">Diesel</option>
              <option value="petrol">Petrol</option>
              <option value="electric">Electric</option>
              <option value="hybrid">Hybrid</option>
              <option value="cng">CNG</option>
            </select>
          </div>
        </div>

          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={update}
              className="w-full px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent text-[var(--text-primary)]"
            >
              <option value="available">Available</option>
              <option value="in-use">In Use</option>
              <option value="maintenance">Maintenance</option>
              <option value="out-of-service">Out of Service</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit">Update Vehicle</Button>
        </div>
      </form>
    </Modal>
  );
}
