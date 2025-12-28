import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiLogIn, FiBriefcase } from "react-icons/fi";
import {
  showLoginSuccess,
  showLoginError,
  showValidationError,
  showLoading,
  dismissToast,
} from "../../utils/toast";
import { authApi } from "../../api/endpoints";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companySlug, setCompanySlug] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setToken } = useAuthStore();

  // Show success message from registration
  useEffect(() => {
    if (location.state?.message) {
      showLoginSuccess(location.state.message);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !companySlug) {
      showValidationError(["Please fill out all fields"]);
      return;
    }

    let loadingToast;

    try {
      setLoading(true);
      loadingToast = showLoading("Signing you in...");

      // Use authApi for login
      const response = await authApi.login(email, password, companySlug);

      // CORRECT EXTRACTION ✔
      const { accessToken, user } = response || {};

      if (!accessToken || !user) {
        throw new Error(
          "Invalid response structure: missing accessToken or user"
        );
      }

      // STORE IN ZUSTAND ✔
      setToken(accessToken);
      setUser(user);

      dismissToast(loadingToast);
      showLoginSuccess();

      // REDIRECT ✔
      navigate("/dashboard");
    } catch (err) {
      if (loadingToast) dismissToast(loadingToast);
      console.error("Login failed:", err.message);
      showLoginError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4 relative overflow-hidden">
      {/* Background Gradient Decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-primary opacity-20 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-purple opacity-20 blur-3xl rounded-full translate-x-1/2 translate-y-1/2"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="card shadow-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-primary rounded-2xl mb-4">
              <span className="text-4xl">🚚</span>
            </div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
              Fleet Management
            </h1>
            <p className="text-[var(--text-secondary)]">
              Login to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Company Slug */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Company Slug
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiBriefcase
                    className="text-[var(--text-tertiary)]"
                    size={18}
                  />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                  placeholder="your-company"
                  value={companySlug}
                  onChange={(e) => setCompanySlug(e.target.value)}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-[var(--text-tertiary)]" size={18} />
                </div>
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-[var(--text-tertiary)]" size={18} />
                </div>
                <input
                  type="password"
                  className="w-full pl-10 pr-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg bg-gradient-primary text-white font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2
    ${loading ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"}`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <FiLogIn size={18} />
                  <span>Login</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--text-tertiary)]">
              Secure fleet management system
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
