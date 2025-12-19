import { useState, useCallback } from "react";
import api from "../../../api/axiosClient";
import {
  showSuccess,
  showError,
  showApiError,
  showLoading,
  dismissToast,
} from "../../../utils/toast";

/**
 * Hook for managing vehicle-driver assignments
 */
export default function useVehicleDriverAssignment() {
  const [loading, setLoading] = useState(false);
  const [assignmentHistory, setAssignmentHistory] = useState([]);

  // Assign driver to vehicle
  const assignDriver = useCallback(
    async (vehicleId, driverId, vehicleData = null) => {
      let loadingToast;
      try {
        setLoading(true);
        loadingToast = showLoading("Assigning driver to vehicle...");

        await api.post(`/vehicles/${vehicleId}/assign-driver/${driverId}`);

        dismissToast(loadingToast);

        // Get driver and vehicle names for better UX if data is provided
        const vehicleName = vehicleData?.vehicleNo || "vehicle";
        const driverName = vehicleData?.driverName || "driver";

        showSuccess(`Successfully assigned ${driverName} to ${vehicleName}`);

        return true;
      } catch (error) {
        if (loadingToast) dismissToast(loadingToast);

        // Enhanced error handling for common assignment scenarios
        if (error.response?.status === 400) {
          const message = error.response.data?.message || "";

          if (message.includes("already assigned")) {
            showError("Driver is already assigned to this vehicle");
          } else if (message.includes("not available")) {
            showError("Driver is not available for assignment");
          } else if (message.includes("vehicle not found")) {
            showError("Vehicle not found");
          } else if (message.includes("driver not found")) {
            showError("Driver not found");
          } else {
            showApiError(error, "Failed to assign driver to vehicle");
          }
        } else {
          showApiError(error, "Failed to assign driver to vehicle");
        }

        console.error("Driver assignment error:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Remove driver from vehicle
  const removeDriver = useCallback(
    async (vehicleId, driverId, vehicleData = null) => {
      let loadingToast;
      try {
        setLoading(true);
        loadingToast = showLoading("Removing driver assignment...");

        // Note: This endpoint might need to be implemented on backend
        await api.delete(`/vehicles/${vehicleId}/remove-driver/${driverId}`);

        dismissToast(loadingToast);

        const vehicleName = vehicleData?.vehicleNo || "vehicle";
        const driverName = vehicleData?.driverName || "driver";

        showSuccess(`Successfully removed ${driverName} from ${vehicleName}`);

        return true;
      } catch (error) {
        if (loadingToast) dismissToast(loadingToast);
        showApiError(error, "Failed to remove driver assignment");
        console.error("Driver removal error:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Get available drivers for assignment
  const getAvailableDrivers = useCallback(async (excludeAssigned = true) => {
    try {
      const response = await api.get("/drivers", {
        params: {
          status: "active",
          available: excludeAssigned ? "true" : undefined,
        },
      });

      return response.data?.data?.drivers || [];
    } catch (error) {
      showApiError(error, "Failed to load available drivers");
      console.error("Available drivers error:", error);
      return [];
    }
  }, []);

  // Get vehicle details with assigned drivers
  const getVehicleWithDrivers = useCallback(async (vehicleId) => {
    try {
      const response = await api.get(`/vehicles/${vehicleId}`, {
        params: {
          populate: "assignedDrivers", // Populate driver details
        },
      });

      return response.data?.data?.vehicle || null;
    } catch (error) {
      showApiError(error, "Failed to load vehicle details");
      console.error("Vehicle details error:", error);
      return null;
    }
  }, []);

  // Get assignment history for a vehicle
  const getAssignmentHistory = useCallback(async (vehicleId) => {
    try {
      // Note: This endpoint might need to be implemented on backend
      const response = await api.get(
        `/vehicles/${vehicleId}/assignment-history`
      );

      const history = response.data?.data?.history || [];
      setAssignmentHistory(history);
      return history;
    } catch (error) {
      // Don't show error toast for optional feature
      console.error("Assignment history error:", error);
      setAssignmentHistory([]);
      return [];
    }
  }, []);

  // Bulk assign multiple drivers to vehicle
  const bulkAssignDrivers = useCallback(
    async (vehicleId, driverIds, vehicleData = null) => {
      let loadingToast;
      try {
        setLoading(true);
        loadingToast = showLoading(`Assigning ${driverIds.length} drivers...`);

        const promises = driverIds.map((driverId) =>
          api.post(`/vehicles/${vehicleId}/assign-driver/${driverId}`)
        );

        const results = await Promise.allSettled(promises);

        dismissToast(loadingToast);

        const successful = results.filter(
          (result) => result.status === "fulfilled"
        ).length;
        const failed = results.length - successful;

        if (failed === 0) {
          const vehicleName = vehicleData?.vehicleNo || "vehicle";
          showSuccess(
            `Successfully assigned ${successful} drivers to ${vehicleName}`
          );
        } else if (successful > 0) {
          showError(
            `Assigned ${successful} drivers, ${failed} assignments failed`
          );
        } else {
          showError("All driver assignments failed");
        }

        return { successful, failed, total: results.length };
      } catch (error) {
        if (loadingToast) dismissToast(loadingToast);
        showApiError(error, "Failed to assign drivers");
        console.error("Bulk assignment error:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Check if driver is available for assignment
  const checkDriverAvailability = useCallback(async (driverId) => {
    try {
      const response = await api.get(`/drivers/${driverId}/availability`);
      return response.data?.data?.available || false;
    } catch (error) {
      console.error("Driver availability check error:", error);
      return false;
    }
  }, []);

  return {
    // State
    loading,
    assignmentHistory,

    // Assignment operations
    assignDriver,
    removeDriver,
    bulkAssignDrivers,

    // Data fetching
    getAvailableDrivers,
    getVehicleWithDrivers,
    getAssignmentHistory,
    checkDriverAvailability,
  };
}
