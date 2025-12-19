import React from "react";

/**
 * TextArea component for multi-line text input
 */
export default function TextArea({
  label,
  placeholder,
  value,
  onChange,
  rows = 3,
  className = "",
  disabled = false,
  required = false,
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        required={required}
        className={`
          w-full px-3 py-2 border border-gray-300 rounded-lg
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:opacity-50 disabled:cursor-not-allowed
          resize-vertical min-h-[80px]
          bg-white dark:bg-gray-800 
          text-[var(--text-primary)] dark:text-gray-100
          dark:border-gray-600 dark:focus:border-blue-400
          transition-colors duration-200
          ${className}
        `}
        {...props}
      />
    </div>
  );
}
