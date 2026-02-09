import { useState, useEffect } from "react";
import { validateClientForm } from "../../../utils/validation";
import toast from "react-hot-toast";

export default function EditClientModal({ open, onClose, client, onSubmit }) {
  // Build the initial form from client
  const buildInitial = () => ({
    name: client?.name || "",
    email: client?.contact?.email || "",
    phone: client?.contact?.phone || "",
    street: client?.address?.street || "",
    city: client?.address?.city || "",
    state: client?.address?.state || "",
    pincode: client?.address?.pincode || "",
    gstNumber: client?.gstNo || "",
    contactPersonName: client?.contact?.person || "",
    contactPersonPhone: client?.contact?.phone || "",
    contactPersonEmail: client?.contact?.email || "",
    creditLimit: client?.creditLimit || "",
    paymentTerms: client?.paymentTerms || "",
  });

  // Initialize state
  const [form, setForm] = useState(buildInitial);

  // Reset form when client changes
  useEffect(() => {
    setForm(buildInitial());
  }, [client]);

  if (!open || !client) return null;

  const update = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Map form to match validation structure
    const validationForm = {
      name: form.name,
      contactPersonName: form.contactPersonName,
      contactPersonPhone: form.contactPersonPhone,
      contactPersonEmail: form.contactPersonEmail,
      street: form.street,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
      gstNumber: form.gstNumber,
      email: form.email,
    };

    // Validate form
    const errors = validateClientForm(validationForm);
    if (Object.keys(errors).length > 0) {
      const errorMessages = Object.values(errors);
      toast.error(errorMessages[0]); // Show first error
      return;
    }

    // Build address string as expected by backend (single string)
    const address = `${form.street}, ${form.city}, ${form.state} - ${form.pincode}`;

    const payload = {
      name: form.name,
      contact: {
        person: form.contactPersonName,
        phone: form.contactPersonPhone,
        email: form.contactPersonEmail,
      },
      address,
      gstNo: form.gstNumber,
      creditLimit: Number(form.creditLimit),
      paymentTerms: form.paymentTerms,
    };

    onSubmit(client._id, payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1A1A1A] w-full max-w-2xl rounded-xl p-6 border border-gray-800">
        <h2 className="text-xl text-white font-semibold mb-4">
          Edit Client — {client.name}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Basic Fields */}
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

          {/* Address */}
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

          {/* GST */}
          <input
            className="input"
            placeholder="GST Number"
            value={form.gstNumber}
            onChange={(e) => update("gstNumber", e.target.value)}
          />

          {/* Contact Person */}
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

          {/* Financial */}
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

          {/* Buttons */}
          <div className="col-span-2 flex justify-end gap-3 mt-4">
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
              Update Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
