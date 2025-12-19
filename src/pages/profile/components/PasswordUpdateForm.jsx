import { useState } from "react";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { parseBackendError } from "../../../utils/validation";
import toast from "react-hot-toast";

export default function PasswordUpdateForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    // Client-side validation
    if (form.newPassword !== form.confirmPassword) {
      setFieldErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    if (form.newPassword.length < 8) {
      setFieldErrors({ newPassword: "Password must be at least 8 characters" });
      return;
    }

    try {
      await onSubmit({
        password: form.newPassword,
        currentPassword: form.currentPassword,
      });
      toast.success("Password updated successfully!");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
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
      <div className="max-w-md space-y-4">
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">
            Current Password
          </label>
          <Input
            type="password"
            value={form.currentPassword}
            onChange={(e) => update("currentPassword", e.target.value)}
            placeholder="Enter current password"
            className={fieldErrors.currentPassword ? "border-red-500" : ""}
          />
          {fieldErrors.currentPassword && (
            <p className="text-red-500 text-sm mt-1">
              {fieldErrors.currentPassword}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">
            New Password
          </label>
          <Input
            type="password"
            value={form.newPassword}
            onChange={(e) => update("newPassword", e.target.value)}
            placeholder="Enter new password"
            className={fieldErrors.newPassword ? "border-red-500" : ""}
          />
          {fieldErrors.newPassword && (
            <p className="text-red-500 text-sm mt-1">
              {fieldErrors.newPassword}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">
            Confirm New Password
          </label>
          <Input
            type="password"
            value={form.confirmPassword}
            onChange={(e) => update("confirmPassword", e.target.value)}
            placeholder="Confirm new password"
            className={fieldErrors.confirmPassword ? "border-red-500" : ""}
          />
          {fieldErrors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {fieldErrors.confirmPassword}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" isLoading={loading}>
          Update Password
        </Button>
      </div>
    </form>
  );
}
