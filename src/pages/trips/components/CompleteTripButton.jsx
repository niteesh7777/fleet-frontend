import React, { useState } from "react";
import Button from "../../../components/ui/Button";
import Modal from "../../../components/ui/Modal";
import Input from "../../../components/ui/Input";
import TextArea from "../../../components/ui/TextArea";
import {
  FiCheck,
  FiPackage,
  FiTruck,
  FiDollarSign,
  FiFileText,
} from "react-icons/fi";
import useTripProgress from "../hooks/useTripProgress";

/**
 * Component for completing a trip with required completion data
 */
export default function CompleteTripButton({
  trip,
  onSuccess,
  className = "",
  variant = "primary",
}) {
  const [showModal, setShowModal] = useState(false);
  const [completionData, setCompletionData] = useState({
    actualArrivalTime: "",
    finalOdometerReading: "",
    fuelConsumed: "",
    deliveryNotes: "",
    customerSignature: "",
    damageReport: "",
    totalExpenses: "",
    deliveryProof: "",
    customerRating: "",
  });

  const { completeTrip, loading } = useTripProgress();

  const handleComplete = async () => {
    try {
      const payload = {
        completedAt: new Date().toISOString(),
        actualArrivalTime:
          completionData.actualArrivalTime || new Date().toISOString(),
        finalMetrics: {
          odometerReading: parseFloat(completionData.finalOdometerReading) || 0,
          fuelConsumed: parseFloat(completionData.fuelConsumed) || 0,
          totalExpenses: parseFloat(completionData.totalExpenses) || 0,
        },
        deliveryDetails: {
          notes: completionData.deliveryNotes,
          customerSignature: completionData.customerSignature,
          deliveryProof: completionData.deliveryProof,
          customerRating: parseInt(completionData.customerRating) || null,
        },
        damageReport: completionData.damageReport,
        status: "completed",
      };

      await completeTrip(trip._id, payload);
      setShowModal(false);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to complete trip:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setCompletionData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setCompletionData({
      actualArrivalTime: "",
      finalOdometerReading: "",
      fuelConsumed: "",
      deliveryNotes: "",
      customerSignature: "",
      damageReport: "",
      totalExpenses: "",
      deliveryProof: "",
      customerRating: "",
    });
  };

  // Don't show button if trip is already completed or cancelled
  if (["completed", "cancelled"].includes(trip?.status)) {
    return (
      <div
        className={`flex items-center gap-2 ${
          trip.status === "completed" ? "text-green-600" : "text-red-600"
        } ${className}`}
      >
        <FiCheck className="w-5 h-5" />
        <span className="font-medium capitalize">Trip {trip.status}</span>
      </div>
    );
  }

  // Only show for trips that can be completed
  if (!["in-progress", "delayed", "at-waypoint"].includes(trip?.status)) {
    return (
      <Button
        disabled
        className={className}
        title="Trip must be in progress to complete"
      >
        Complete Trip
      </Button>
    );
  }

  return (
    <>
      <Button
        onClick={() => {
          setShowModal(true);
          resetForm();
        }}
        className={`bg-green-600 hover:bg-green-700 text-white ${className}`}
        variant={variant}
        icon={<FiCheck size={18} />}
      >
        Complete Trip
      </Button>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`Complete Trip - ${trip?.tripCode || "Trip"}`}
        size="large"
      >
        <div className="space-y-6">
          {/* Header Info */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <FiPackage className="w-6 h-6 text-green-600" />
              <div>
                <h4 className="font-semibold text-green-900 dark:text-green-100">
                  Trip Completion - {trip?.tripCode}
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {trip?.route?.source?.name} → {trip?.route?.destination?.name}
                </p>
              </div>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300">
              Please provide the following information to complete the trip and
              update all records.
            </p>
          </div>

          {/* Completion Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Arrival Time */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Actual Arrival Time
              </label>
              <Input
                type="datetime-local"
                value={completionData.actualArrivalTime}
                onChange={(e) =>
                  handleInputChange("actualArrivalTime", e.target.value)
                }
                placeholder="When did you arrive at destination?"
              />
            </div>

            {/* Vehicle Metrics */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                <FiTruck className="inline mr-1" />
                Final Odometer Reading (km) *
              </label>
              <Input
                type="number"
                placeholder="125500"
                value={completionData.finalOdometerReading}
                onChange={(e) =>
                  handleInputChange("finalOdometerReading", e.target.value)
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Fuel Consumed (Liters)
              </label>
              <Input
                type="number"
                step="0.1"
                placeholder="45.5"
                value={completionData.fuelConsumed}
                onChange={(e) =>
                  handleInputChange("fuelConsumed", e.target.value)
                }
              />
            </div>

            {/* Financial */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                <FiDollarSign className="inline mr-1" />
                Total Trip Expenses (₹)
              </label>
              <Input
                type="number"
                step="0.01"
                placeholder="2500.00"
                value={completionData.totalExpenses}
                onChange={(e) =>
                  handleInputChange("totalExpenses", e.target.value)
                }
              />
            </div>

            {/* Customer Rating */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Customer Rating (1-5)
              </label>
              <select
                value={completionData.customerRating}
                onChange={(e) =>
                  handleInputChange("customerRating", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 dark:border-gray-600"
              >
                <option value="">Select rating</option>
                <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                <option value="4">⭐⭐⭐⭐ Good</option>
                <option value="3">⭐⭐⭐ Average</option>
                <option value="2">⭐⭐ Poor</option>
                <option value="1">⭐ Very Poor</option>
              </select>
            </div>
          </div>

          {/* Customer Details */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Customer Signature/Confirmation *
              </label>
              <Input
                placeholder="Customer name or signature confirmation"
                value={completionData.customerSignature}
                onChange={(e) =>
                  handleInputChange("customerSignature", e.target.value)
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Delivery Proof (Reference/Receipt Number)
              </label>
              <Input
                placeholder="e.g., Receipt #12345, Photo reference, etc."
                value={completionData.deliveryProof}
                onChange={(e) =>
                  handleInputChange("deliveryProof", e.target.value)
                }
              />
            </div>
          </div>

          {/* Notes and Reports */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                <FiFileText className="inline mr-1" />
                Delivery Notes *
              </label>
              <TextArea
                placeholder="Delivery completed successfully. Customer satisfied with service. All items delivered in good condition..."
                value={completionData.deliveryNotes}
                onChange={(e) =>
                  handleInputChange("deliveryNotes", e.target.value)
                }
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Damage/Issue Report (if any)
              </label>
              <TextArea
                placeholder="Report any damages to vehicle, cargo, or issues encountered during the trip. Leave blank if no issues."
                value={completionData.damageReport}
                onChange={(e) =>
                  handleInputChange("damageReport", e.target.value)
                }
                rows={2}
              />
            </div>
          </div>

          {/* Completion Summary */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Completion Summary
            </h5>
            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <p>• Trip will be marked as completed</p>
              <p>• Vehicle will be available for new assignments</p>
              <p>• Driver will receive completion notification</p>
              <p>• Customer will be notified of delivery completion</p>
              <p>• All metrics will be recorded for reporting</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={() => setShowModal(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleComplete}
              isLoading={loading}
              className="bg-green-600 hover:bg-green-700 text-white"
              icon={<FiCheck size={16} />}
            >
              Complete Trip
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
