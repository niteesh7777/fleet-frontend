import { useState } from "react";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

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

  return (
    <Modal isOpen={open} onClose={onClose} title="Add Driver">
      <form onSubmit={handleSubmit} className="space-y-4">
        {["name", "email", "password", "licenseNo", "phone", "address"].map(
          (field) => (
            <div key={field}>
              <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block capitalize">
                {field}
              </label>
              <Input
                type={field === "password" ? "password" : "text"}
                name={field}
                value={form[field]}
                onChange={update}
              />
            </div>
          )
        )}

        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">
            Experience (years)
          </label>
          <Input
            type="number"
            name="experienceYears"
            value={form.experienceYears}
            onChange={update}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            type="submit"
          >
            Add Driver
          </Button>
        </div>
      </form>
    </Modal>
  );
}
