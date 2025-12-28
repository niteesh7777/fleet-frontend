import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiUser, FiBriefcase, FiLink } from "react-icons/fi";
import {
  showSignupSuccess,
  showSignupError,
  showValidationError,
  showLoading,
  dismissToast,
} from "../../utils/toast";
import { authApi } from "../../api/endpoints";

export default function Register() {
  const [formData, setFormData] = useState({
    companyName: "",
    slug: "",
    ownerName: "",
    ownerEmail: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto-generate slug from company name
    if (name === "companyName") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with single
        .trim();
      setFormData((prev) => ({
        ...prev,
        slug: slug,
      }));
    }
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.companyName.trim()) {
      errors.push("Company name is required");
    }

    if (!formData.slug.trim()) {
      errors.push("Company slug is required");
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.push(
        "Slug must contain only lowercase letters, numbers, and hyphens"
      );
    }

    if (!formData.ownerName.trim()) {
      errors.push("Owner name is required");
    }

    if (!formData.ownerEmail.trim()) {
      errors.push("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(formData.ownerEmail)) {
      errors.push("Please enter a valid email address");
    }

    if (!formData.password) {
      errors.push("Password is required");
    } else if (formData.password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    if (formData.password !== formData.confirmPassword) {
      errors.push("Passwords do not match");
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      showValidationError(errors);
      return;
    }

    let loadingToast;

    try {
      setLoading(true);
      loadingToast = showLoading("Creating your company...");

      const signupData = {
        companyName: formData.companyName.trim(),
        slug: formData.slug.trim(),
        ownerName: formData.ownerName.trim(),
        ownerEmail: formData.ownerEmail.trim(),
        password: formData.password,
      };

      const response = await authApi.platformSignup(signupData);

      if (response) {
        dismissToast(loadingToast);
        showSignupSuccess();
        navigate("/login", {
          state: {
            message:
              "Company created successfully! Please log in with your credentials.",
          },
        });
      }
    } catch (error) {
      dismissToast(loadingToast);
      const errorMessage =
        error.response?.data?.message || "Failed to create company";
      showSignupError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create Your Company
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Get started with Fleet Management SaaS
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Company Name */}
            <div>
              <label htmlFor="companyName" className="sr-only">
                Company Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiBriefcase className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Company Name"
                  value={formData.companyName}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Company Slug */}
            <div>
              <label htmlFor="slug" className="sr-only">
                Company Slug
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLink className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="slug"
                  name="slug"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="company-slug"
                  value={formData.slug}
                  onChange={handleChange}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                This will be your company's unique URL identifier
              </p>
            </div>

            {/* Owner Name */}
            <div>
              <label htmlFor="ownerName" className="sr-only">
                Owner Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="ownerName"
                  name="ownerName"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Your Full Name"
                  value={formData.ownerName}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Owner Email */}
            <div>
              <label htmlFor="ownerEmail" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="ownerEmail"
                  name="ownerEmail"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={formData.ownerEmail}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password (min 8 characters)"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Company..." : "Create Company"}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Already have an account? Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
