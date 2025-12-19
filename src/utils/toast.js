import toast from "react-hot-toast";

/**
 * Enhanced toast notification utilities with consistent styling and error handling
 */

// Default toast configuration
const defaultToastOptions = {
  duration: 4000,
  position: "top-right",
  style: {
    borderRadius: "8px",
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
    border: "1px solid var(--border-primary)",
    fontSize: "14px",
    fontWeight: "500",
    maxWidth: "400px",
  },
};

// Success toast with check icon
export const showSuccess = (message, options = {}) => {
  return toast.success(message, {
    ...defaultToastOptions,
    ...options,
    style: {
      ...defaultToastOptions.style,
      background: "var(--toast-success-bg)",
      color: "var(--toast-success-text)",
      border: "1px solid var(--toast-success-border)",
      ...options.style,
    },
    iconTheme: {
      primary: "var(--success)",
      secondary: "var(--toast-success-bg)",
    },
  });
};

// Error toast with X icon
export const showError = (message, options = {}) => {
  return toast.error(message, {
    ...defaultToastOptions,
    duration: 6000, // Longer duration for errors
    ...options,
    style: {
      ...defaultToastOptions.style,
      background: "var(--toast-error-bg)",
      color: "var(--toast-error-text)",
      border: "1px solid var(--toast-error-border)",
      ...options.style,
    },
    iconTheme: {
      primary: "var(--danger)",
      secondary: "var(--toast-error-bg)",
    },
  });
};

// Warning toast with warning icon
export const showWarning = (message, options = {}) => {
  return toast(message, {
    ...defaultToastOptions,
    ...options,
    style: {
      ...defaultToastOptions.style,
      background: "var(--toast-warning-bg)",
      color: "var(--toast-warning-text)",
      border: "1px solid var(--toast-warning-border)",
      ...options.style,
    },
    icon: "⚠️",
  });
};

// Info toast with info icon
export const showInfo = (message, options = {}) => {
  return toast(message, {
    ...defaultToastOptions,
    ...options,
    style: {
      ...defaultToastOptions.style,
      background: "var(--toast-info-bg)",
      color: "var(--toast-info-text)",
      border: "1px solid var(--toast-info-border)",
      ...options.style,
    },
    icon: "ℹ️",
  });
};

// Loading toast for async operations
export const showLoading = (message = "Loading...", options = {}) => {
  return toast.loading(message, {
    ...defaultToastOptions,
    ...options,
    style: {
      ...defaultToastOptions.style,
      background: "var(--bg-secondary)",
      color: "var(--text-secondary)",
      ...options.style,
    },
  });
};

// Promise toast for handling async operations
export const showPromise = (promise, messages, options = {}) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading || "Loading...",
      success: messages.success || "Success!",
      error: messages.error || "Something went wrong",
    },
    {
      ...defaultToastOptions,
      ...options,
      success: {
        ...defaultToastOptions,
        style: {
          ...defaultToastOptions.style,
          background: "var(--success-bg, #f0f9f0)",
          color: "var(--success-text, #047857)",
          border: "1px solid var(--success-border, #10b981)",
        },
        ...options.success,
      },
      error: {
        ...defaultToastOptions,
        duration: 6000,
        style: {
          ...defaultToastOptions.style,
          background: "var(--error-bg, #fef2f2)",
          color: "var(--error-text, #dc2626)",
          border: "1px solid var(--error-border, #ef4444)",
        },
        ...options.error,
      },
    }
  );
};

// Dismiss specific toast
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

// Dismiss all toasts
export const dismissAllToasts = () => {
  toast.dismiss();
};

/**
 * Enhanced error handling utilities
 */

// Extract error message from different error types
export const extractErrorMessage = (error) => {
  if (typeof error === "string") {
    return error;
  }

  if (error?.response?.data) {
    const data = error.response.data;

    // Handle validation errors (Joi format)
    if (data.details && Array.isArray(data.details)) {
      return data.details.map((d) => d.message).join(", ");
    }

    // Handle structured error response
    if (data.message) {
      return data.message;
    }

    // Handle field-specific errors
    if (data.errors && typeof data.errors === "object") {
      return Object.values(data.errors).flat().join(", ");
    }
  }

  // Handle axios errors
  if (error?.message) {
    return error.message;
  }

  // Fallback
  return "An unexpected error occurred";
};

// Show error with proper message extraction
export const showApiError = (error, fallbackMessage = "An error occurred") => {
  const message = extractErrorMessage(error) || fallbackMessage;
  return showError(message);
};

// Show validation error with field-specific messages
export const showValidationError = (errors, title = "Validation Error") => {
  if (Array.isArray(errors)) {
    const message = errors.join("\n");
    return showError(`${title}:\n${message}`);
  }

  if (typeof errors === "object") {
    const messages = Object.entries(errors)
      .map(
        ([field, msgs]) =>
          `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`
      )
      .join("\n");
    return showError(`${title}:\n${messages}`);
  }

  return showError(errors || title);
};

/**
 * Operation-specific toast helpers
 */

// CRUD operation toasts
export const showCreateSuccess = (entityName = "Item") => {
  return showSuccess(`${entityName} created successfully!`);
};

export const showUpdateSuccess = (entityName = "Item") => {
  return showSuccess(`${entityName} updated successfully!`);
};

export const showDeleteSuccess = (entityName = "Item") => {
  return showSuccess(`${entityName} deleted successfully!`);
};

export const showCreateError = (entityName = "Item", error) => {
  const message =
    extractErrorMessage(error) ||
    `Failed to create ${entityName.toLowerCase()}`;
  return showError(message);
};

export const showUpdateError = (entityName = "Item", error) => {
  const message =
    extractErrorMessage(error) ||
    `Failed to update ${entityName.toLowerCase()}`;
  return showError(message);
};

export const showDeleteError = (entityName = "Item", error) => {
  const message =
    extractErrorMessage(error) ||
    `Failed to delete ${entityName.toLowerCase()}`;
  return showError(message);
};

export const showFetchError = (entityName = "data", error) => {
  const message =
    extractErrorMessage(error) || `Failed to load ${entityName.toLowerCase()}`;
  return showError(message);
};

// Authentication toasts
export const showLoginSuccess = () => {
  return showSuccess("Welcome back! You're now logged in.");
};

export const showLoginError = (error) => {
  const message =
    extractErrorMessage(error) || "Invalid credentials. Please try again.";
  return showError(message);
};

export const showLogoutSuccess = () => {
  return showInfo("You've been logged out successfully.");
};

export const showSessionExpired = () => {
  return showWarning("Your session has expired. Please log in again.");
};

// Network error toasts
export const showNetworkError = () => {
  return showError(
    "Network error. Please check your connection and try again."
  );
};

export const showServerError = () => {
  return showError("Server error. Please try again later.");
};

// Permission error toasts
export const showPermissionError = () => {
  return showError("You don't have permission to perform this action.");
};

export const showUnauthorizedError = () => {
  return showError("You need to log in to access this feature.");
};

/**
 * Batch operation toasts
 */

export const showBatchSuccess = (count, operation, entityName = "items") => {
  return showSuccess(`Successfully ${operation} ${count} ${entityName}.`);
};

export const showBatchError = (count, operation, entityName = "items") => {
  return showError(`Failed to ${operation} ${count} ${entityName}.`);
};

export const showPartialBatchSuccess = (
  successCount,
  totalCount,
  operation,
  entityName = "items"
) => {
  return showWarning(
    `${operation} ${successCount} of ${totalCount} ${entityName}. Some operations failed.`
  );
};

/**
 * Form-specific toasts
 */

export const showFormSaved = (formName = "Form") => {
  return showSuccess(`${formName} saved successfully!`);
};

export const showFormError = (error, formName = "Form") => {
  const message =
    extractErrorMessage(error) || `Failed to save ${formName.toLowerCase()}`;
  return showError(message);
};

export const showUnsavedChanges = () => {
  return showWarning("You have unsaved changes. Please save before leaving.");
};

/**
 * Custom toast configurations
 */

// Configuration for different toast types
export const toastConfig = {
  success: {
    duration: 4000,
    style: {
      background: "var(--success-bg, #f0f9f0)",
      color: "var(--success-text, #047857)",
      border: "1px solid var(--success-border, #10b981)",
    },
  },
  error: {
    duration: 6000,
    style: {
      background: "var(--error-bg, #fef2f2)",
      color: "var(--error-text, #dc2626)",
      border: "1px solid var(--error-border, #ef4444)",
    },
  },
  warning: {
    duration: 5000,
    style: {
      background: "var(--warning-bg, #fffbeb)",
      color: "var(--warning-text, #d97706)",
      border: "1px solid var(--warning-border, #f59e0b)",
    },
  },
  info: {
    duration: 4000,
    style: {
      background: "var(--info-bg, #eff6ff)",
      color: "var(--info-text, #2563eb)",
      border: "1px solid var(--info-border, #3b82f6)",
    },
  },
};

// Export toast instance for custom usage
export { toast };
export default toast;
