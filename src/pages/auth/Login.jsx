import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axiosClient";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill out all fields.");
      return;
    }

    try {
      setLoading(true);

      // USE BASE URL ✔
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", res.data);

      // CORRECT EXTRACTION ✔
      const { accessToken, user } = res.data.data;

      // STORE IN ZUSTAND ✔
      setToken(accessToken);
      setUser(user);

      toast.success("Login successful!");

      // REDIRECT ✔
      navigate("/dashboard");
    } catch (err) {
      console.log(err.response?.data);
      toast.error(err.response?.data?.message || "Invalid credentials");
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

