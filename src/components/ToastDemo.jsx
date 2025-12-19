import {
  showSuccess,
  showError,
  showWarning,
  showInfo,
  showLoading,
  showPromise,
  showCreateSuccess,
  showUpdateSuccess,
  showDeleteSuccess,
  showLoginSuccess,
  showLogoutSuccess,
  showSessionExpired,
  showNetworkError,
  showServerError,
  showPermissionError,
  showValidationError,
  showBatchSuccess,
  showFormSaved,
  showUnsavedChanges,
  dismissAllToasts,
} from "../../utils/toast";

/**
 * Toast Notification Demo Component
 * Use this to test all toast notification types
 */
export default function ToastDemo() {
  const testBasicToasts = () => {
    showSuccess("This is a success message!");
    setTimeout(() => showError("This is an error message!"), 500);
    setTimeout(() => showWarning("This is a warning message!"), 1000);
    setTimeout(() => showInfo("This is an info message!"), 1500);
  };

  const testLoadingToast = () => {
    showLoading("Processing your request...");

    setTimeout(() => {
      showSuccess("Process completed successfully!");
    }, 3000);
  };

  const testPromiseToast = () => {
    const mockPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.random() > 0.5 ? resolve("Success!") : reject("Failed!");
      }, 2000);
    });

    showPromise(mockPromise, {
      loading: "Saving data...",
      success: "Data saved successfully!",
      error: "Failed to save data",
    });
  };

  const testCrudToasts = () => {
    showCreateSuccess("Vehicle");
    setTimeout(() => showUpdateSuccess("Driver"), 500);
    setTimeout(() => showDeleteSuccess("Trip"), 1000);
  };

  const testAuthToasts = () => {
    showLoginSuccess();
    setTimeout(() => showLogoutSuccess(), 1000);
    setTimeout(() => showSessionExpired(), 2000);
  };

  const testErrorToasts = () => {
    showNetworkError();
    setTimeout(() => showServerError(), 500);
    setTimeout(() => showPermissionError(), 1000);
  };

  const testValidationToast = () => {
    showValidationError(
      ["Name is required", "Email must be valid", "Phone number is invalid"],
      "Form Validation Failed"
    );
  };

  const testBatchToast = () => {
    showBatchSuccess(5, "deleted", "vehicles");
  };

  const testFormToasts = () => {
    showFormSaved("Route Configuration");
    setTimeout(() => showUnsavedChanges(), 1500);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-6">
        Toast Notification Demo
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Basic Toasts */}
        <div className="p-4 border border-[var(--border-primary)] rounded-lg">
          <h3 className="font-semibold mb-3 text-[var(--text-primary)]">
            Basic Toasts
          </h3>
          <button
            onClick={testBasicToasts}
            className="w-full px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors"
          >
            Test Basic Types
          </button>
        </div>

        {/* Loading Toast */}
        <div className="p-4 border border-[var(--border-primary)] rounded-lg">
          <h3 className="font-semibold mb-3 text-[var(--text-primary)]">
            Loading Toast
          </h3>
          <button
            onClick={testLoadingToast}
            className="w-full px-4 py-2 bg-[var(--info)] text-white rounded-lg hover:opacity-80 transition-opacity"
          >
            Test Loading
          </button>
        </div>

        {/* Promise Toast */}
        <div className="p-4 border border-[var(--border-primary)] rounded-lg">
          <h3 className="font-semibold mb-3 text-[var(--text-primary)]">
            Promise Toast
          </h3>
          <button
            onClick={testPromiseToast}
            className="w-full px-4 py-2 bg-[var(--warning)] text-white rounded-lg hover:opacity-80 transition-opacity"
          >
            Test Promise
          </button>
        </div>

        {/* CRUD Toasts */}
        <div className="p-4 border border-[var(--border-primary)] rounded-lg">
          <h3 className="font-semibold mb-3 text-[var(--text-primary)]">
            CRUD Operations
          </h3>
          <button
            onClick={testCrudToasts}
            className="w-full px-4 py-2 bg-[var(--success)] text-white rounded-lg hover:opacity-80 transition-opacity"
          >
            Test CRUD
          </button>
        </div>

        {/* Auth Toasts */}
        <div className="p-4 border border-[var(--border-primary)] rounded-lg">
          <h3 className="font-semibold mb-3 text-[var(--text-primary)]">
            Authentication
          </h3>
          <button
            onClick={testAuthToasts}
            className="w-full px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors"
          >
            Test Auth
          </button>
        </div>

        {/* Error Toasts */}
        <div className="p-4 border border-[var(--border-primary)] rounded-lg">
          <h3 className="font-semibold mb-3 text-[var(--text-primary)]">
            Error Types
          </h3>
          <button
            onClick={testErrorToasts}
            className="w-full px-4 py-2 bg-[var(--danger)] text-white rounded-lg hover:opacity-80 transition-opacity"
          >
            Test Errors
          </button>
        </div>

        {/* Validation Toast */}
        <div className="p-4 border border-[var(--border-primary)] rounded-lg">
          <h3 className="font-semibold mb-3 text-[var(--text-primary)]">
            Validation
          </h3>
          <button
            onClick={testValidationToast}
            className="w-full px-4 py-2 bg-[var(--warning)] text-white rounded-lg hover:opacity-80 transition-opacity"
          >
            Test Validation
          </button>
        </div>

        {/* Batch Toast */}
        <div className="p-4 border border-[var(--border-primary)] rounded-lg">
          <h3 className="font-semibold mb-3 text-[var(--text-primary)]">
            Batch Operations
          </h3>
          <button
            onClick={testBatchToast}
            className="w-full px-4 py-2 bg-[var(--info)] text-white rounded-lg hover:opacity-80 transition-opacity"
          >
            Test Batch
          </button>
        </div>

        {/* Form Toasts */}
        <div className="p-4 border border-[var(--border-primary)] rounded-lg">
          <h3 className="font-semibold mb-3 text-[var(--text-primary)]">
            Form Actions
          </h3>
          <button
            onClick={testFormToasts}
            className="w-full px-4 py-2 bg-[var(--success)] text-white rounded-lg hover:opacity-80 transition-opacity"
          >
            Test Forms
          </button>
        </div>
      </div>

      {/* Clear All Button */}
      <div className="flex justify-center pt-6">
        <button
          onClick={dismissAllToasts}
          className="px-6 py-2 bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-primary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
        >
          Clear All Toasts
        </button>
      </div>

      {/* Usage Instructions */}
      <div className="mt-8 p-4 bg-[var(--bg-secondary)] rounded-lg">
        <h3 className="font-semibold mb-3 text-[var(--text-primary)]">
          Usage Examples
        </h3>
        <div className="text-sm text-[var(--text-secondary)] space-y-2">
          <p>
            <code>showSuccess("Operation completed!")</code>
          </p>
          <p>
            <code>showError("Something went wrong")</code>
          </p>
          <p>
            <code>showCreateSuccess("Vehicle")</code>
          </p>
          <p>
            <code>showApiError(error)</code> - Auto extracts error message
          </p>
          <p>
            <code>
              showValidationError(["Field required", "Invalid format"])
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}
