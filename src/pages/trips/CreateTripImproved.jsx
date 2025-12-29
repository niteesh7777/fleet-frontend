import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiLoader,
  FiSave,
  FiAlertCircle,
  FiCheck,
  FiInfo,
} from "react-icons/fi";
import toast from "react-hot-toast";
import TripDetailsSection from "./create/TripDetailsSection";
import RoutePreview from "./create/RoutePreview";
import PricingSummary from "./create/PricingSummary";
import AssignmentPanel from "./create/AssignmentPanel";
import useAvailableResources from "./hooks/useAvailableResources";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { tripApi, routeApi } from "../../api/endpoints";

const DEFAULT_RATE = 25;
const DRAFT_STORAGE_KEY = "tripDraft";

const generateTripCode = () => {
  const prefix = "TRP";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substr(2, 3).toUpperCase();
  return `${prefix}_${timestamp}_${random}`;
};

const haversineDistanceKm = (source, destination) => {
  if (!source || !destination) return 0;
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(destination.lat - source.lat);
  const dLon = toRad(destination.lng - source.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(source.lat)) *
      Math.cos(toRad(destination.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function CreateTrip() {
  const navigate = useNavigate();
  const { drivers, vehicles, clients, loading } = useAvailableResources(true);

  // Multi-step wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [form, setForm] = useState(() => {
    // Load draft on mount
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        toast.success("Draft loaded", { duration: 2000 });
        return parsed;
      } catch {
        return {
          source: null,
          destination: null,
          clientId: "",
          goodsType: "",
          quantity: "",
          startTime: "",
          notes: "",
          ratePerKm: DEFAULT_RATE,
          driverId: "",
          vehicleId: "",
        };
      }
    }
    return {
      source: null,
      destination: null,
      clientId: "",
      goodsType: "",
      quantity: "",
      startTime: "",
      notes: "",
      ratePerKm: DEFAULT_RATE,
      driverId: "",
      vehicleId: "",
    };
  });

  const [assignmentMode, setAssignmentMode] = useState("auto");
  const [routeState, setRouteState] = useState({
    distanceKm: 0,
    durationMin: 0,
    geometry: [],
    calculating: false,
    error: null,
    usedFallback: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (form.source || form.destination || form.clientId) {
        saveDraft(true);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [form]);

  const saveDraft = (silent = false) => {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(form));
    if (!silent) {
      toast.success("Draft saved", { duration: 2000 });
    }
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  };

  const availableDrivers = useMemo(
    () => drivers.filter((driver) => driver.status !== "on-trip"),
    [drivers]
  );

  const availableVehicles = useMemo(
    () => vehicles.filter((vehicle) => vehicle.status === "available"),
    [vehicles]
  );

  const suggestedDriver = useMemo(() => {
    if (!availableDrivers.length) return null;
    return (
      availableDrivers.find((driver) => driver.status === "active") ||
      availableDrivers[0]
    );
  }, [availableDrivers]);

  const requiredWeight = useMemo(
    () => Number(form.quantity) || 0,
    [form.quantity]
  );

  const suggestedVehicle = useMemo(() => {
    if (!availableVehicles.length) return null;
    if (requiredWeight > 0) {
      const wellFitted = availableVehicles
        .filter((vehicle) => vehicle.capacityKg >= requiredWeight)
        .sort((a, b) => a.capacityKg - b.capacityKg);
      if (wellFitted.length) {
        return wellFitted[0];
      }
    }
    return availableVehicles[0];
  }, [availableVehicles, requiredWeight]);

  // Route calculation with error handling
  useEffect(() => {
    const controller = new AbortController();
    let ignore = false;

    const computeRoute = async () => {
      if (!form.source || !form.destination) {
        setRouteState((prev) => ({
          ...prev,
          distanceKm: 0,
          durationMin: 0,
          geometry: [],
          calculating: false,
          error: null,
          usedFallback: false,
        }));
        return;
      }

      setRouteState((prev) => ({
        ...prev,
        calculating: true,
        error: null,
        usedFallback: false,
      }));

      try {
        const url = new URL(
          `https://router.project-osrm.org/route/v1/driving/${form.source.lng},${form.source.lat};${form.destination.lng},${form.destination.lat}`
        );
        url.searchParams.set("overview", "full");
        url.searchParams.set("geometries", "geojson");
        url.searchParams.set("steps", "false");

        const response = await fetch(url.toString(), {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch routing data");
        }

        const payload = await response.json();
        const route = payload.routes?.[0];

        if (!route) {
          throw new Error("No route returned");
        }

        if (!ignore) {
          setRouteState({
            distanceKm: route.distance / 1000,
            durationMin: route.duration / 60,
            geometry: route.geometry.coordinates.map(([lng, lat]) => [
              lat,
              lng,
            ]),
            calculating: false,
            error: null,
            usedFallback: false,
          });
        }
      } catch (error) {
        if (error.name === "AbortError") return;

        console.warn("Routing API failed, using fallback", error);
        const fallbackDistance = haversineDistanceKm(
          form.source,
          form.destination
        );
        if (!ignore) {
          setRouteState({
            distanceKm: fallbackDistance,
            durationMin: (fallbackDistance / 50) * 60,
            geometry: [
              [form.source.lat, form.source.lng],
              [form.destination.lat, form.destination.lng],
            ],
            calculating: false,
            error:
              "Route calculation unavailable. Using straight-line distance.",
            usedFallback: true,
          });
        }
      }
    };

    computeRoute();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [form.source, form.destination]);

  // Auto-assignment with clear feedback
  useEffect(() => {
    if (assignmentMode !== "auto") return;

    if (
      (!form.driverId ||
        !availableDrivers.some((driver) => driver._id === form.driverId)) &&
      suggestedDriver
    ) {
      setForm((prev) => ({ ...prev, driverId: suggestedDriver._id }));
    }

    if (
      (!form.vehicleId ||
        !availableVehicles.some((vehicle) => vehicle._id === form.vehicleId)) &&
      suggestedVehicle
    ) {
      setForm((prev) => ({ ...prev, vehicleId: suggestedVehicle._id }));
    }
  }, [
    assignmentMode,
    availableDrivers,
    availableVehicles,
    form.driverId,
    form.vehicleId,
    suggestedDriver,
    suggestedVehicle,
  ]);

  const handleFormChange = (patch) => {
    setForm((prev) => ({ ...prev, ...patch }));
    // Clear validation errors for changed fields
    const changedKeys = Object.keys(patch);
    setValidationErrors((prev) => {
      const newErrors = { ...prev };
      changedKeys.forEach((key) => delete newErrors[key]);
      return newErrors;
    });
  };

  const totalPrice = useMemo(() => {
    if (routeState.distanceKm <= 0) return 0;
    return Number((routeState.distanceKm * form.ratePerKm).toFixed(2));
  }, [routeState.distanceKm, form.ratePerKm]);

  // Real-time validation
  const validateStep = (step) => {
    const errors = {};

    if (step === 1) {
      if (!form.source) errors.source = "Source location is required";
      if (!form.destination)
        errors.destination = "Destination location is required";
      if (!form.clientId) errors.clientId = "Client selection is required";
      if (!form.goodsType || form.goodsType.trim() === "")
        errors.goodsType = "Goods type is required";
    }

    if (step === 2) {
      if (routeState.distanceKm <= 0) errors.route = "Valid route is required";
      if (form.ratePerKm <= 0)
        errors.ratePerKm = "Rate per km must be greater than 0";
    }

    if (step === 3) {
      if (!form.driverId) errors.driverId = "Driver selection is required";
      if (!form.vehicleId) errors.vehicleId = "Vehicle selection is required";
      if (availableDrivers.length === 0)
        errors.drivers = "No available drivers";
      if (availableVehicles.length === 0)
        errors.vehicles = "No available vehicles";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const canProceedToNext = () => {
    return validateStep(currentStep);
  };

  const handleNext = () => {
    if (canProceedToNext()) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
      saveDraft(true);
    } else {
      toast.error("Please complete all required fields");
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const buildRouteName = () => {
    const sourceLabel = form.source?.label?.split(",")[0] || "Source";
    const destinationLabel =
      form.destination?.label?.split(",")[0] || "Destination";
    return `${sourceLabel.trim()} → ${destinationLabel.trim()} (${new Date()
      .toISOString()
      .slice(0, 10)})`;
  };

  const handleCreateTrip = async () => {
    if (!validateStep(3)) {
      toast.error("Please complete all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const estimatedDurationHours =
        routeState.durationMin > 0
          ? routeState.durationMin / 60
          : routeState.distanceKm > 0
            ? routeState.distanceKm / 50
            : 1;

      const routePayload = {
        name: buildRouteName(),
        source: {
          name: form.source.label,
          lat: form.source.lat,
          lng: form.source.lng,
        },
        destination: {
          name: form.destination.label,
          lat: form.destination.lat,
          lng: form.destination.lng,
        },
        waypoints: [],
        distanceKm: Number(routeState.distanceKm.toFixed(2)),
        estimatedDurationHr: Number(estimatedDurationHours.toFixed(2)),
        tolls: [],
        preferredVehicleTypes: [],
      };

      const routeResponse = await routeApi.create(routePayload);
      const routeId = routeResponse?._id || routeResponse?.route?._id;

      if (!routeId) {
        throw new Error("Route creation did not return an identifier");
      }

      const tripPayload = {
        tripCode: generateTripCode(),
        routeId,
        clientId: form.clientId,
        vehicleIds: [form.vehicleId],
        driverIds: [form.driverId],
        goodsInfo: form.goodsType,
        loadWeightKg: Number(form.quantity) || 0,
        tripCost: totalPrice,
        startTime: form.startTime
          ? new Date(form.startTime).toISOString()
          : new Date().toISOString(),
        status: "scheduled",
        remarks: form.notes,
      };

      await tripApi.create(tripPayload);
      clearDraft(); // Clear draft on successful creation
      toast.success("Trip created and assigned successfully");
      navigate("/dashboard/trips");
    } catch (error) {
      console.error("Failed to create trip", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Unable to create trip";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center gap-2 mb-6">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors ${
                step < currentStep
                  ? "bg-[var(--success)] text-white"
                  : step === currentStep
                    ? "bg-gradient-primary text-white ring-2 ring-[var(--primary)] ring-offset-2"
                    : "bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]"
              }`}
            >
              {step < currentStep ? <FiCheck size={18} /> : step}
            </div>
            {step < 3 && (
              <div
                className={`w-12 h-1 mx-2 rounded ${
                  step < currentStep
                    ? "bg-[var(--success)]"
                    : "bg-[var(--border-primary)]"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderStepTitle = () => {
    const titles = {
      1: "Trip Details",
      2: "Route & Pricing",
      3: "Assignment",
    };
    const descriptions = {
      1: "Enter source, destination, client, and goods information",
      2: "Review route calculation and set pricing",
      3: "Assign driver and vehicle to this trip",
    };
    return (
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
          Step {currentStep}: {titles[currentStep]}
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          {descriptions[currentStep]}
        </p>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            Create New Trip
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Complete all steps to create and assign a trip
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={saveDraft}>
            <FiSave className="mr-2" /> Save Draft
          </Button>
          <Button variant="ghost" onClick={() => navigate("/dashboard/trips")}>
            <FiArrowLeft className="mr-2" /> Cancel
          </Button>
        </div>
      </div>

      {loading ? (
        <Card className="flex items-center justify-center gap-3 text-[var(--text-secondary)] p-8">
          <FiLoader className="animate-spin" /> Loading available drivers and
          vehicles...
        </Card>
      ) : (
        <>
          {renderStepIndicator()}
          {renderStepTitle()}

          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-6">
              {/* Step 1: Trip Details */}
              {currentStep === 1 && (
                <TripDetailsSection
                  form={form}
                  onFormChange={handleFormChange}
                  onSourceChange={(location) =>
                    handleFormChange({ source: location })
                  }
                  onDestinationChange={(location) =>
                    handleFormChange({ destination: location })
                  }
                  clients={clients}
                  errors={validationErrors}
                />
              )}

              {/* Step 2: Route & Pricing */}
              {currentStep === 2 && (
                <>
                  {routeState.error && (
                    <Card className="bg-[var(--warning)]/10 border-[var(--warning)] p-4">
                      <div className="flex items-start gap-3">
                        <FiAlertCircle
                          className="text-[var(--warning)] flex-shrink-0 mt-0.5"
                          size={20}
                        />
                        <div>
                          <p className="font-semibold text-[var(--warning)] mb-1">
                            Route Calculation Warning
                          </p>
                          <p className="text-sm text-[var(--text-secondary)]">
                            {routeState.error}
                          </p>
                        </div>
                      </div>
                    </Card>
                  )}
                  <PricingSummary
                    distanceKm={routeState.distanceKm}
                    durationMin={routeState.durationMin}
                    ratePerKm={form.ratePerKm}
                    onRateChange={(value) =>
                      handleFormChange({ ratePerKm: value })
                    }
                    totalPrice={totalPrice}
                    isCalculating={routeState.calculating}
                    usedFallback={routeState.usedFallback}
                    errors={validationErrors}
                  />
                </>
              )}

              {/* Step 3: Assignment */}
              {currentStep === 3 && (
                <>
                  {assignmentMode === "auto" && (
                    <Card className="bg-[var(--primary)]/10 border-[var(--primary)] p-4">
                      <div className="flex items-start gap-3">
                        <FiInfo
                          className="text-[var(--primary)] flex-shrink-0 mt-0.5"
                          size={20}
                        />
                        <div>
                          <p className="font-semibold text-[var(--primary)] mb-1">
                            Auto-Assignment Active
                          </p>
                          <p className="text-sm text-[var(--text-secondary)]">
                            The system will automatically select the best
                            available driver and vehicle based on availability
                            and load capacity. You can switch to manual mode to
                            choose specific resources.
                          </p>
                        </div>
                      </div>
                    </Card>
                  )}
                  <AssignmentPanel
                    mode={assignmentMode}
                    onModeChange={setAssignmentMode}
                    drivers={availableDrivers}
                    vehicles={availableVehicles}
                    selectedDriverId={form.driverId}
                    selectedVehicleId={form.vehicleId}
                    suggestedDriver={suggestedDriver}
                    suggestedVehicle={suggestedVehicle}
                    onDriverChange={(value) =>
                      handleFormChange({ driverId: value })
                    }
                    onVehicleChange={(value) =>
                      handleFormChange({ vehicleId: value })
                    }
                    errors={validationErrors}
                  />
                </>
              )}

              {/* Navigation Buttons */}
              <Card>
                <div className="flex items-center justify-between gap-4">
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                  >
                    <FiArrowLeft className="mr-2" /> Previous
                  </Button>

                  {currentStep < totalSteps ? (
                    <Button
                      variant="primary"
                      onClick={handleNext}
                      disabled={routeState.calculating}
                    >
                      Next Step
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={handleCreateTrip}
                      disabled={isSubmitting || routeState.calculating}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <FiLoader className="animate-spin" /> Creating...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <FiCheck /> Create Trip
                        </span>
                      )}
                    </Button>
                  )}
                </div>
              </Card>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              <RoutePreview
                source={form.source}
                destination={form.destination}
                geometry={routeState.geometry}
                distanceKm={routeState.distanceKm}
                durationMin={routeState.durationMin}
                calculating={routeState.calculating}
                error={routeState.error}
              />

              <Card className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                    Trip Summary
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Review your selections
                  </p>
                </div>

                <dl className="space-y-2 text-sm text-[var(--text-secondary)]">
                  <div className="flex justify-between">
                    <dt>Client</dt>
                    <dd className="font-medium text-[var(--text-primary)]">
                      {clients.find((client) => client._id === form.clientId)
                        ?.name || "--"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Goods</dt>
                    <dd className="font-medium text-[var(--text-primary)]">
                      {form.goodsType || "--"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Weight</dt>
                    <dd className="font-medium text-[var(--text-primary)]">
                      {requiredWeight > 0
                        ? `${requiredWeight} kg`
                        : "Not specified"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Driver</dt>
                    <dd className="font-medium text-[var(--text-primary)]">
                      {availableDrivers.find(
                        (driver) => driver._id === form.driverId
                      )?.name || "--"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Vehicle</dt>
                    <dd className="font-medium text-[var(--text-primary)]">
                      {availableVehicles.find(
                        (vehicle) => vehicle._id === form.vehicleId
                      )?.vehicleNo || "--"}
                    </dd>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[var(--border-primary)]">
                    <dt className="font-semibold">Distance</dt>
                    <dd className="font-semibold text-[var(--text-primary)]">
                      {routeState.distanceKm > 0
                        ? `${routeState.distanceKm.toFixed(2)} km`
                        : "--"}
                    </dd>
                  </div>
                  <div className="flex justify-between text-base font-semibold text-[var(--text-primary)]">
                    <dt>Total Price</dt>
                    <dd>
                      {totalPrice > 0
                        ? `₹${totalPrice.toLocaleString()}`
                        : "--"}
                    </dd>
                  </div>
                </dl>

                {Object.keys(validationErrors).length > 0 && (
                  <div className="p-3 bg-[var(--danger)]/10 border border-[var(--danger)] rounded-lg">
                    <p className="text-sm font-semibold text-[var(--danger)] mb-1">
                      Please fix the following errors:
                    </p>
                    <ul className="text-xs text-[var(--danger)] space-y-1 ml-4 list-disc">
                      {Object.values(validationErrors).map((error, idx) => (
                        <li key={idx}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
