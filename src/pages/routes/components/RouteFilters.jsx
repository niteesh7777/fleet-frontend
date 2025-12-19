import { useState } from "react";
import PropTypes from "prop-types";
import { FiFilter, FiX } from "react-icons/fi";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Modal from "../../../components/ui/Modal";
import { VEHICLE_TYPES } from "../../../utils/routeValidation";

export default function RouteFilters({ onFilterChange, currentFilters }) {
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    isActive: undefined,
    minDistance: "",
    maxDistance: "",
    vehicleTypes: [],
    ...currentFilters,
  });

  const hasActiveFilters = () => {
    return (
      filters.isActive !== undefined ||
      filters.minDistance ||
      filters.maxDistance ||
      filters.vehicleTypes.length > 0
    );
  };

  const handleApply = () => {
    const cleanFilters = {
      ...(filters.isActive !== undefined && { isActive: filters.isActive }),
      ...(filters.minDistance && { minDistance: Number(filters.minDistance) }),
      ...(filters.maxDistance && { maxDistance: Number(filters.maxDistance) }),
      ...(filters.vehicleTypes.length > 0 && {
        vehicleTypes: filters.vehicleTypes,
      }),
    };

    onFilterChange(cleanFilters);
    setShowModal(false);
  };

  const handleClear = () => {
    const resetFilters = {
      isActive: undefined,
      minDistance: "",
      maxDistance: "",
      vehicleTypes: [],
    };

    setFilters(resetFilters);
    onFilterChange({});
  };

  const toggleVehicleType = (type) => {
    setFilters((prev) => ({
      ...prev,
      vehicleTypes: prev.vehicleTypes.includes(type)
        ? prev.vehicleTypes.filter((t) => t !== type)
        : [...prev.vehicleTypes, type],
    }));
  };

  return (
    <>
      <Button
        variant="ghost"
        icon={<FiFilter size={18} />}
        onClick={() => setShowModal(true)}
        className={hasActiveFilters() ? "bg-blue-50 text-blue-600" : ""}
      >
        Filter{" "}
        {hasActiveFilters() && `(${Object.keys(currentFilters || {}).length})`}
      </Button>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Filter Routes"
      >
        <div className="space-y-6">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
              Status
            </label>
            <div className="flex gap-2">
              <Button
                variant={filters.isActive === undefined ? "primary" : "ghost"}
                size="sm"
                onClick={() =>
                  setFilters((prev) => ({ ...prev, isActive: undefined }))
                }
              >
                All
              </Button>
              <Button
                variant={filters.isActive === true ? "primary" : "ghost"}
                size="sm"
                onClick={() =>
                  setFilters((prev) => ({ ...prev, isActive: true }))
                }
              >
                Active
              </Button>
              <Button
                variant={filters.isActive === false ? "primary" : "ghost"}
                size="sm"
                onClick={() =>
                  setFilters((prev) => ({ ...prev, isActive: false }))
                }
              >
                Inactive
              </Button>
            </div>
          </div>

          {/* Distance Range */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
              Distance Range (km)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                placeholder="Min distance"
                value={filters.minDistance}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    minDistance: e.target.value,
                  }))
                }
              />
              <Input
                type="number"
                placeholder="Max distance"
                value={filters.maxDistance}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    maxDistance: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          {/* Vehicle Types */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
              Preferred Vehicle Types
            </label>
            <div className="flex flex-wrap gap-2">
              {VEHICLE_TYPES.map((type) => (
                <Button
                  key={type}
                  variant={
                    filters.vehicleTypes.includes(type) ? "primary" : "ghost"
                  }
                  size="sm"
                  onClick={() => toggleVehicleType(type)}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <Button
              variant="ghost"
              icon={<FiX size={16} />}
              onClick={handleClear}
            >
              Clear All
            </Button>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleApply}>Apply Filters</Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

RouteFilters.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  currentFilters: PropTypes.object,
};
