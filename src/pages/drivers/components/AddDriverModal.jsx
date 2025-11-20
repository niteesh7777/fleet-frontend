import { useState } from "react";

export default function AddDriverModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    licenseNo: "",
    phone: "",
    address: "",
    experienceYears: 0,
  });

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-[#1A1A1A] p-6 rounded-lg border border-gray-700 w-full max-w-lg">
        <h2 className="text-xl text-white font-semibold mb-4">Add Driver</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {["name", "email", "password", "licenseNo", "phone", "address"].map(
            (field) => (
              <div key={field}>
                <label className="text-gray-300 capitalize">{field}</label>
                <input
                  type={field === "password" ? "password" : "text"}
                  name={field}
                  value={form[field]}
                  onChange={update}
                  className="w-full mt-1 bg-[#222] border border-gray-700 text-gray-200 px-3 py-2 rounded"
                />
              </div>
            )
          )}

          <div>
            <label className="text-gray-300">Experience (years)</label>
            <input
              type="number"
              name="experienceYears"
              value={form.experienceYears}
              onChange={update}
              className="w-full mt-1 bg-[#222] border border-gray-700 text-gray-200 px-3 py-2 rounded"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-600 rounded-lg"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
              type="submit"
            >
              Add Driver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
