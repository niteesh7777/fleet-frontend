import { useState, useEffect } from "react";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { parseBackendError } from "../../../utils/validation";
import toast from "react-hot-toast";

export default function ProfileForm({ profile, onSubmit, loading, error }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
      });
    }
  }, [profile]);

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    try {
      await onSubmit(form);
      toast.success("Profile updated successfully!");
    } catch (err) {
      const parsedError = parseBackendError(err);
      toast.error(parsedError.message);
      if (parsedError.isValidationError) {
        setFieldErrors(parsedError.fieldErrors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">
            Full Name
          </label>
          <Input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Enter your full name"
            className={fieldErrors.name ? "border-red-500" : ""}
          />
          {fieldErrors.name && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">
            Email Address
          </label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="Enter your email"
            className={fieldErrors.email ? "border-red-500" : ""}
          />
          {fieldErrors.email && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">
            Phone Number
          </label>
          <Input
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="Enter your phone number"
            className={fieldErrors.phone ? "border-red-500" : ""}
          />
          {fieldErrors.phone && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.phone}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">
            Address
          </label>
          <Input
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            placeholder="Enter your address"
            className={fieldErrors.address ? "border-red-500" : ""}
          />
          {fieldErrors.address && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.address}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" isLoading={loading}>
          Update Profile
        </Button>
      </div>
    </form>
  );
}
