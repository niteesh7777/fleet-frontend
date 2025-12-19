import React from "react";

/**
 * Badge component for displaying assignment/status states
 */
export default function AssignmentStatusBadge({
  status,
  size = "md",
  showIcon = true,
  className = "",
}) {
  // Normalize status to lowercase for consistent handling
  const normalizedStatus = status?.toLowerCase() || "unknown";

  // Size configurations
  const sizeConfig = {
    sm: {
      text: "text-xs",
      padding: "px-2 py-0.5",
      icon: "h-3 w-3",
    },
    md: {
      text: "text-sm",
      padding: "px-2.5 py-0.5",
      icon: "h-4 w-4",
    },
    lg: {
      text: "text-base",
      padding: "px-3 py-1",
      icon: "h-5 w-5",
    },
  };

  // Status configurations with colors, labels, and icons
  const statusConfig = {
    // Vehicle statuses
    available: {
      label: "Available",
      colors: "text-green-800 bg-green-100 border-green-200",
      icon: (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    "in-trip": {
      label: "In Trip",
      colors: "text-blue-800 bg-blue-100 border-blue-200",
      icon: (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
        </svg>
      ),
    },
    maintenance: {
      label: "Maintenance",
      colors: "text-orange-800 bg-orange-100 border-orange-200",
      icon: (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    "out-of-service": {
      label: "Out of Service",
      colors: "text-red-800 bg-red-100 border-red-200",
      icon: (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM4 10a6 6 0 1112 0A6 6 0 014 10z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },

    // Driver statuses
    active: {
      label: "Active",
      colors: "text-green-800 bg-green-100 border-green-200",
      icon: (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    "on-duty": {
      label: "On Duty",
      colors: "text-blue-800 bg-blue-100 border-blue-200",
      icon: (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    "off-duty": {
      label: "Off Duty",
      colors: "text-gray-800 bg-gray-100 border-gray-200",
      icon: (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    suspended: {
      label: "Suspended",
      colors: "text-red-800 bg-red-100 border-red-200",
      icon: (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    inactive: {
      label: "Inactive",
      colors: "text-gray-800 bg-gray-100 border-gray-200",
      icon: (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM4 10a6 6 0 1112 0A6 6 0 014 10z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },

    // Assignment statuses
    assigned: {
      label: "Assigned",
      colors: "text-blue-800 bg-blue-100 border-blue-200",
      icon: (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    unassigned: {
      label: "Unassigned",
      colors: "text-gray-800 bg-gray-100 border-gray-200",
      icon: (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },

    // Generic statuses
    pending: {
      label: "Pending",
      colors: "text-yellow-800 bg-yellow-100 border-yellow-200",
      icon: (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    unknown: {
      label: "Unknown",
      colors: "text-gray-800 bg-gray-100 border-gray-200",
      icon: (
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  };

  const config = statusConfig[normalizedStatus] || statusConfig.unknown;
  const sizeSettings = sizeConfig[size] || sizeConfig.md;

  return (
    <span
      className={`
        inline-flex items-center
        ${sizeSettings.text}
        ${sizeSettings.padding}
        font-medium
        rounded-full
        border
        ${config.colors}
        ${className}
      `}
    >
      {showIcon && (
        <span className={`${sizeSettings.icon} mr-1 shrink-0`}>
          {config.icon}
        </span>
      )}
      {config.label}
    </span>
  );
}

// Status constants are exported from a separate file to support fast refresh
