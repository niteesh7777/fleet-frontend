import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

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

export default function EditMaintenanceModal({ log, onClose, onSubmit }) {
    const [form, setForm] = useState({
        serviceType: "",
        description: "",
        serviceDate: "",
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
        if (log) {
            setForm({
                serviceType: log.serviceType || "general-service",
                description: log.description || "",
                serviceDate: log.serviceDate ? log.serviceDate.split("T")[0] : "",
                cost: log.cost || "",
                nextDueDate: log.nextDueDate ? log.nextDueDate.split("T")[0] : "",
                odometerReadingKm: log.odometerReadingKm || "",
                vendorName: log.vendor?.name || "",
                vendorContact: log.vendor?.contact || "",
                vendorAddress: log.vendor?.address || "",
                remarks: log.remarks || "",
            });
        }
    }, [log]);

    const handleChange = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    const validateForm = () => {
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

        if (!log) return;

        const error = validateForm();
        if (error) {
            alert(error);
            return;
        }

        const payload = {
            serviceType: form.serviceType,
            description: form.description,
            serviceDate: form.serviceDate,
            cost: Number(form.cost),
        };

        // Add optional fields
        if (form.nextDueDate) payload.nextDueDate = form.nextDueDate;
        if (form.odometerReadingKm) payload.odometerReadingKm = Number(form.odometerReadingKm);
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
            await onSubmit(log._id, payload);
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (!log) return null;

    return (
        <Modal isOpen={!!log} onClose={onClose} title="Edit Maintenance Log">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Vehicle (Display Only) */}
                <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                        Vehicle
                    </label>
                    <div className="px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-secondary)]">
                        {log.vehicleId?.vehicleNo || "N/A"} - {log.vehicleId?.model || ""}
                    </div>
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
                    />
                    <Input
                        label="Vendor Contact"
                        value={form.vendorContact}
                        onChange={(e) => handleChange("vendorContact", e.target.value)}
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
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={submitting}>
                        {submitting ? "Updating..." : "Update Log"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

EditMaintenanceModal.propTypes = {
    log: PropTypes.object,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};
