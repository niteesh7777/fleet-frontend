import React, { useState, useCallback } from "react";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";
import Button from "../ui/Button";
import Input from "../ui/Input";

/**
 * Advanced search and filter component for tables
 */
export default function SearchAndFilter({
  onSearch,
  onFilter,
  searchPlaceholder = "Search...",
  searchValue = "",
  filters = [],
  activeFilters = {},
  className = "",
  showFilterPanel = false,
  onToggleFilterPanel,
}) {
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);
  const [showFilters, setShowFilters] = useState(showFilterPanel);

  // Handle search input
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
    [onSearch]
  );

  // Handle search submit
  const handleSearchSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onSearch?.(localSearchValue);
    },
    [localSearchValue, onSearch]
  );

  // Clear search
  const clearSearch = useCallback(() => {
    setLocalSearchValue("");
    onSearch?.("");
  }, [onSearch]);

  // Handle filter change
  const handleFilterChange = useCallback(
    (filterKey, value) => {
      const newFilters = { ...activeFilters };

      if (value === "" || value === null || value === undefined) {
        delete newFilters[filterKey];
      } else {
        newFilters[filterKey] = value;
      }

      onFilter?.(newFilters);
    },
    [activeFilters, onFilter]
  );

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    onFilter?.({});
  }, [onFilter]);

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
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            {localSearchValue && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && filters.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              Filters
            </h3>
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear all
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map((filter) => (
              <div key={filter.key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {filter.label}
                </label>

                {filter.type === "select" && (
                  <select
                    value={activeFilters[filter.key] || ""}
                    onChange={(e) =>
                      handleFilterChange(filter.key, e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600"
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
        <div className="flex flex-wrap gap-2">
          {Object.entries(activeFilters).map(([key, value]) => {
            const filter = filters.find(
              (f) => f.key === key || key.startsWith(f.key)
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
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {filter.label}: {displayValue}
                <button
                  onClick={() => handleFilterChange(key, "")}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <FiX size={12} />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
