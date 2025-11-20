import { useState } from "react";

export default function AddClientModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    gstNumber: "",
    contactPersonName: "",
    contactPersonPhone: "",
    contactPersonEmail: "",
    creditLimit: "",
    paymentTerms: "",
  });

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: {
        street: form.street,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      },
      gstNumber: form.gstNumber,
      contactPerson: {
        name: form.contactPersonName,
        phone: form.contactPersonPhone,
        email: form.contactPersonEmail,
      },
      creditLimit: Number(form.creditLimit),
      paymentTerms: form.paymentTerms,
    };

    onSubmit(payload);
    onClose();
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-[#1A1A1A] w-full max-w-2xl rounded-xl p-6 border border-gray-800">
        <h2 className="text-xl text-white font-semibold mb-4">Add Client</h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            className="input"
            placeholder="Name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />

          <input
            className="input"
            placeholder="Email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
          />

          <input
            className="input"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
          />

          <input
            className="input"
            placeholder="Street"
            value={form.street}
            onChange={(e) => update("street", e.target.value)}
          />

          <input
            className="input"
            placeholder="City"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
          />

          <input
            className="input"
            placeholder="State"
            value={form.state}
            onChange={(e) => update("state", e.target.value)}
          />

          <input
            className="input"
            placeholder="Pincode"
            value={form.pincode}
            onChange={(e) => update("pincode", e.target.value)}
          />

          <input
            className="input"
            placeholder="GST Number"
            value={form.gstNumber}
            onChange={(e) => update("gstNumber", e.target.value)}
          />

          <input
            className="input"
            placeholder="Contact Person Name"
            value={form.contactPersonName}
            onChange={(e) => update("contactPersonName", e.target.value)}
          />

          <input
            className="input"
            placeholder="Contact Person Phone"
            value={form.contactPersonPhone}
            onChange={(e) => update("contactPersonPhone", e.target.value)}
          />

          <input
            className="input"
            placeholder="Contact Person Email"
            value={form.contactPersonEmail}
            onChange={(e) => update("contactPersonEmail", e.target.value)}
          />

          <input
            className="input"
            placeholder="Credit Limit"
            value={form.creditLimit}
            onChange={(e) => update("creditLimit", e.target.value)}
          />

          <input
            className="input"
            placeholder="Payment Terms"
            value={form.paymentTerms}
            onChange={(e) => update("paymentTerms", e.target.value)}
          />

          <div className="col-span-2 flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 rounded"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 rounded">
              Add Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
