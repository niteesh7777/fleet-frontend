import { FiSearch, FiX, FiFilter } from "react-icons/fi";
import Input from "./ui/Input";
import Button from "./ui/Button";
import { useState } from "react";

/**
 * Reusable search and filters component
 * Provides consistent search/filter UI across paginated pages
 *
 * @param {string} searchPlaceholder - Search input placeholder
 * @param {string} searchValue - Current search value
 * @param {Function} onSearchChange - Search change handler
 * @param {Array} filters - Array of filter configurations
 * @param {Function} onClear - Clear all filters handler
 * @param {boolean} showFilterToggle - Show/hide filter section toggle
 * @param {string} className - Additional CSS classes
 *
 * @example
 * <SearchAndFilters
 *   searchPlaceholder="Search drivers..."
 *   searchValue={search}
 *   onSearchChange={setSearch}
 *   filters={[
 *     {
 *       type: 'select',
 *       label: 'Status',
 *       value: statusFilter,
 *       onChange: setStatusFilter,
 *       options: [
 *         { value: '', label: 'All Status' },
 *         { value: 'active', label: 'Active' },
 *         { value: 'inactive', label: 'Inactive' }
 *       ]
 *     },
 *     {
 *       type: 'date-range',
 *       label: 'Date Range',
 *       value: { from: dateFrom, to: dateTo },
 *       onChange: ({ from, to }) => { setDateFrom(from); setDateTo(to); }
 *     }
 *   ]}
 *   onClear={handleClearFilters}
 * />
 */
export default function SearchAndFilters({
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  filters = [],
  onClear,
  showFilterToggle = false,
  className = "",
}) {
  const [filtersExpanded, setFiltersExpanded] = useState(true);

  // Check if any filters are active
  const hasActiveFilters = () => {
    if (searchValue) return true;
    return filters.some((filter) => {
      if (filter.type === "select") {
        return filter.value && filter.value !== "";
      }
      if (filter.type === "date-range") {
        return filter.value?.from || filter.value?.to;
      }
      if (filter.type === "checkbox") {
        return filter.value === true;
      }
      return false;
    });
  };

  const handleClear = () => {
    if (onSearchChange) onSearchChange("");
    if (onClear) onClear();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            icon={<FiSearch />}
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          />
        </div>

        {showFilterToggle && filters.length > 0 && (
          <Button
            variant="secondary"
            onClick={() => setFiltersExpanded(!filtersExpanded)}
          >
            <FiFilter />
            Filters
          </Button>
        )}

        {hasActiveFilters() && (
          <Button variant="secondary" onClick={handleClear}>
            <FiX />
            Clear
          </Button>
        )}
      </div>

      {/* Filters Section */}
      {filters.length > 0 && (!showFilterToggle || filtersExpanded) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filters.map((filter, index) => (
            <div key={index}>
              {filter.label && (
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                  {filter.label}
                </label>
              )}

              {/* Select Filter */}
              {filter.type === "select" && (
                <select
                  value={filter.value || ""}
                  onChange={(e) => filter.onChange(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent text-[var(--text-primary)]"
                >
                  {filter.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}

              {/* Date Input */}
              {filter.type === "date" && (
                <input
                  type="date"
                  value={filter.value || ""}
                  onChange={(e) => filter.onChange(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent text-[var(--text-primary)]"
                />
              )}

              {/* Date Range Filter */}
              {filter.type === "date-range" && (
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={filter.value?.from || ""}
                    onChange={(e) =>
                      filter.onChange({
                        ...filter.value,
                        from: e.target.value,
                      })
                    }
                    placeholder="From"
                    className="flex-1 px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent text-[var(--text-primary)]"
                  />
                  <input
                    type="date"
                    value={filter.value?.to || ""}
                    onChange={(e) =>
                      filter.onChange({
                        ...filter.value,
                        to: e.target.value,
                      })
                    }
                    placeholder="To"
                    className="flex-1 px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent text-[var(--text-primary)]"
                  />
                </div>
              )}

              {/* Checkbox Filter */}
              {filter.type === "checkbox" && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filter.value || false}
                    onChange={(e) => filter.onChange(e.target.checked)}
                    className="w-4 h-4 text-[var(--primary)] border-[var(--border-primary)] rounded focus:ring-2 focus:ring-[var(--primary)]"
                  />
                  <span className="text-sm text-[var(--text-primary)]">
                    {filter.checkboxLabel || filter.label}
                  </span>
                </label>
              )}

              {/* Text Input Filter */}
              {filter.type === "text" && (
                <Input
                  value={filter.value || ""}
                  onChange={(e) => filter.onChange(e.target.value)}
                  placeholder={filter.placeholder}
                />
              )}

              {/* Number Input Filter */}
              {filter.type === "number" && (
                <input
                  type="number"
                  value={filter.value || ""}
                  onChange={(e) => filter.onChange(e.target.value)}
                  placeholder={filter.placeholder}
                  min={filter.min}
                  max={filter.max}
                  className="w-full px-3 py-2 bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent text-[var(--text-primary)]"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
