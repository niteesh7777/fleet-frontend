import { useState } from "react";
import PropTypes from "prop-types";

/**
 * Bulk selection hook for tables
 * Manages multi-select state and operations
 */
export default function useBulkSelection(items = [], idKey = "_id") {
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSelection = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((item) => item[idKey]));
    }
  };

  const isSelected = (id) => selectedIds.includes(id);

  const isAllSelected = items.length > 0 && selectedIds.length === items.length;

  const isSomeSelected =
    selectedIds.length > 0 && selectedIds.length < items.length;

  const clearSelection = () => setSelectedIds([]);

  const getSelectedItems = () => {
    return items.filter((item) => selectedIds.includes(item[idKey]));
  };

  return {
    selectedIds,
    selectedCount: selectedIds.length,
    toggleSelection,
    toggleAll,
    isSelected,
    isAllSelected,
    isSomeSelected,
    clearSelection,
    getSelectedItems,
  };
}

/**
 * Bulk action toolbar component
 * Shows available bulk operations when items are selected
 */
export function BulkActionToolbar({
  selectedCount,
  onDelete,
  onExport,
  onClearSelection,
}) {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4 flex items-center justify-between animate-fade-in">
      <div className="flex items-center gap-3">
        <span className="text-blue-600 font-semibold">
          {selectedCount} item{selectedCount > 1 ? "s" : ""} selected
        </span>
        <button
          onClick={onClearSelection}
          className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline"
        >
          Clear selection
        </button>
      </div>
      <div className="flex gap-2">
        {onExport && (
          <button
            onClick={onExport}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Export ({selectedCount})
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete ({selectedCount})
          </button>
        )}
      </div>
    </div>
  );
}

BulkActionToolbar.propTypes = {
  selectedCount: PropTypes.number.isRequired,
  onDelete: PropTypes.func,
  onExport: PropTypes.func,
  onClearSelection: PropTypes.func.isRequired,
};

/**
 * Checkbox component for bulk selection
 */
export function BulkSelectCheckbox({
  checked,
  indeterminate,
  onChange,
  ...props
}) {
  return (
    <input
      type="checkbox"
      checked={checked}
      ref={(input) => {
        if (input) input.indeterminate = indeterminate;
      }}
      onChange={onChange}
      className="w-4 h-4 text-blue-600 bg-[var(--bg-secondary)] border-[var(--border-primary)] rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
      {...props}
    />
  );
}

BulkSelectCheckbox.propTypes = {
  checked: PropTypes.bool,
  indeterminate: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};
