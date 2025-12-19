import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import api from "../../../api/axiosClient";
import { useAuthStore } from "../../../store/authStore";

const SERVICE_TYPES = [
  { value: "oil-change", label: "Oil Change" },
  { value: "engine-check", label: "Engine Check" },
  { value: "tire-replacement", label: "Tire Replacement" },
  { value: "brake-service", label: "Brake Service" },
  { value: "accident-repair", label: "Accident Repair" },
  { value: "general-service", label: "General Service" },
  { value: "pollution-check", label: "Pollution Check" },
  { value: "insurance-renewal", label: "Insurance Renewal" },
  { value: "other", label: "Other" },
];

export default function AddMaintenanceModal({ isOpen, onClose, onSubmit }) {
  const { user } = useAuthStore();
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({
    vehicleId: "",
    serviceType: "general-service",
    description: "",
    serviceDate: new Date().toISOString().split("T")[0],
    cost: "",
    nextDueDate: "",
    odometerReadingKm: "",
    vendorName: "",
    vendorContact: "",
    vendorAddress: "",
    remarks: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchVehicles();
    }
  }, [isOpen]);

  const fetchVehicles = async () => {
    try {
      const res = await api.get("/vehicles");
      setVehicles(res.data?.data?.vehicles || []);
    } catch (err) {
      console.error("Failed to fetch vehicles", err);
    }
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const validateForm = () => {
    if (!form.vehicleId) return "Vehicle is required";
    if (!form.serviceType) return "Service type is required";
    if (!form.description.trim()) return "Description is required";
    if (!form.serviceDate) return "Service date is required";
    if (!form.cost || form.cost < 0) return "Cost must be 0 or greater";

    if (form.odometerReadingKm && form.odometerReadingKm < 0) {
      return "Odometer reading cannot be negative";
    }

    if (form.nextDueDate && form.serviceDate) {
      const serviceDate = new Date(form.serviceDate);
      const nextDue = new Date(form.nextDueDate);
      if (nextDue <= serviceDate) {
        return "Next due date must be after service date";
      }
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    const payload = {
      vehicleId: form.vehicleId,
      serviceType: form.serviceType,
      description: form.description,
      serviceDate: form.serviceDate,
      cost: Number(form.cost),
      createdBy: user?.id || user?._id,
    };

    // Add optional fields
    if (form.nextDueDate) payload.nextDueDate = form.nextDueDate;
    if (form.odometerReadingKm)
      payload.odometerReadingKm = Number(form.odometerReadingKm);
    if (form.remarks) payload.remarks = form.remarks;

    // Add vendor info if provided
    if (form.vendorName || form.vendorContact || form.vendorAddress) {
      payload.vendor = {};
      if (form.vendorName) payload.vendor.name = form.vendorName;
      if (form.vendorContact) payload.vendor.contact = form.vendorContact;
      if (form.vendorAddress) payload.vendor.address = form.vendorAddress;
    }

    try {
      setSubmitting(true);
      await onSubmit(payload);
      handleClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setForm({
      vehicleId: "",
      serviceType: "general-service",
      description: "",
      serviceDate: new Date().toISOString().split("T")[0],
      cost: "",
      nextDueDate: "",
      odometerReadingKm: "",
      vendorName: "",
      vendorContact: "",
      vendorAddress: "",
      remarks: "",
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Maintenance Log">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Vehicle Selection */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            Vehicle <span className="text-red-500">*</span>
          </label>
          <select
            value={form.vehicleId}
            onChange={(e) => handleChange("vehicleId", e.target.value)}
            className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            required
          >
            <option value="">Select a vehicle</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle._id} value={vehicle._id}>
                {vehicle.vehicleNo} - {vehicle.model}
              </option>
            ))}
          </select>
        </div>

        {/* Service Type */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            Service Type <span className="text-red-500">*</span>
          </label>
          <select
            value={form.serviceType}
            onChange={(e) => handleChange("serviceType", e.target.value)}
            className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            required
          >
            {SERVICE_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Describe the service performed..."
            rows={3}
            className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
            required
          />
        </div>

        {/* Service Date and Cost */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Service Date"
            type="date"
            value={form.serviceDate}
            onChange={(e) => handleChange("serviceDate", e.target.value)}
            required
          />
          <Input
            label="Cost (₹)"
            type="number"
            min="0"
            step="any"
            value={form.cost}
            onChange={(e) => handleChange("cost", e.target.value)}
            placeholder="e.g., 2500"
            required
          />
        </div>

        {/* Next Due Date and Odometer */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Next Due Date (Optional)"
            type="date"
            value={form.nextDueDate}
            onChange={(e) => handleChange("nextDueDate", e.target.value)}
          />
          <Input
            label="Odometer Reading (km)"
            type="number"
            min="0"
            value={form.odometerReadingKm}
            onChange={(e) => handleChange("odometerReadingKm", e.target.value)}
            placeholder="e.g., 45000"
          />
        </div>

        {/* Vendor Information */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">
            Vendor Information (Optional)
          </h3>
          <Input
            label="Vendor Name"
            value={form.vendorName}
            onChange={(e) => handleChange("vendorName", e.target.value)}
            placeholder="e.g., ABC Auto Service"
          />
          <Input
            label="Vendor Contact"
            value={form.vendorContact}
            onChange={(e) => handleChange("vendorContact", e.target.value)}
            placeholder="e.g., 9876543210"
          />
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Vendor Address
            </label>
            <textarea
              value={form.vendorAddress}
              onChange={(e) => handleChange("vendorAddress", e.target.value)}
              placeholder="Enter vendor address..."
              rows={2}
              className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
            />
          </div>
        </div>

        {/* Remarks */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
            Remarks (Optional)
          </label>
          <textarea
            value={form.remarks}
            onChange={(e) => handleChange("remarks", e.target.value)}
            placeholder="Any additional notes..."
            rows={2}
            className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create Log"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

AddMaintenanceModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
