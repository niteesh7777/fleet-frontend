import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import { useProfile } from "../../hooks/useProfile";
import ProfileForm from "./components/ProfileForm";
import PasswordUpdateForm from "./components/PasswordUpdateForm";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { FiUser, FiLock } from "react-icons/fi";

export default function Profile() {
  const { user } = useAuthStore();
  const { profile, loading, error, updateProfile } = useProfile();
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    // Profile is fetched in the hook
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
          Profile Management
        </h1>
        <p className="text-[var(--text-secondary)]">
          Manage your account settings and security preferences.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-[var(--bg-secondary)] p-1 rounded-lg">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "profile"
              ? "bg-white text-[var(--text-primary)] shadow-sm"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          <FiUser size={16} />
          Profile
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "password"
              ? "bg-white text-[var(--text-primary)] shadow-sm"
              : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          }`}
        >
          <FiLock size={16} />
          Password
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "profile" && (
          <Card>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                Personal Information
              </h2>
              <p className="text-[var(--text-secondary)]">
                Update your personal details and contact information.
              </p>
            </div>
            <ProfileForm
              profile={profile}
              onSubmit={updateProfile}
              loading={loading}
              error={error}
            />
          </Card>
        )}

        {activeTab === "password" && (
          <Card>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                Change Password
              </h2>
              <p className="text-[var(--text-secondary)]">
                Update your password to keep your account secure.
              </p>
            </div>
            <PasswordUpdateForm
              onSubmit={updateProfile}
              loading={loading}
              error={error}
            />
          </Card>
        )}
      </div>
    </div>
  );
}
