import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axiosClient";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

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
    <div className="min-h-screen flex items-center justify-center bg-[#121212] px-4">
      <div className="w-full max-w-md bg-[#1E1E1E] rounded-xl shadow-lg p-8 border border-gray-800">
        <h1 className="text-2xl font-bold mb-2 text-white">Fleet Management</h1>
        <p className="text-gray-400 mb-6">Login to your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-gray-300 mb-1">Email</label>
            <input
              type="email"
              className="w-full bg-[#2A2A2A] border border-gray-700 text-gray-200 rounded px-3 py-2 
             focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-300 mb-1">Password</label>
            <input
              type="password"
              className="w-full bg-[#2A2A2A] border border-gray-700 text-gray-200 rounded px-3 py-2 
             focus:outline-none focus:ring-2 focus:ring-blue-500w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`cursor-pointer w-full py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium transition
    ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
