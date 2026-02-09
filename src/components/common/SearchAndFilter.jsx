import React, { useState, useCallback, useEffect } from "react";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { cn } from "../../utils/cn";

/**
 * Advanced search and filter component for tables
 */
export default function SearchAndFilter({
  onSearch,
  onFilter,
  searchPlaceholder = "Search...",
  searchValue = "",
  filters = [],
  activeFilters: initialActiveFilters = {},
  className = "",
  showFilterPanel = false,
  onToggleFilterPanel,
}) {
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);
  const [activeFilters, setActiveFilters] = useState(initialActiveFilters);
  const [showFilters, setShowFilters] = useState(showFilterPanel);

  // Update activeFilters when initialActiveFilters prop changes
  useEffect(() => {
    setActiveFilters(initialActiveFilters);
  }, [initialActiveFilters]);

  // Handle search input with debouncing
  const handleSearchChange = useCallback(
    (e) => {
      const value = e.target.value;
      setLocalSearchValue(value);

      // Debounced search
      const timeoutId = setTimeout(() => {
        onSearch?.(value);
      }, 300);

      return () => clearTimeout(timeoutId);
    },
    [onSearch],
  );

  // Handle search submit
  const handleSearchSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onSearch?.(localSearchValue);
    },
    [localSearchValue, onSearch],
  );

  // Clear search
  const clearSearch = useCallback(() => {
    setLocalSearchValue("");
    onSearch?.("");
  }, [onSearch]);

  // Handle filter change
  const handleFilterChange = useCallback(
    (filterKey, value) => {
      setActiveFilters((prev) => {
        const newFilters = { ...prev };

        // Remove filter if value is empty
        if (value === "" || value === null || value === undefined) {
          delete newFilters[filterKey];
        } else {
          newFilters[filterKey] = value;
        }

        // Call parent callback with updated filters
        onFilter?.(newFilters);
        return newFilters;
      });
    },
    [onFilter],
  );

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setActiveFilters({});
    onFilter?.({});
  }, [onFilter]);

  // Remove individual filter
  const removeFilter = useCallback(
    (filterKey) => {
      handleFilterChange(filterKey, "");
    },
    [handleFilterChange],
  );

  // Toggle filter panel
  const toggleFilters = useCallback(() => {
    const newShowFilters = !showFilters;
    setShowFilters(newShowFilters);
    onToggleFilterPanel?.(newShowFilters);
  }, [showFilters, onToggleFilterPanel]);

  // Count active filters
  const activeFilterCount = Object.keys(activeFilters).length;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search and Filter Toggle Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex-1">
          <div className="relative">
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={localSearchValue}
              onChange={handleSearchChange}
              className="pl-10 pr-10"
            />
            <FiSearch
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-(--text-tertiary)"
            />
            {localSearchValue && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-(--text-tertiary) hover:text-(--text-primary) transition-colors"
              >
                <FiX size={16} />
              </button>
            )}
          </div>
        </form>

        {/* Filter Toggle Button */}
        {filters.length > 0 && (
          <Button
            variant="outline"
            onClick={toggleFilters}
            icon={<FiFilter size={16} />}
            className="relative"
          >
            Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-(--primary) text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && filters.length > 0 && (
        <div className="bg-(--bg-secondary) rounded-lg p-4 border border-(--border-primary)">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-(--text-primary)">Filters</h3>
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear all
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map((filter) => (
              <div key={filter.key}>
                <label className="block text-sm font-medium text-(--text-secondary) mb-1">
                  {filter.label}
                </label>

                {filter.type === "select" && (
                  <select
                    value={activeFilters[filter.key] || ""}
                    onChange={(e) =>
                      handleFilterChange(filter.key, e.target.value)
                    }
                    className={cn(
                      "w-full px-3 py-2 border rounded-lg transition-all duration-200",
                      "bg-(--bg-primary) border-(--border-primary) text-(--text-primary)",
                      "focus:outline-none focus:ring-2 focus:ring-(--primary) focus:border-transparent",
                      "hover:border-(--primary)",
                    )}
                  >
                    <option value="">All {filter.label}</option>
                    {filter.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}

                {filter.type === "input" && (
                  <Input
                    type={filter.inputType || "text"}
                    placeholder={filter.placeholder}
                    value={activeFilters[filter.key] || ""}
                    onChange={(e) =>
                      handleFilterChange(filter.key, e.target.value)
                    }
                  />
                )}

                {filter.type === "date" && (
                  <Input
                    type="date"
                    value={activeFilters[filter.key] || ""}
                    onChange={(e) =>
                      handleFilterChange(filter.key, e.target.value)
                    }
                  />
                )}

                {filter.type === "dateRange" && (
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      placeholder="From"
                      value={activeFilters[`${filter.key}_from`] || ""}
                      onChange={(e) =>
                        handleFilterChange(`${filter.key}_from`, e.target.value)
                      }
                    />
                    <Input
                      type="date"
                      placeholder="To"
                      value={activeFilters[`${filter.key}_to`] || ""}
                      onChange={(e) =>
                        handleFilterChange(`${filter.key}_to`, e.target.value)
                      }
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-(--text-secondary)">
            Active Filters:
          </span>
          {Object.entries(activeFilters).map(([key, value]) => {
            const filter = filters.find(
              (f) => f.key === key || key.startsWith(f.key),
            );
            if (!filter || !value) return null;

            const displayValue =
              filter.type === "select"
                ? filter.options?.find((opt) => opt.value === value)?.label ||
                  value
                : value;

            return (
              <span
                key={key}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium",
                  "bg-(--primary-light) text-(--primary) border border-(--primary)",
                  "transition-all duration-200",
                )}
              >
                <span className="font-semibold">{filter.label}:</span>
                <span>{displayValue}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFilter(key);
                  }}
                  className={cn(
                    "ml-1 rounded-full p-0.5 transition-colors duration-200",
                    "hover:bg-(--primary) hover:text-white",
                    "focus:outline-none focus:ring-2 focus:ring-(--primary) focus:ring-offset-1",
                  )}
                  aria-label={`Remove ${filter.label} filter`}
                  title={`Remove ${filter.label} filter`}
                >
                  <FiX size={14} />
                </button>
              </span>
            );
          })}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-(--danger) hover:text-(--danger) hover:bg-(--danger-light)"
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
}
