import { useState, useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Button from "./ui/Button";
import api from "../api/axiosClient";
import toast from "react-hot-toast";

// Fix default marker icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom icons for different markers
const createCustomIcon = (color, label) => {
  const svgIcon = `
    <svg width="30" height="45" viewBox="0 0 30 45" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 0C6.716 0 0 6.716 0 15c0 11.25 15 30 15 30s15-18.75 15-30c0-8.284-6.716-15-15-15z" 
            fill="${color}" stroke="#fff" stroke-width="2"/>
      <circle cx="15" cy="15" r="8" fill="#fff"/>
      <text x="15" y="19" text-anchor="middle" font-size="10" font-weight="bold" fill="${color}">${label}</text>
    </svg>
  `;

  return new L.DivIcon({
    className: "custom-marker",
    html: svgIcon,
    iconSize: [30, 45],
    iconAnchor: [15, 45],
    popupAnchor: [0, -45],
  });
};

export default function TripMapCreator({ onClose, onSubmit }) {
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState({
    routes: [],
    drivers: [],
    vehicles: [],
    clients: [],
  });

  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedDrivers, setSelectedDrivers] = useState([]);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");

  const [tripDetails, setTripDetails] = useState({
    goodsInfo: "",
    loadWeightKg: "",
    startTime: "",
  });

  useEffect(() => {
    loadAvailableResources();
  }, []);

  const loadAvailableResources = async () => {
    try {
      setLoading(true);
      const response = await api.get("/trips/available-resources");
      setResources(response.data.data || response.data);
    } catch (error) {
      console.error("Error loading resources:", error);
      toast.error("Failed to load available resources");
    } finally {
      setLoading(false);
    }
  };

  // Calculate route polyline coordinates
  const getRouteCoordinates = (route) => {
    if (!route) return [];
    const coords = [
      [route.source.lat, route.source.lng],
      ...(route.waypoints?.map((w) => [w.lat, w.lng]) || []),
      [route.destination.lat, route.destination.lng],
    ];
    return coords;
  };

  // Check for conflicts (drivers/vehicles already assigned)
  const checkConflicts = () => {
    const conflicts = {
      drivers: [],
      vehicles: [],
    };

    // Check if selected drivers are available
    selectedDrivers.forEach((driverId) => {
      const driver = resources.drivers.find((d) => d._id === driverId);
      if (driver && driver.status === "on-trip") {
        conflicts.drivers.push(driver.user?.name || driver.licenseNo);
      }
    });

    // Check if selected vehicles are available
    selectedVehicles.forEach((vehicleId) => {
      const vehicle = resources.vehicles.find((v) => v._id === vehicleId);
      if (vehicle && vehicle.status === "in-trip") {
        conflicts.vehicles.push(vehicle.vehicleNo);
      }
    });

    return conflicts;
  };

  // Calculate estimated cost
  const calculateCost = useMemo(() => {
    if (!selectedRoute) return 0;
    const baseCost = selectedRoute.distanceKm * 25; // ₹25 per km
    const tollsCost =
      selectedRoute.tolls?.reduce((sum, toll) => sum + (toll.cost || 0), 0) ||
      0;
    return baseCost + tollsCost;
  }, [selectedRoute]);

  // Filter available drivers (exclude those on trip)
  const availableDrivers = useMemo(() => {
    return resources.drivers.filter((d) => d.status !== "on-trip");
  }, [resources.drivers]);

  // Filter available vehicles
  const availableVehicles = useMemo(() => {
    return resources.vehicles.filter((v) => v.status === "available");
  }, [resources.vehicles]);

  // Toggle driver selection
  const toggleDriver = (driverId) => {
    setSelectedDrivers((prev) =>
      prev.includes(driverId)
        ? prev.filter((id) => id !== driverId)
        : [...prev, driverId]
    );
  };

  // Toggle vehicle selection
  const toggleVehicle = (vehicleId) => {
    setSelectedVehicles((prev) =>
      prev.includes(vehicleId)
        ? prev.filter((id) => id !== vehicleId)
        : [...prev, vehicleId]
    );
  };

  // Generate trip code
  const generateTripCode = () => {
    const prefix = "TRP";
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 3).toUpperCase();
    return `${prefix}_${timestamp}_${random}`;
  };

  // Handle trip creation
  const handleCreateTrip = async () => {
    if (!selectedRoute) {
      toast.error("Please select a route");
      return;
    }
    if (selectedDrivers.length === 0) {
      toast.error("Please select at least one driver");
      return;
    }
    if (selectedVehicles.length === 0) {
      toast.error("Please select at least one vehicle");
      return;
    }
    if (!selectedClient) {
      toast.error("Please select a client");
      return;
    }
    if (!tripDetails.goodsInfo) {
      toast.error("Please enter goods information");
      return;
    }

    // Check for conflicts
    const conflicts = checkConflicts();
    if (conflicts.drivers.length > 0) {
      toast.error(
        `⚠️ Conflict: Driver(s) already on trip: ${conflicts.drivers.join(", ")}`
      );
      return;
    }
    if (conflicts.vehicles.length > 0) {
      toast.error(
        `⚠️ Conflict: Vehicle(s) already in trip: ${conflicts.vehicles.join(", ")}`
      );
      return;
    }

    const payload = {
      tripCode: generateTripCode(),
      routeId: selectedRoute._id,
      clientId: selectedClient,
      driverIds: selectedDrivers,
      vehicleIds: selectedVehicles,
      goodsInfo: tripDetails.goodsInfo,
      loadWeightKg: Number(tripDetails.loadWeightKg) || 0,
      tripCost: calculateCost,
      startTime: tripDetails.startTime
        ? new Date(tripDetails.startTime).toISOString()
        : new Date().toISOString(),
      status: "scheduled",
    };

    try {
      await onSubmit(payload);
      toast.success("Trip created successfully!");
      onClose();
    } catch (error) {
      console.error("Error creating trip:", error);
      toast.error(error.response?.data?.message || "Failed to create trip");
    }
  };

  // Map center
  const mapCenter = selectedRoute
    ? [selectedRoute.source.lat, selectedRoute.source.lng]
    : [20.5937, 78.9629]; // India center

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[var(--bg-primary)] z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-[var(--text-primary)]">Loading resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[var(--bg-primary)] z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-[var(--bg-elevated)] border-b border-[var(--border-primary)] p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              Create Trip - Map View
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Select route, assign drivers and vehicles
            </p>
          </div>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Selection Panel */}
        <div className="w-96 bg-[var(--bg-elevated)] border-r border-[var(--border-primary)] overflow-y-auto">
          <div className="p-4 space-y-6">
            {/* Route Selection */}
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
                1. Select Route
              </h3>
              <div className="space-y-2">
                {resources.routes.map((route) => (
                  <div
                    key={route._id}
                    onClick={() => setSelectedRoute(route)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedRoute?._id === route._id
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-[var(--border-primary)] hover:bg-[var(--bg-secondary)]"
                    }`}
                  >
                    <div className="font-medium text-[var(--text-primary)]">
                      {route.name}
                    </div>
                    <div className="text-sm text-[var(--text-secondary)] mt-1">
                      {route.source.name} → {route.destination.name}
                    </div>
                    <div className="text-xs text-[var(--text-tertiary)] mt-1">
                      {route.distanceKm}km • {route.estimatedDurationHr}hrs
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Driver Selection */}
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
                2. Select Drivers ({selectedDrivers.length})
              </h3>
              <div className="space-y-2">
                {availableDrivers.map((driver) => (
                  <div
                    key={driver._id}
                    onClick={() => toggleDriver(driver._id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedDrivers.includes(driver._id)
                        ? "border-green-500 bg-green-500/10"
                        : "border-[var(--border-primary)] hover:bg-[var(--bg-secondary)]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-[var(--text-primary)]">
                          {driver.name}
                        </div>
                        <div className="text-sm text-[var(--text-secondary)]">
                          {driver.licenseNo}
                        </div>
                      </div>
                      {selectedDrivers.includes(driver._id) && (
                        <span className="text-green-500">✓</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vehicle Selection */}
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
                3. Select Vehicles ({selectedVehicles.length})
              </h3>
              <div className="space-y-2">
                {availableVehicles.map((vehicle) => (
                  <div
                    key={vehicle._id}
                    onClick={() => toggleVehicle(vehicle._id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedVehicles.includes(vehicle._id)
                        ? "border-green-500 bg-green-500/10"
                        : "border-[var(--border-primary)] hover:bg-[var(--bg-secondary)]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-[var(--text-primary)]">
                          {vehicle.vehicleNo}
                        </div>
                        <div className="text-sm text-[var(--text-secondary)]">
                          {vehicle.model} • {vehicle.capacityKg}kg
                        </div>
                      </div>
                      {selectedVehicles.includes(vehicle._id) && (
                        <span className="text-green-500">✓</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Client Selection */}
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
                4. Select Client
              </h3>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Client</option>
                {resources.clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Trip Details */}
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
                5. Trip Details
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Goods Information *"
                  value={tripDetails.goodsInfo}
                  onChange={(e) =>
                    setTripDetails({
                      ...tripDetails,
                      goodsInfo: e.target.value,
                    })
                  }
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg py-2.5 px-4 placeholder-[var(--text-tertiary)]"
                />
                <input
                  type="number"
                  placeholder="Load Weight (kg)"
                  value={tripDetails.loadWeightKg}
                  onChange={(e) =>
                    setTripDetails({
                      ...tripDetails,
                      loadWeightKg: e.target.value,
                    })
                  }
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg py-2.5 px-4 placeholder-[var(--text-tertiary)]"
                />
                <input
                  type="datetime-local"
                  value={tripDetails.startTime}
                  onChange={(e) =>
                    setTripDetails({
                      ...tripDetails,
                      startTime: e.target.value,
                    })
                  }
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg py-2.5 px-4"
                />
              </div>
            </div>

            {/* Create Button */}
            <div className="sticky bottom-0 bg-[var(--bg-elevated)] pt-4 pb-2 border-t border-[var(--border-primary)]">
              <Button
                onClick={handleCreateTrip}
                className="w-full"
                variant="primary"
                disabled={
                  !selectedRoute ||
                  selectedDrivers.length === 0 ||
                  selectedVehicles.length === 0
                }
              >
                Create Trip - ₹{calculateCost.toLocaleString()}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side - Map */}
        <div className="flex-1 relative">
          <MapContainer
            center={mapCenter}
            zoom={6}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />

            {/* Draw selected route */}
            {selectedRoute && (
              <>
                <Polyline
                  positions={getRouteCoordinates(selectedRoute)}
                  color="blue"
                  weight={4}
                  opacity={0.7}
                />

                {/* Source marker */}
                <Marker
                  position={[
                    selectedRoute.source.lat,
                    selectedRoute.source.lng,
                  ]}
                  icon={createCustomIcon("#22c55e", "S")}
                >
                  <Popup>
                    <div className="text-sm">
                      <strong>Source</strong>
                      <br />
                      {selectedRoute.source.name}
                    </div>
                  </Popup>
                </Marker>

                {/* Waypoint markers */}
                {selectedRoute.waypoints?.map((wp, idx) => (
                  <Marker
                    key={idx}
                    position={[wp.lat, wp.lng]}
                    icon={createCustomIcon("#f59e0b", (idx + 1).toString())}
                  >
                    <Popup>
                      <div className="text-sm">
                        <strong>Waypoint {idx + 1}</strong>
                        <br />
                        {wp.name}
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {/* Destination marker */}
                <Marker
                  position={[
                    selectedRoute.destination.lat,
                    selectedRoute.destination.lng,
                  ]}
                  icon={createCustomIcon("#ef4444", "D")}
                >
                  <Popup>
                    <div className="text-sm">
                      <strong>Destination</strong>
                      <br />
                      {selectedRoute.destination.name}
                    </div>
                  </Popup>
                </Marker>
              </>
            )}

            {/* Draw all routes faintly */}
            {resources.routes
              .filter((r) => r._id !== selectedRoute?._id)
              .map((route) => (
                <Polyline
                  key={route._id}
                  positions={getRouteCoordinates(route)}
                  color="#94a3b8"
                  weight={2}
                  opacity={0.3}
                  eventHandlers={{
                    click: () => setSelectedRoute(route),
                  }}
                />
              ))}

            {/* Show driver locations */}
            {availableDrivers
              .filter((d) => d.currentLocation)
              .map((driver) => (
                <Marker
                  key={driver._id}
                  position={[
                    driver.currentLocation.lat,
                    driver.currentLocation.lng,
                  ]}
                  icon={createCustomIcon(
                    selectedDrivers.includes(driver._id)
                      ? "#22c55e"
                      : "#3b82f6",
                    "D"
                  )}
                >
                  <Popup>
                    <div className="text-sm">
                      <strong>{driver.name}</strong>
                      <br />
                      License: {driver.licenseNo}
                      <br />
                      Status: {driver.status}
                    </div>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>

          {/* Map Legend */}
          <div className="absolute top-4 right-4 bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-lg p-4 shadow-lg">
            <h4 className="font-semibold text-[var(--text-primary)] mb-2">
              Legend
            </h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-[var(--text-secondary)]">Source</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-[var(--text-secondary)]">
                  Destination
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-[var(--text-secondary)]">Waypoint</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-[var(--text-secondary)]">Driver</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
