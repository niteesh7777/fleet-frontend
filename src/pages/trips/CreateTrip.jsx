import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiLoader } from "react-icons/fi";
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

  const [form, setForm] = useState({
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
  });
  const [assignmentMode, setAssignmentMode] = useState("auto");
  const [routeState, setRouteState] = useState({
    distanceKm: 0,
    durationMin: 0,
    geometry: [],
    calculating: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        }));
        return;
      }

      setRouteState((prev) => ({ ...prev, calculating: true }));

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
          });
        }
      } catch (error) {
        console.warn("Routing fallback activated", error);
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
  };

  const totalPrice = useMemo(() => {
    if (routeState.distanceKm <= 0) return 0;
    return Number((routeState.distanceKm * form.ratePerKm).toFixed(2));
  }, [routeState.distanceKm, form.ratePerKm]);

  const canSubmit =
    !!form.source &&
    !!form.destination &&
    !!form.clientId &&
    !!form.goodsType &&
    !!form.driverId &&
    !!form.vehicleId &&
    routeState.distanceKm > 0 &&
    !routeState.calculating &&
    !isSubmitting;

  const buildRouteName = () => {
    const sourceLabel = form.source?.label?.split(",")[0] || "Source";
    const destinationLabel =
      form.destination?.label?.split(",")[0] || "Destination";
    return `${sourceLabel.trim()} → ${destinationLabel.trim()} (${new Date()
      .toISOString()
      .slice(0, 10)})`;
  };

  const handleCreateTrip = async () => {
    if (!canSubmit) {
      toast.error("Fill required details before creating the trip");
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-(--text-primary)">
            Create Trip
          </h1>
          <p className="text-sm text-(--text-secondary)">
            Manage route, pricing, and assignment without leaving this screen.
          </p>
        </div>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <FiArrowLeft className="mr-2" /> Back
        </Button>
      </div>

      {loading ? (
        <Card className="flex items-center justify-center gap-3 text-(--text-secondary)">
          <FiLoader className="animate-spin" /> Loading available drivers and
          vehicles...
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
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
            />

            <PricingSummary
              distanceKm={routeState.distanceKm}
              durationMin={routeState.durationMin}
              ratePerKm={form.ratePerKm}
              onRateChange={(value) => handleFormChange({ ratePerKm: value })}
              totalPrice={totalPrice}
              isCalculating={routeState.calculating}
            />

            <AssignmentPanel
              mode={assignmentMode}
              onModeChange={setAssignmentMode}
              drivers={availableDrivers}
              vehicles={availableVehicles}
              selectedDriverId={form.driverId}
              selectedVehicleId={form.vehicleId}
              suggestedDriver={suggestedDriver}
              suggestedVehicle={suggestedVehicle}
              onDriverChange={(value) => handleFormChange({ driverId: value })}
              onVehicleChange={(value) =>
                handleFormChange({ vehicleId: value })
              }
            />
          </div>

          <div className="space-y-6">
            <RoutePreview
              source={form.source}
              destination={form.destination}
              geometry={routeState.geometry}
              distanceKm={routeState.distanceKm}
              durationMin={routeState.durationMin}
            />

            <Card className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-(--text-primary)">
                  Trip Summary
                </h2>
                <p className="text-sm text-(--text-secondary)">
                  Review before creating the trip.
                </p>
              </div>

              <dl className="space-y-2 text-sm text-(--text-secondary)">
                <div className="flex justify-between">
                  <dt>Client</dt>
                  <dd>
                    {clients.find((client) => client._id === form.clientId)
                      ?.name || "--"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>Goods</dt>
                  <dd>{form.goodsType || "--"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Weight</dt>
                  <dd>
                    {requiredWeight > 0
                      ? `${requiredWeight} kg`
                      : "Not specified"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>Driver</dt>
                  <dd>
                    {availableDrivers.find(
                      (driver) => driver._id === form.driverId
                    )?.name || "--"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>Vehicle</dt>
                  <dd>
                    {availableVehicles.find(
                      (vehicle) => vehicle._id === form.vehicleId
                    )?.vehicleNo || "--"}
                  </dd>
                </div>
                <div className="flex justify-between text-base font-semibold text-(--text-primary)">
                  <dt>Total price</dt>
                  <dd>
                    {totalPrice > 0 ? `₹${totalPrice.toLocaleString()}` : "--"}
                  </dd>
                </div>
              </dl>

              <Button
                className="w-full"
                variant="primary"
                disabled={!canSubmit}
                onClick={handleCreateTrip}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <FiLoader className="animate-spin" /> Creating trip...
                  </span>
                ) : (
                  "Create & Assign Trip"
                )}
              </Button>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
