import { useState, useEffect } from "react";
import Modal from "./ui/Modal";
import Button from "./ui/Button";
import RouteMapCreator from "./RouteMapCreator";
import { FiMap, FiChevronRight } from "react-icons/fi";
import Card from "./ui/Card";
import Input from "./ui/Input";
import toast from "react-hot-toast";
import { validateRoute, VEHICLE_TYPES } from "../utils/routeValidation";
import { useAuthStore } from "../store/authStore";

/**
 * Route Map Modal - Full modal for creating routes with map interface
 */
export default function RouteMapModal({ isOpen, onClose, onSubmit }) {
  // Don't use selectors for auth state - read directly from store when needed
  const [step, setStep] = useState("map"); // 'map' or 'details'
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [waypoints, setWaypoints] = useState([]);
  const [storeReady, setStoreReady] = useState(false);

  // Details step state
  const [routeDetails, setRouteDetails] = useState({
    name: "",
    distanceKm: "",
    estimatedDurationHr: "",
  });
  const [tolls, setTolls] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Wait for Zustand store to hydrate from localStorage
  useEffect(() => {
    // Subscribe to store to know when it's ready
    const unsubscribe = useAuthStore.subscribe(
      (state) => state.user,
      () => {
        console.log("[RouteMapModal] Store updated");
        setStoreReady(true);
      },
      { equalityFn: (a, b) => a === b } // Trigger on any change
    );

    // Also check immediately
    const state = useAuthStore.getState();
    if (state.user || state.token) {
      setStoreReady(true);
    }

    return unsubscribe;
  }, []);

  const handleSourceSelect = (loc) => {
    setSource(loc);
  };

  const handleDestinationSelect = (loc) => {
    setDestination(loc);
  };

  const handleWaypointsUpdate = (wps) => {
    setWaypoints(wps);
  };

  const canProceedToDetails = () => {
    if (!source) {
      toast.error("Please select a source location");
      return false;
    }
    if (!destination) {
      toast.error("Please select a destination location");
      return false;
    }
    return true;
  };

  const handleDetailsChange = (field, value) => {
    setRouteDetails({ ...routeDetails, [field]: value });
  };

  const addToll = () => {
    setTolls([...tolls, { name: "", cost: 0 }]);
  };

  const removeToll = (index) => {
    setTolls(tolls.filter((_, i) => i !== index));
  };

  const updateToll = (index, field, value) => {
    const updated = [...tolls];
    updated[index][field] = value;
    setTolls(updated);
  };

  const toggleVehicleType = (type) => {
    if (vehicleTypes.includes(type)) {
      setVehicleTypes(vehicleTypes.filter((t) => t !== type));
    } else {
      setVehicleTypes([...vehicleTypes, type]);
    }
  };

  const handleSubmitRoute = async (e) => {
    e.preventDefault();

    if (!storeReady) {
      toast.error("Please wait for the app to fully load...");
      return;
    }

    // Get user ID from store - required for createdBy field
    const state = useAuthStore.getState();
    const userId = state.user?.id || state.user?._id; // Support both id and _id

    console.log(
      "[RouteMapModal] Submitting route. User ID:",
      userId,
      "Full state:",
      state
    );

    if (!userId) {
      toast.error("Unable to get user ID. Please refresh and log in again.");
      return;
    }

    // Validate
    const routeData = {
      name: routeDetails.name,
      source,
      destination,
      distanceKm: routeDetails.distanceKm,
      estimatedDurationHr: routeDetails.estimatedDurationHr,
      waypoints,
      tolls,
      preferredVehicleTypes: vehicleTypes,
      createdBy: userId,
    };

    const errors = validateRoute(routeData);
    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(routeData);

      // Reset form
      setStep("map");
      setSource(null);
      setDestination(null);
      setWaypoints([]);
      setRouteDetails({ name: "", distanceKm: "", estimatedDurationHr: "" });
      setTolls([]);
      setVehicleTypes([]);
      onClose();
    } catch (err) {
      console.error("Error creating route:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} fullScreen={true}>
      <div className="h-full flex flex-col bg-[var(--bg-primary)]">
        {/* Header */}
        <div className="border-b border-[var(--border-primary)] p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FiMap size={24} className="text-blue-600" />
              <div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                  Create Route
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  {step === "map"
                    ? "Step 1: Select locations on the map"
                    : "Step 2: Enter route details"}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-[var(--text-secondary)]"
            >
              ✕
            </Button>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-4 mt-4">
            <div
              className={`h-2 flex-1 rounded ${
                step === "map" ? "bg-blue-600" : "bg-green-600"
              }`}
            />
            <span className="text-xs font-semibold text-[var(--text-secondary)]">
              {step === "map" ? "1 of 2" : "2 of 2"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {step === "map" ? (
            <div className="h-full p-6">
              <RouteMapCreator
                onSourceSelect={handleSourceSelect}
                onDestinationSelect={handleDestinationSelect}
                onWaypointsUpdate={handleWaypointsUpdate}
                initialSource={source}
                initialDestination={destination}
                initialWaypoints={waypoints}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 h-full overflow-y-auto p-6">
              {/* Left - Route Details */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                  Route Details
                </h3>

                {/* Selected Locations Summary */}
                <Card className="mb-6 p-4 border-2 border-blue-500/30 bg-blue-500/5">
                  <p className="text-xs font-semibold text-blue-600 mb-3">
                    SELECTED LOCATIONS
                  </p>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-semibold text-green-600">
                        Source:
                      </span>{" "}
                      {source?.name}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {source?.lat.toFixed(4)}, {source?.lng.toFixed(4)}
                    </p>
                    <p className="mt-3">
                      <span className="font-semibold text-red-600">
                        Destination:
                      </span>{" "}
                      {destination?.name}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {destination?.lat.toFixed(4)},{" "}
                      {destination?.lng.toFixed(4)}
                    </p>
                    {waypoints.length > 0 && (
                      <div className="mt-3">
                        <p>
                          <span className="font-semibold text-orange-600">
                            Waypoints:
                          </span>{" "}
                          {waypoints.length}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Basic Info */}
                <form onSubmit={handleSubmitRoute} className="space-y-4">
                  <Input
                    type="text"
                    label="Route Name (Auto-generated if empty)"
                    value={routeDetails.name}
                    onChange={(e) =>
                      handleDetailsChange("name", e.target.value)
                    }
                    placeholder="e.g., Mumbai to Bangalore"
                  />

                  <Input
                    type="number"
                    label="Distance (km)"
                    value={routeDetails.distanceKm}
                    onChange={(e) =>
                      handleDetailsChange("distanceKm", e.target.value)
                    }
                    placeholder="Enter distance"
                    step="0.1"
                    min="1"
                    required
                  />

                  <Input
                    type="number"
                    label="Estimated Duration (hours)"
                    value={routeDetails.estimatedDurationHr}
                    onChange={(e) =>
                      handleDetailsChange("estimatedDurationHr", e.target.value)
                    }
                    placeholder="Enter duration"
                    step="0.1"
                    min="0.1"
                    required
                  />

                  {/* Tolls */}
                  <div className="border-t border-[var(--border-primary)] pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-[var(--text-primary)]">
                        Tolls
                      </p>
                      <Button variant="outline" size="sm" onClick={addToll}>
                        Add Toll
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {tolls.map((toll, idx) => (
                        <div key={idx} className="flex gap-2">
                          <Input
                            type="text"
                            value={toll.name}
                            onChange={(e) =>
                              updateToll(idx, "name", e.target.value)
                            }
                            placeholder="Toll name"
                            className="flex-1"
                          />
                          <Input
                            type="number"
                            value={toll.cost}
                            onChange={(e) =>
                              updateToll(idx, "cost", e.target.value)
                            }
                            placeholder="Cost"
                            className="w-24"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeToll(idx)}
                          >
                            ✕
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-6 border-t border-[var(--border-primary)]">
                    <Button
                      variant="outline"
                      onClick={() => setStep("map")}
                      className="flex-1"
                    >
                      ← Back to Map
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      className="flex-1"
                      disabled={submitting}
                    >
                      {submitting ? "Creating..." : "Create Route"}
                    </Button>
                  </div>
                </form>
              </div>

              {/* Right - Vehicle Types */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
                  Preferred Vehicle Types
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  {VEHICLE_TYPES.map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-3 p-3 rounded border border-[var(--border-primary)] cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={vehicleTypes.includes(type)}
                        onChange={() => toggleVehicleType(type)}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span className="text-sm text-[var(--text-primary)]">
                        {type}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Info */}
                <Card className="mt-6 p-4 bg-blue-500/5 border border-blue-500/30">
                  <p className="text-sm text-blue-600 font-semibold mb-2">
                    💡 Tips
                  </p>
                  <ul className="text-xs text-[var(--text-secondary)] space-y-2">
                    <li>✓ Select vehicle types suitable for this route</li>
                    <li>✓ Consider load capacity and road conditions</li>
                    <li>✓ Leave empty to allow any vehicle type</li>
                  </ul>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === "map" && (
          <div className="border-t border-[var(--border-primary)] p-6 flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (canProceedToDetails()) {
                  setStep("details");
                }
              }}
            >
              Next Step <FiChevronRight size={16} className="ml-2" />
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
