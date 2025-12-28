import React, { useState, useCallback, useLayoutEffect } from "react";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import TextArea from "../../../components/ui/TextArea";
import { FiMapPin, FiClock, FiTruck, FiNavigation } from "react-icons/fi";
import useTripProgress from "../hooks/useTripProgress";

const TRIP_STATUSES = [
  {
    value: "pending",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
    description: "Trip is scheduled but not started",
  },
  {
    value: "in-progress",
    label: "In Progress",
    color: "bg-blue-100 text-blue-800",
    description: "Trip is currently active",
  },
  {
    value: "delayed",
    label: "Delayed",
    color: "bg-orange-100 text-orange-800",
    description: "Trip is behind schedule",
  },
  {
    value: "at-waypoint",
    label: "At Waypoint",
    color: "bg-purple-100 text-purple-800",
    description: "Vehicle has reached a waypoint",
  },
  {
    value: "completed",
    label: "Completed",
    color: "bg-green-100 text-green-800",
    description: "Trip has been completed",
  },
];

/**
 * Form component for updating trip progress
 */
export default function ProgressUpdateForm({
  isOpen,
  onClose,
  trip,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    status: "",
    currentLocation: {
      name: "",
      latitude: "",
      longitude: "",
    },
    notes: "",
    estimatedArrival: "",
    delayReason: "",
    waypointReached: "",
    fuelLevel: "",
    odometerReading: "",
    weatherConditions: "",
    trafficConditions: "",
  });

  const { updateProgress, loading, validateStatusTransition } =
    useTripProgress();

  const resetForm = useCallback(() => {
    if (trip) {
      setFormData({
        status: trip.status || "pending",
        currentLocation: {
          name: "",
          latitude: "",
          longitude: "",
        },
        notes: "",
        estimatedArrival: "",
        delayReason: "",
        waypointReached: "",
        fuelLevel: "",
        odometerReading: "",
        weatherConditions: "",
        trafficConditions: "",
      });
    }
  }, [trip]);

  // Reset form when modal opens/closes or trip changes
  useLayoutEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.status || !formData.currentLocation.name) {
      return;
    }

    // Validate status transition
    if (!validateStatusTransition(trip.status, formData.status)) {
      return;
    }

    try {
      const progressData = {
        status: formData.status,
        currentLocation: {
          name: formData.currentLocation.name,
          coordinates:
            formData.currentLocation.latitude &&
            formData.currentLocation.longitude
              ? [
                  parseFloat(formData.currentLocation.longitude),
                  parseFloat(formData.currentLocation.latitude),
                ]
              : undefined,
        },
        notes: formData.notes,
        timestamp: new Date().toISOString(),
        metadata: {
          ...(formData.estimatedArrival && {
            estimatedArrival: formData.estimatedArrival,
          }),
          ...(formData.delayReason && { delayReason: formData.delayReason }),
          ...(formData.waypointReached && {
            waypointReached: formData.waypointReached,
          }),
          ...(formData.fuelLevel && {
            fuelLevel: parseFloat(formData.fuelLevel),
          }),
          ...(formData.odometerReading && {
            odometerReading: parseFloat(formData.odometerReading),
          }),
          ...(formData.weatherConditions && {
            weatherConditions: formData.weatherConditions,
          }),
          ...(formData.trafficConditions && {
            trafficConditions: formData.trafficConditions,
          }),
        },
      };

      await updateProgress(trip._id, progressData);
      onSuccess?.();
      onClose();
    } catch (error) {
      // Error handling is done in the hook
      console.error("Failed to update progress:", error);
    }
  };

  const handleInputChange = useCallback((field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  }, []);

  const getAvailableStatuses = () => {
    if (!trip) return TRIP_STATUSES;

    return TRIP_STATUSES.filter(
      (status) =>
        status.value === trip.status ||
        validateStatusTransition(trip.status, status.value)
    );
  };

  const getCurrentLocationFromGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handleInputChange(
            "currentLocation.latitude",
            position.coords.latitude.toString()
          );
          handleInputChange(
            "currentLocation.longitude",
            position.coords.longitude.toString()
          );
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  if (!trip) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Update Progress - ${trip.tripCode || "Trip"}`}
      size="large"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Trip Info Header */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                {trip.tripCode}
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {trip.route?.source?.name} → {trip.route?.destination?.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Current Status
              </p>
              <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  TRIP_STATUSES.find((s) => s.value === trip.status)?.color ||
                  "bg-gray-100 text-gray-800"
                }`}
              >
                {TRIP_STATUSES.find((s) => s.value === trip.status)?.label ||
                  trip.status}
              </span>
            </div>
          </div>
        </div>

        {/* Trip Status */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            Update Trip Status *
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleInputChange("status", e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600"
          >
            {getAvailableStatuses().map((status) => (
              <option key={status.value} value={status.value}>
                {status.label} - {status.description}
              </option>
            ))}
          </select>
        </div>

        {/* Current Location */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-[var(--text-secondary)]">
              <FiMapPin className="inline mr-1" />
              Current Location *
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={getCurrentLocationFromGeolocation}
              icon={<FiNavigation size={14} />}
            >
              Use GPS
            </Button>
          </div>

          <Input
            placeholder="Location name (e.g., Mumbai Highway Toll Plaza)"
            value={formData.currentLocation.name}
            onChange={(e) =>
              handleInputChange("currentLocation.name", e.target.value)
            }
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="number"
              step="any"
              placeholder="Latitude (19.0760)"
              value={formData.currentLocation.latitude}
              onChange={(e) =>
                handleInputChange("currentLocation.latitude", e.target.value)
              }
              label="Latitude (Optional)"
            />
            <Input
              type="number"
              step="any"
              placeholder="Longitude (72.8777)"
              value={formData.currentLocation.longitude}
              onChange={(e) =>
                handleInputChange("currentLocation.longitude", e.target.value)
              }
              label="Longitude (Optional)"
            />
          </div>
        </div>

        {/* Conditional Fields Based on Status */}
        {formData.status === "delayed" && (
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Delay Reason *
            </label>
            <Input
              placeholder="e.g., Heavy traffic, vehicle breakdown, weather conditions"
              value={formData.delayReason}
              onChange={(e) => handleInputChange("delayReason", e.target.value)}
              required
            />
          </div>
        )}

        {formData.status === "at-waypoint" && (
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Waypoint Reached *
            </label>
            <Input
              placeholder="Waypoint name or description"
              value={formData.waypointReached}
              onChange={(e) =>
                handleInputChange("waypointReached", e.target.value)
              }
              required
            />
          </div>
        )}

        {/* Vehicle Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              <FiTruck className="inline mr-1" />
              Fuel Level (%)
            </label>
            <Input
              type="number"
              min="0"
              max="100"
              placeholder="75"
              value={formData.fuelLevel}
              onChange={(e) => handleInputChange("fuelLevel", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Odometer Reading (km)
            </label>
            <Input
              type="number"
              placeholder="125000"
              value={formData.odometerReading}
              onChange={(e) =>
                handleInputChange("odometerReading", e.target.value)
              }
            />
          </div>
        </div>

        {/* Conditions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Weather Conditions
            </label>
            <select
              value={formData.weatherConditions}
              onChange={(e) =>
                handleInputChange("weatherConditions", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600"
            >
              <option value="">Select weather</option>
              <option value="clear">Clear</option>
              <option value="cloudy">Cloudy</option>
              <option value="rainy">Rainy</option>
              <option value="foggy">Foggy</option>
              <option value="stormy">Stormy</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Traffic Conditions
            </label>
            <select
              value={formData.trafficConditions}
              onChange={(e) =>
                handleInputChange("trafficConditions", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600"
            >
              <option value="">Select traffic</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="heavy">Heavy</option>
              <option value="standstill">Standstill</option>
            </select>
          </div>
        </div>

        {/* Estimated Arrival */}
        {["in-progress", "delayed", "at-waypoint"].includes(
          formData.status
        ) && (
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              <FiClock className="inline mr-1" />
              Updated Estimated Arrival
            </label>
            <Input
              type="datetime-local"
              value={formData.estimatedArrival}
              onChange={(e) =>
                handleInputChange("estimatedArrival", e.target.value)
              }
            />
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            Additional Notes
          </label>
          <TextArea
            placeholder="Any additional information about the trip progress, road conditions, or other relevant details..."
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            rows={3}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={loading}>
            Update Progress
          </Button>
        </div>
      </form>
    </Modal>
  );
}
