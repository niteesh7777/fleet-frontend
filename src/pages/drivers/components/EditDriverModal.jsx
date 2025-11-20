import { useState } from "react";

export default function EditDriverModal({ open, onClose, driver, onSubmit }) {
  if (!open || !driver) return null;

  // build initial state from driver
  const buildInitial = () => ({
    licenseNo: driver.licenseNo || "",
    phone: driver.contact?.phone || "",
    address: driver.contact?.address || "",
    experienceYears: driver.experienceYears || 0,
    status: driver.status || "inactive",
  });

  const [form, setForm] = useState(buildInitial);

  // Reset form whenever a different driver is selected
  if (form.licenseNo !== driver.licenseNo && open) {
    setForm(buildInitial());
  }

  const update = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1A1A1A] p-6 rounded-xl w-full max-w-lg border border-gray-800">
        <h2 className="text-xl font-semibold text-white mb-4">
          Edit Driver — {driver.user?.name}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* License No */}
          <div>
            <label className="text-gray-300">License Number</label>
            <input
              type="text"
              value={form.licenseNo}
              onChange={(e) => update("licenseNo", e.target.value)}
              className="w-full bg-[#222] border border-gray-700 text-gray-200 px-3 py-2 rounded mt-1"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-gray-300">Phone</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className="w-full bg-[#222] border border-gray-700 text-gray-200 px-3 py-2 rounded mt-1"
            />
          </div>

          {/* Address */}
          <div>
            <label className="text-gray-300">Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              className="w-full bg-[#222] border border-gray-700 text-gray-200 px-3 py-2 rounded mt-1"
            />
          </div>

          {/* Experience */}
          <div>
            <label className="text-gray-300">Experience (years)</label>
            <input
              type="number"
              value={form.experienceYears}
              onChange={(e) => update("experienceYears", e.target.value)}
              className="w-full bg-[#222] border border-gray-700 text-gray-200 px-3 py-2 rounded mt-1"
            />
          </div>

          {/* Status */}
          <div>
            <label className="text-gray-300">Status</label>
            <select
              value={form.status}
              onChange={(e) => update("status", e.target.value)}
              className="w-full bg-[#222] border border-gray-700 text-gray-200 px-3 py-2 rounded mt-1"
            >
              <option value="inactive">Inactive</option>
              <option value="active">Active</option>
              <option value="on-trip">On Trip</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
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
              Update Driver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
