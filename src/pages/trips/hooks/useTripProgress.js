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
 * Hook for managing trip progress updates and completion
 */
export default function useTripProgress() {
  const [loading, setLoading] = useState(false);
  const [progressHistory, setProgressHistory] = useState([]);

  // Update trip progress
  const updateProgress = useCallback(async (tripId, progressData) => {
    let loadingToast;
    try {
      setLoading(true);
      loadingToast = showLoading("Updating trip progress...");

      const response = await api.post(
        `/trips/${tripId}/progress`,
        progressData
      );

      dismissToast(loadingToast);
      showSuccess("Trip progress updated successfully!");

      return response.data.data;
    } catch (error) {
      if (loadingToast) dismissToast(loadingToast);

      // Enhanced error handling for progress updates
      if (error.response?.status === 400) {
        const message = error.response.data?.message || "";

        if (message.includes("invalid status")) {
          showError("Invalid trip status transition");
        } else if (message.includes("trip not found")) {
          showError("Trip not found");
        } else if (message.includes("already completed")) {
          showError("Cannot update progress for completed trip");
        } else {
          showApiError(error, "Failed to update trip progress");
        }
      } else {
        showApiError(error, "Failed to update trip progress");
      }

      console.error("Progress update error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Complete trip
  const completeTrip = useCallback(async (tripId, completionData) => {
    let loadingToast;
    try {
      setLoading(true);
      loadingToast = showLoading("Completing trip...");

      const response = await api.post(
        `/trips/${tripId}/complete`,
        completionData
      );

      dismissToast(loadingToast);
      showSuccess("Trip completed successfully!");

      return response.data.data;
    } catch (error) {
      if (loadingToast) dismissToast(loadingToast);

      // Enhanced error handling for trip completion
      if (error.response?.status === 400) {
        const message = error.response.data?.message || "";

        if (message.includes("not in progress")) {
          showError("Only trips in progress can be completed");
        } else if (message.includes("missing required")) {
          showError("Please fill all required completion fields");
        } else {
          showApiError(error, "Failed to complete trip");
        }
      } else {
        showApiError(error, "Failed to complete trip");
      }

      console.error("Trip completion error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get trip progress history
  const getTripProgress = useCallback(async (tripId) => {
    try {
      const response = await api.get(`/trips/${tripId}/progress`);
      const history = response.data.data?.progressUpdates || [];
      setProgressHistory(history);
      return history;
    } catch (error) {
      console.error("Failed to load progress history:", error);
      // Don't show error toast for optional feature
      setProgressHistory([]);
      return [];
    }
  }, []);

  // Get trip details with progress
  const getTripWithProgress = useCallback(async (tripId) => {
    try {
      const response = await api.get(`/trips/${tripId}`, {
        params: {
          includeProgress: true,
        },
      });

      return response.data.data.trip;
    } catch (error) {
      showApiError(error, "Failed to load trip details");
      throw error;
    }
  }, []);

  // Validate status transition
  const validateStatusTransition = useCallback((currentStatus, newStatus) => {
    const validTransitions = {
      pending: ["in-progress", "cancelled"],
      "in-progress": ["delayed", "at-waypoint", "completed", "cancelled"],
      delayed: ["in-progress", "at-waypoint", "completed", "cancelled"],
      "at-waypoint": ["in-progress", "delayed", "completed"],
      completed: [], // No transitions from completed
      cancelled: [], // No transitions from cancelled
    };

    return validTransitions[currentStatus]?.includes(newStatus) || false;
  }, []);

  return {
    // State
    loading,
    progressHistory,

    // Progress operations
    updateProgress,
    completeTrip,
    getTripProgress,
    getTripWithProgress,

    // Utilities
    validateStatusTransition,
  };
}
