import { FiEdit, FiTrash, FiEye, FiMoreVertical } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";

/**
 * Reusable table action buttons
 * Provides consistent edit/delete/view actions across all tables
 *
 * @param {Function} onEdit - Edit callback
 * @param {Function} onDelete - Delete callback
 * @param {Function} onView - View callback
 * @param {Array} customActions - Additional custom actions
 * @param {Object} permissions - Permission flags for each action
 * @param {string} variant - Display variant: 'inline' or 'dropdown'
 *
 * @example
 * <TableActions
 *   onEdit={() => handleEdit(row)}
 *   onDelete={() => handleDelete(row)}
 *   onView={() => handleView(row)}
 *   customActions={[
 *     { label: 'Assign', icon: <FiUser />, onClick: () => handleAssign(row) }
 *   ]}
 *   permissions={{ edit: canEdit, delete: canDelete }}
 *   variant="inline"
 * />
 */
export default function TableActions({
  onEdit,
  onDelete,
  onView,
  customActions = [],
  permissions = {},
  variant = "inline", // 'inline' or 'dropdown'
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [dropdownOpen]);

  const actions = [
    {
      key: "view",
      label: "View",
      icon: <FiEye size={16} />,
      onClick: onView,
      permission: permissions.view !== false,
      className: "text-blue-600 hover:text-blue-800 dark:text-blue-400",
    },
    {
      key: "edit",
      label: "Edit",
      icon: <FiEdit size={16} />,
      onClick: onEdit,
      permission: permissions.edit !== false,
      className: "text-blue-600 hover:text-blue-800 dark:text-blue-400",
    },
    {
      key: "delete",
      label: "Delete",
      icon: <FiTrash size={16} />,
      onClick: onDelete,
      permission: permissions.delete !== false,
      className: "text-red-600 hover:text-red-800 dark:text-red-400",
    },
    ...customActions.map((action) => ({
      ...action,
      permission: action.permission !== false,
    })),
  ].filter((action) => action.onClick && action.permission);

  if (actions.length === 0) return null;

  // Inline variant - show all buttons
  if (variant === "inline") {
    return (
      <div className="flex items-center gap-2">
        {actions.map((action) => (
          <button
            key={action.key}
            onClick={(e) => {
              e.stopPropagation();
              action.onClick();
            }}
            className={`p-1.5 rounded-md transition-colors ${action.className}`}
            title={action.label}
          >
            {action.icon}
          </button>
        ))}
      </div>
    );
  }

  // Dropdown variant - show menu
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setDropdownOpen(!dropdownOpen);
        }}
        className="p-1.5 rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
      >
        <FiMoreVertical size={18} />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-lg shadow-lg z-50">
          <div className="py-1">
            {actions.map((action) => (
              <button
                key={action.key}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick();
                  setDropdownOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <span className={action.className}>{action.icon}</span>
                <span className="text-[var(--text-primary)]">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
