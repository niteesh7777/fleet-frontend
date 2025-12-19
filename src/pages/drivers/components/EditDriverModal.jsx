import { useState, useEffect } from "react";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { validatePhone, validateRequired } from "../../../utils/validation";
import toast from "react-hot-toast";

export default function EditDriverModal({ open, onClose, driver, onSubmit }) {
  const [form, setForm] = useState({
    licenseNo: "",
    phone: "",
    address: "",
    experienceYears: 0,
    status: "inactive",
  });

  // Reset form whenever a different driver is selected
  useEffect(() => {
    if (driver) {
      setForm({
        licenseNo: driver.licenseNo || "",
        phone: driver.contact?.phone || "",
        address: driver.contact?.address || "",
        experienceYears: driver.experienceYears || 0,
        status: driver.status || "inactive",
      });
    }
  }, [driver, open]);

  const update = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!driver) return;

    // Validate
    const licenseError = validateRequired(form.licenseNo, "License number");
    const phoneError = validatePhone(form.phone);

    if (licenseError) {
      toast.error(licenseError);
      return;
    }
    if (phoneError) {
      toast.error(phoneError);
      return;
    }

    const payload = {
      licenseNo: form.licenseNo,
      contact: {
        phone: form.phone,
        address: form.address,
      },
      experienceYears: Number(form.experienceYears),
      status: form.status,
    };

    onSubmit(driver._id, payload);
    onClose();
  };

  if (!driver) return null;

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={`Edit Driver — ${driver.user?.name}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* License No */}
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">
            License Number
          </label>
          <Input
            value={form.licenseNo}
            onChange={(e) => update("licenseNo", e.target.value)}
          />
        </div>

        {/* Phone */}
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">
            Phone
          </label>
          <Input
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
        </div>

        {/* Address */}
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">
            Address
          </label>
          <Input
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
          />
        </div>

        {/* Experience */}
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">
            Experience (years)
          </label>
          <Input
            type="number"
            value={form.experienceYears}
            onChange={(e) => update("experienceYears", e.target.value)}
          />
        </div>

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
            <option value="inactive">Inactive</option>
            <option value="active">Active</option>
            <option value="on-trip">On Trip</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit">Update Driver</Button>
        </div>
      </form>
    </Modal>
  );
}
