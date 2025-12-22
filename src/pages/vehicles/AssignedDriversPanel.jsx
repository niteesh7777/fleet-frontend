import React, { useState, useEffect, useCallback } from "react";
import Button from "../../components/ui/Button";
import AssignmentStatusBadge from "./AssignmentStatusBadge";
import useVehicleDriverAssignment from "./hooks/useVehicleDriverAssignment";

/**
 * Panel showing currently assigned drivers for a vehicle
 */
export default function AssignedDriversPanel({
  vehicle,
  onDriverRemove,
  onAssignDriver,
  showActions = true,
}) {
  const [vehicleDetails, setVehicleDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const {
    removeDriver,
    getVehicleWithDrivers,
    loading: actionLoading,
  } = useVehicleDriverAssignment();

  // Load detailed vehicle data with populated drivers
  useEffect(() => {
    if (vehicle?._id) {
      loadVehicleDetails();
    }
  }, [vehicle]);

  const loadVehicleDetails = useCallback(async () => {
    if (!vehicle?._id) return;

    setLoadingDetails(true);
    try {
      const details = await getVehicleWithDrivers(vehicle._id);
      setVehicleDetails(details);
    } catch (error) {
      console.error("Failed to load vehicle details:", error);
      // Fallback to basic vehicle data
      setVehicleDetails(vehicle);
    } finally {
      setLoadingDetails(false);
    }
  }, [getVehicleWithDrivers, vehicle]);

  // Handle driver removal
  const handleRemoveDriver = async (driverId, driverName) => {
    if (
      !window.confirm(
        `Are you sure you want to remove ${driverName} from ${vehicle.vehicleNo}?`
      )
    ) {
      return;
    }

    try {
      await removeDriver(vehicle._id, driverId, {
        vehicleNo: vehicle.vehicleNo,
        driverName,
      });

      // Refresh vehicle details
      await loadVehicleDetails();

      // Notify parent component
      if (onDriverRemove) {
        onDriverRemove(driverId);
      }
    } catch (error) {
      // Error handling is done in the hook
      console.error("Failed to remove driver:", error);
    }
  };

  const getDriverDisplayName = (driver) => {
    if (!driver) return "Unknown Driver";

    // Handle populated driver object
    if (driver.user) {
      const firstName = driver.user.firstName || "";
      const lastName = driver.user.lastName || "";
      return `${firstName} ${lastName}`.trim() || "Unknown Driver";
    }

    // Handle basic driver object
    const firstName = driver.firstName || "";
    const lastName = driver.lastName || "";
    return `${firstName} ${lastName}`.trim() || "Unknown Driver";
  };

  const getDriverEmail = (driver) => {
    return driver?.user?.email || driver?.email || "No email";
  };

  const getDriverPhone = (driver) => {
    return driver?.phoneNumber || driver?.user?.phoneNumber || "No phone";
  };

  const getDriverStatus = (driver) => {
    return driver?.status || "unknown";
  };

  // Get drivers from detailed data or fallback to basic data
  const assignedDrivers =
    vehicleDetails?.assignedDrivers ||
    vehicleDetails?.drivers ||
    vehicle?.assignedDrivers ||
    [];

  return (
    <div className="bg-[var(--bg-elevated)] rounded-lg border border-[var(--border-primary)] p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Assigned Drivers
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            {vehicle?.vehicleNo} - {assignedDrivers.length} driver
            {assignedDrivers.length !== 1 ? "s" : ""} assigned
          </p>
        </div>

        {showActions && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadVehicleDetails}
              disabled={loadingDetails}
            >
              {loadingDetails ? "Loading..." : "Refresh"}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onAssignDriver}
              disabled={actionLoading}
            >
              Assign Driver
            </Button>
          </div>
        )}
      </div>

      {/* Vehicle Status Overview */}
      <div className="mb-6 p-4 bg-[var(--bg-secondary)] rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="text-sm font-medium text-[var(--text-secondary)]">
              Vehicle Status
            </span>
            <div className="mt-1">
              <AssignmentStatusBadge status={vehicle?.status || "available"} />
            </div>
          </div>
          <div>
            <span className="text-sm font-medium text-[var(--text-secondary)]">
              Capacity
            </span>
            <p className="mt-1 text-lg font-semibold text-[var(--text-primary)]">
              {vehicle?.capacity || "N/A"} passengers
            </p>
          </div>
          <div>
            <span className="text-sm font-medium text-[var(--text-secondary)]">
              Current Assignments
            </span>
            <p className="mt-1 text-lg font-semibold text-[var(--text-primary)]">
              {assignedDrivers.length} / {vehicle?.maxDrivers || "∞"}
            </p>
          </div>
        </div>
      </div>

      {/* Drivers List */}
      {loadingDetails ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
          <span className="text-[var(--text-secondary)]">
            Loading driver details...
          </span>
        </div>
      ) : assignedDrivers.length === 0 ? (
        <div className="text-center py-8">
          <svg
            className="mx-auto h-12 w-12 text-[var(--text-tertiary)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-[var(--text-primary)]">
            No drivers assigned
          </h3>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Get started by assigning a driver to this vehicle.
          </p>
          {showActions && (
            <div className="mt-6">
              <Button variant="primary" onClick={onAssignDriver}>
                Assign First Driver
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {assignedDrivers.map((driver, index) => (
            <div
              key={driver._id || driver.id || index}
              className="flex items-center justify-between p-4 border border-[var(--border-primary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
            >
              <div className="flex items-center space-x-4">
                {/* Driver Avatar */}
                <div className="shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {getDriverDisplayName(driver).charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Driver Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {getDriverDisplayName(driver)}
                    </p>
                    <AssignmentStatusBadge
                      status={getDriverStatus(driver)}
                      size="sm"
                    />
                  </div>
                  <div className="mt-1 flex items-center space-x-4 text-sm text-[var(--text-secondary)]">
                    <span>{getDriverEmail(driver)}</span>
                    <span>•</span>
                    <span>{getDriverPhone(driver)}</span>
                    {driver.licenseNumber && (
                      <>
                        <span>•</span>
                        <span>License: {driver.licenseNumber}</span>
                      </>
                    )}
                  </div>
                  {driver.experienceYears && (
                    <div className="mt-1 text-sm text-[var(--text-secondary)]">
                      Experience: {driver.experienceYears} years
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              {showActions && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Could open driver profile modal
                      console.log("View driver profile:", driver);
                    }}
                  >
                    View
                  </Button>
                  <Button
                    variant="danger-outline"
                    size="sm"
                    onClick={() =>
                      handleRemoveDriver(
                        driver._id || driver.id,
                        getDriverDisplayName(driver)
                      )
                    }
                    disabled={actionLoading}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Assignment Statistics */}
      {assignedDrivers.length > 0 && (
        <div className="mt-6 pt-4 border-t border-[var(--border-primary)]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-semibold text-green-600">
                {
                  assignedDrivers.filter(
                    (d) => getDriverStatus(d) === "available"
                  ).length
                }
              </p>
              <p className="text-sm text-[var(--text-secondary)]">Available</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-blue-600">
                {
                  assignedDrivers.filter(
                    (d) => getDriverStatus(d) === "on-duty"
                  ).length
                }
              </p>
              <p className="text-sm text-[var(--text-secondary)]">On Duty</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-[var(--text-tertiary)]">
                {
                  assignedDrivers.filter(
                    (d) => getDriverStatus(d) === "off-duty"
                  ).length
                }
              </p>
              <p className="text-sm text-[var(--text-secondary)]">Off Duty</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-red-600">
                {
                  assignedDrivers.filter((d) =>
                    ["suspended", "inactive"].includes(getDriverStatus(d))
                  ).length
                }
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                Unavailable
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
