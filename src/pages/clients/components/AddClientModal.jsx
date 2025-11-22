import { useState } from "react";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

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
    notes: "",
    isActive: true,
  });

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Build address string as expected by backend (single string)
    const address = `${form.street}, ${form.city}, ${form.state} - ${form.pincode}`;
    const payload = {
      name: form.name,
      type: "corporate", // default type, can be changed later if UI adds selector
      contact: {
        person: form.contactPersonName,
        phone: form.contactPersonPhone,
        email: form.contactPersonEmail,
      },
      address,
      gstNo: form.gstNumber,
      notes: form.notes,
      isActive: form.isActive,
      creditLimit: Number(form.creditLimit),
      paymentTerms: form.paymentTerms,
    };
    onSubmit(payload);
    onClose();
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Add Client" className="max-w-2xl">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input placeholder="Name" value={form.name} onChange={(e) => update("name", e.target.value)} />
        <Input placeholder="Email" value={form.email} onChange={(e) => update("email", e.target.value)} />
        <Input placeholder="Phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
        <Input placeholder="Street" value={form.street} onChange={(e) => update("street", e.target.value)} />
        <Input placeholder="City" value={form.city} onChange={(e) => update("city", e.target.value)} />
        <Input placeholder="State" value={form.state} onChange={(e) => update("state", e.target.value)} />
        <Input placeholder="Pincode" value={form.pincode} onChange={(e) => update("pincode", e.target.value)} />
        <Input placeholder="GST Number" value={form.gstNumber} onChange={(e) => update("gstNumber", e.target.value)} />
        <Input placeholder="Contact Person Name" value={form.contactPersonName} onChange={(e) => update("contactPersonName", e.target.value)} />
        <Input placeholder="Contact Person Phone" value={form.contactPersonPhone} onChange={(e) => update("contactPersonPhone", e.target.value)} />
        <Input placeholder="Contact Person Email" value={form.contactPersonEmail} onChange={(e) => update("contactPersonEmail", e.target.value)} />
        <Input placeholder="Credit Limit" value={form.creditLimit} onChange={(e) => update("creditLimit", e.target.value)} />
        <Input placeholder="Payment Terms" value={form.paymentTerms} onChange={(e) => update("paymentTerms", e.target.value)} />
        <textarea
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
          className="col-span-1 md:col-span-2 p-2 border rounded"
        />
        <label className="flex items-center col-span-1 md:col-span-2">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => update("isActive", e.target.checked)}
            className="mr-2"
          />
          Active
        </label>
        <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-4">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit">Add Client</Button>
        </div>
      </form>
    </Modal>
  );
}
