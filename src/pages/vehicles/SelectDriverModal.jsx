import React, { useState, useEffect, useCallback } from "react";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import useVehicleDriverAssignment from "./hooks/useVehicleDriverAssignment";

/**
 * Modal for selecting and assigning drivers to a vehicle
 */
export default function SelectDriverModal({
  isOpen,
  onClose,
  vehicle,
  onAssignmentSuccess,
}) {
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [selectedDrivers, setSelectedDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [filterStatus, setFilterStatus] = useState("available");

  const {
    assignDriver,
    bulkAssignDrivers,
    getAvailableDrivers,
    loading: assignmentLoading,
  } = useVehicleDriverAssignment();

  // Load available drivers when modal opens
  useEffect(() => {
    if (isOpen) {
      loadAvailableDrivers();
      setSelectedDrivers([]);
      setSearchTerm("");
    }
  }, [isOpen, filterStatus]); // Added filterStatus dependency

  const loadAvailableDrivers = useCallback(async () => {
    setLoadingDrivers(true);
    try {
      const drivers = await getAvailableDrivers(filterStatus === "available");

      // Filter out drivers already assigned to this vehicle
      const currentlyAssigned =
        vehicle?.assignedDrivers?.map((d) => d._id || d) || [];
      const filteredDrivers = drivers.filter(
        (driver) => !currentlyAssigned.includes(driver._id)
      );

      setAvailableDrivers(filteredDrivers);
    } catch (error) {
      console.error("Failed to load drivers:", error);
      setAvailableDrivers([]);
    } finally {
      setLoadingDrivers(false);
    }
  }, [getAvailableDrivers, filterStatus, vehicle?.assignedDrivers]);

  // Filter drivers based on search term
  const filteredDrivers = availableDrivers.filter((driver) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      driver.user?.firstName?.toLowerCase().includes(searchLower) ||
      driver.user?.lastName?.toLowerCase().includes(searchLower) ||
      driver.user?.email?.toLowerCase().includes(searchLower) ||
      driver.licenseNumber?.toLowerCase().includes(searchLower)
    );
  });

  // Toggle driver selection
  const toggleDriverSelection = (driverId) => {
    setSelectedDrivers((prev) => {
      if (prev.includes(driverId)) {
        return prev.filter((id) => id !== driverId);
      } else {
        return [...prev, driverId];
      }
    });
  };

  // Select all filtered drivers
  const selectAllDrivers = () => {
    const allFilteredIds = filteredDrivers.map((driver) => driver._id);
    setSelectedDrivers(allFilteredIds);
  };

  // Clear all selections
  const clearSelections = () => {
    setSelectedDrivers([]);
  };

  // Handle assignment
  const handleAssignment = async () => {
    if (selectedDrivers.length === 0) return;

    try {
      if (selectedDrivers.length === 1) {
        // Single assignment
        await assignDriver(vehicle._id, selectedDrivers[0], {
          vehicleNo: vehicle.vehicleNo,
          driverName: filteredDrivers.find((d) => d._id === selectedDrivers[0])
            ?.user?.firstName,
        });
      } else {
        // Bulk assignment
        await bulkAssignDrivers(vehicle._id, selectedDrivers, {
          vehicleNo: vehicle.vehicleNo,
        });
      }

      // Notify parent component of successful assignment
      if (onAssignmentSuccess) {
        onAssignmentSuccess();
      }

      onClose();
    } catch (error) {
      // Error handling is done in the hook
      console.error("Assignment failed:", error);
    }
  };

  const getDriverDisplayName = (driver) => {
    const firstName = driver.user?.firstName || "";
    const lastName = driver.user?.lastName || "";
    return `${firstName} ${lastName}`.trim() || "Unknown Driver";
  };

  const getDriverStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "text-green-600 bg-green-500/10";
      case "on-duty":
        return "text-blue-600 bg-blue-500/10";
      case "off-duty":
        return "text-[var(--text-tertiary)] bg-[var(--bg-secondary)]";
      case "suspended":
        return "text-red-600 bg-red-500/10";
      default:
        return "text-[var(--text-tertiary)] bg-[var(--bg-secondary)]";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Assign Drivers to ${vehicle?.vehicleNo || "Vehicle"}`}
      size="large"
    >
      <div className="space-y-6">
        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search drivers by name, email, or license..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[var(--text-primary)] placeholder-[var(--text-tertiary)]"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[var(--text-primary)]"
              >
                <option value="available">Available Only</option>
                <option value="all">All Drivers</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={loadAvailableDrivers}
                disabled={loadingDrivers}
              >
                {loadingDrivers ? "Loading..." : "Refresh"}
              </Button>
            </div>
          </div>

          {/* Selection Actions */}
          {filteredDrivers.length > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--text-secondary)]">
                {selectedDrivers.length} of {filteredDrivers.length} drivers
                selected
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectAllDrivers}
                  disabled={selectedDrivers.length === filteredDrivers.length}
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearSelections}
                  disabled={selectedDrivers.length === 0}
                >
                  Clear All
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Drivers List */}
        <div className="max-h-96 overflow-y-auto border border-[var(--border-primary)] rounded-lg">
          {loadingDrivers ? (
            <div className="p-8 text-center text-[var(--text-secondary)]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              Loading available drivers...
            </div>
          ) : filteredDrivers.length === 0 ? (
            <div className="p-8 text-center text-[var(--text-secondary)]">
              {searchTerm
                ? "No drivers found matching your search."
                : "No available drivers found."}
            </div>
          ) : (
            <div className="divide-y divide-[var(--border-primary)]">
              {filteredDrivers.map((driver) => (
                <div
                  key={driver._id}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedDrivers.includes(driver._id)
                      ? "bg-blue-500/10 border-blue-500/20"
                      : "hover:bg-[var(--bg-secondary)]"
                  }`}
                  onClick={() => toggleDriverSelection(driver._id)}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedDrivers.includes(driver._id)}
                      onChange={() => toggleDriverSelection(driver._id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-[var(--border-primary)] rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-[var(--text-primary)]">
                            {getDriverDisplayName(driver)}
                          </p>
                          <p className="text-sm text-[var(--text-secondary)]">
                            {driver.user?.email}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDriverStatusColor(
                              driver.status
                            )}`}
                          >
                            {driver.status || "Unknown"}
                          </span>
                        </div>
                      </div>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-[var(--text-secondary)]">
                        <span>License: {driver.licenseNumber || "N/A"}</span>
                        <span>
                          Experience: {driver.experienceYears || 0} years
                        </span>
                        {driver.phoneNumber && (
                          <span>Phone: {driver.phoneNumber}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Assignment Summary */}
        {selectedDrivers.length > 0 && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-400 mb-2">
              Assignment Summary
            </h4>
            <div className="text-sm text-[var(--text-secondary)]">
              <p>
                Vehicle:{" "}
                <span className="font-medium text-[var(--text-primary)]">
                  {vehicle?.vehicleNo}
                </span>
              </p>
              <p>
                Selected Drivers:{" "}
                <span className="font-medium text-[var(--text-primary)]">
                  {selectedDrivers.length}
                </span>
              </p>
              <div className="mt-2">
                <p className="font-medium text-[var(--text-primary)] mb-1">
                  Drivers to assign:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  {selectedDrivers.map((driverId) => {
                    const driver = filteredDrivers.find(
                      (d) => d._id === driverId
                    );
                    return (
                      <li key={driverId}>{getDriverDisplayName(driver)}</li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-[var(--border-primary)]">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={assignmentLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAssignment}
            disabled={selectedDrivers.length === 0 || assignmentLoading}
          >
            {assignmentLoading
              ? "Assigning..."
              : `Assign ${selectedDrivers.length} Driver${
                  selectedDrivers.length !== 1 ? "s" : ""
                }`}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
