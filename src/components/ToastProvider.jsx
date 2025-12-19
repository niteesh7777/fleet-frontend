import { Toaster } from "react-hot-toast";
import { useThemeStore } from "../store/themeStore";

/**
 * Toast Provider component with theme-aware styling
 */
export default function ToastProvider() {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";

  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName="toast-container"
      containerStyle={{
        top: 20,
        right: 20,
      }}
      toastOptions={{
        // Default options for all toasts
        duration: 4000,
        style: {
          borderRadius: "8px",
          background: isDark ? "#374151" : "#ffffff",
          color: isDark ? "#f9fafb" : "#111827",
          border: isDark ? "1px solid #4b5563" : "1px solid #e5e7eb",
          fontSize: "14px",
          fontWeight: "500",
          maxWidth: "420px",
          padding: "12px 16px",
          boxShadow: isDark
            ? "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)"
            : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        },

        // Success toast styling
        success: {
          duration: 4000,
          style: {
            background: "var(--toast-success-bg)",
            color: "var(--toast-success-text)",
            border: "1px solid var(--toast-success-border)",
          },
          iconTheme: {
            primary: "var(--success)",
            secondary: "var(--toast-success-bg)",
          },
        },

        // Error toast styling
        error: {
          duration: 6000,
          style: {
            background: "var(--toast-error-bg)",
            color: "var(--toast-error-text)",
            border: "1px solid var(--toast-error-border)",
          },
          iconTheme: {
            primary: "var(--danger)",
            secondary: "var(--toast-error-bg)",
          },
        },

        // Loading toast styling
        loading: {
          style: {
            background: isDark ? "#374151" : "#f9fafb",
            color: isDark ? "#d1d5db" : "#6b7280",
            border: isDark ? "1px solid #4b5563" : "1px solid #d1d5db",
          },
        },
      }}
    />
  );
}
