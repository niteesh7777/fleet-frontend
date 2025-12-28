import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { FiMapPin, FiTrash2, FiEdit2, FiCheck } from "react-icons/fi";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Card from "./ui/Card";
import toast from "react-hot-toast";

/**
 * Helper to get custom markers with different colors
 */
const getMarkerIcon = (type) => {
  const colors = {
    source: "#22c55e", // green
    destination: "#ef4444", // red
    waypoint: "#f97316", // orange
  };

  return L.divIcon({
    html: `
      <div style="
        background-color: ${colors[type]};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 14px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        ${type === "source" ? "S" : type === "destination" ? "D" : "W"}
      </div>
    `,
    iconSize: [32, 32],
    className: "custom-marker",
  });
};

/**
 * Map click handler component
 */
function MapClickHandler({ onMapClick }) {
  const map = useMap();

  useEffect(() => {
    const handleClick = (e) => {
      onMapClick({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    };

    map.on("click", handleClick);
    return () => {
      map.off("click", handleClick);
    };
  }, [map, onMapClick]);

  return null;
}

/**
 * Route Map Creator Component
 * Allows admin to select source, destination, and waypoints on an interactive map
 */
export default function RouteMapCreator({
  onSourceSelect,
  onDestinationSelect,
  onWaypointsUpdate,
  initialSource = null,
  initialDestination = null,
  initialWaypoints = [],
}) {
  const [source, setSource] = useState(initialSource || null);
  const [destination, setDestination] = useState(initialDestination || null);
  const [waypoints, setWaypoints] = useState(initialWaypoints);
  const [editingMode, setEditingMode] = useState(null); // 'source', 'destination', 'waypoint', null
  const [mapCenter] = useState([20.5937, 78.9629]); // Center of India
  const [mapZoom] = useState(5);

  const handleMapClick = (coords) => {
    if (editingMode === "source") {
      const newSource = {
        ...coords,
        name: `Source (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`,
      };
      setSource(newSource);
      onSourceSelect?.(newSource);
      setEditingMode(null);
      toast.success("Source location selected");
    } else if (editingMode === "destination") {
      const newDestination = {
        ...coords,
        name: `Destination (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`,
      };
      setDestination(newDestination);
      onDestinationSelect?.(newDestination);
      setEditingMode(null);
      toast.success("Destination location selected");
    } else if (editingMode === "waypoint") {
      const newWaypoint = {
        ...coords,
        name: `Waypoint ${waypoints.length + 1}`,
        stopDurationMin: 0,
      };
      const updated = [...waypoints, newWaypoint];
      setWaypoints(updated);
      onWaypointsUpdate?.(updated);
      setEditingMode(null);
      toast.success("Waypoint added");
    }
  };

  const removeWaypoint = (index) => {
    const updated = waypoints.filter((_, i) => i !== index);
    setWaypoints(updated);
    onWaypointsUpdate?.(updated);
    toast.success("Waypoint removed");
  };

  const updateWaypointName = (index, name) => {
    const updated = [...waypoints];
    updated[index].name = name;
    setWaypoints(updated);
    onWaypointsUpdate?.(updated);
  };

  const updateWaypointDuration = (index, duration) => {
    const updated = [...waypoints];
    updated[index].stopDurationMin = parseInt(duration) || 0;
    setWaypoints(updated);
    onWaypointsUpdate?.(updated);
  };

  // Build polyline coordinates
  const polylineCoords = [];
  if (source) polylineCoords.push([source.lat, source.lng]);
  waypoints.forEach((wp) => polylineCoords.push([wp.lat, wp.lng]));
  if (destination) polylineCoords.push([destination.lat, destination.lng]);

  return (
    <div className="flex gap-6 h-full">
      {/* Left Sidebar - Controls */}
      <div className="w-96 bg-[var(--bg-secondary)] rounded-lg p-6 overflow-y-auto flex flex-col">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6">
          Route Locations
        </h3>

        {/* Source Selection */}
        <Card className="mb-4 p-4 border-2 border-green-500/30">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-green-600">Source</p>
              {source && (
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  {source.name}
                </p>
              )}
            </div>
            {!source && (
              <Button
                variant={editingMode === "source" ? "primary" : "outline"}
                size="sm"
                onClick={() =>
                  setEditingMode(editingMode === "source" ? null : "source")
                }
              >
                {editingMode === "source" ? "Cancel" : "Select"}
              </Button>
            )}
            {source && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSource(null);
                  onSourceSelect?.(null);
                }}
              >
                <FiTrash2 size={14} />
              </Button>
            )}
          </div>
          {source && (
            <div className="text-xs text-[var(--text-secondary)] space-y-1">
              <p>Lat: {source.lat.toFixed(6)}</p>
              <p>Lng: {source.lng.toFixed(6)}</p>
            </div>
          )}
          {editingMode === "source" && (
            <p className="text-xs text-blue-600 mt-2 animate-pulse">
              👆 Click on map to select source location
            </p>
          )}
        </Card>

        {/* Destination Selection */}
        <Card className="mb-4 p-4 border-2 border-red-500/30">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-red-600">Destination</p>
              {destination && (
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  {destination.name}
                </p>
              )}
            </div>
            {!destination && (
              <Button
                variant={editingMode === "destination" ? "primary" : "outline"}
                size="sm"
                onClick={() =>
                  setEditingMode(
                    editingMode === "destination" ? null : "destination"
                  )
                }
              >
                {editingMode === "destination" ? "Cancel" : "Select"}
              </Button>
            )}
            {destination && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDestination(null);
                  onDestinationSelect?.(null);
                }}
              >
                <FiTrash2 size={14} />
              </Button>
            )}
          </div>
          {destination && (
            <div className="text-xs text-[var(--text-secondary)] space-y-1">
              <p>Lat: {destination.lat.toFixed(6)}</p>
              <p>Lng: {destination.lng.toFixed(6)}</p>
            </div>
          )}
          {editingMode === "destination" && (
            <p className="text-xs text-blue-600 mt-2 animate-pulse">
              👆 Click on map to select destination location
            </p>
          )}
        </Card>

        {/* Waypoints Section */}
        <Card className="p-4 border-2 border-orange-500/30 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-orange-600">
              Waypoints ({waypoints.length})
            </p>
            <Button
              variant={editingMode === "waypoint" ? "primary" : "outline"}
              size="sm"
              onClick={() =>
                setEditingMode(editingMode === "waypoint" ? null : "waypoint")
              }
            >
              {editingMode === "waypoint" ? "Cancel" : "Add"}
            </Button>
          </div>

          {editingMode === "waypoint" && (
            <p className="text-xs text-blue-600 mb-3 animate-pulse">
              👆 Click on map to add waypoint
            </p>
          )}

          <div className="space-y-3 overflow-y-auto flex-1">
            {waypoints.length === 0 ? (
              <p className="text-xs text-[var(--text-tertiary)]">
                No waypoints added yet
              </p>
            ) : (
              waypoints.map((wp, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-[var(--bg-primary)] rounded border border-orange-500/20"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-orange-600">
                      W{idx + 1}
                    </span>
                    <Input
                      type="text"
                      value={wp.name}
                      onChange={(e) => updateWaypointName(idx, e.target.value)}
                      placeholder="Location name"
                      className="text-xs flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeWaypoint(idx)}
                    >
                      <FiTrash2 size={14} />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <Input
                      type="text"
                      value={wp.lat.toFixed(6)}
                      disabled
                      className="text-xs"
                      label="Lat"
                    />
                    <Input
                      type="text"
                      value={wp.lng.toFixed(6)}
                      disabled
                      className="text-xs"
                      label="Lng"
                    />
                  </div>

                  <Input
                    type="number"
                    value={wp.stopDurationMin}
                    onChange={(e) =>
                      updateWaypointDuration(idx, e.target.value)
                    }
                    placeholder="Stop duration (min)"
                    label="Stop Duration (min)"
                    className="text-xs"
                  />

                  <p className="text-xs text-[var(--text-tertiary)] mt-2">
                    ({wp.lat.toFixed(4)}, {wp.lng.toFixed(4)})
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Info Box */}
        <div className="mt-6 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
          <p className="text-xs text-blue-600">
            💡 Click the buttons above, then click on the map to select
            locations.
          </p>
        </div>
      </div>

      {/* Right Side - Map */}
      <div className="flex-1 rounded-lg overflow-hidden border border-[var(--border-primary)]">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <MapClickHandler onMapClick={handleMapClick} />

          {/* Source Marker */}
          {source && (
            <Marker
              position={[source.lat, source.lng]}
              icon={getMarkerIcon("source")}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold text-green-600">{source.name}</p>
                  <p className="text-xs">
                    {source.lat.toFixed(4)}, {source.lng.toFixed(4)}
                  </p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Destination Marker */}
          {destination && (
            <Marker
              position={[destination.lat, destination.lng]}
              icon={getMarkerIcon("destination")}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold text-red-600">
                    {destination.name}
                  </p>
                  <p className="text-xs">
                    {destination.lat.toFixed(4)}, {destination.lng.toFixed(4)}
                  </p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Waypoint Markers */}
          {waypoints.map((wp, idx) => (
            <Marker
              key={idx}
              position={[wp.lat, wp.lng]}
              icon={getMarkerIcon("waypoint")}
            >
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold text-orange-600">{wp.name}</p>
                  <p className="text-xs">
                    {wp.lat.toFixed(4)}, {wp.lng.toFixed(4)}
                  </p>
                  <p className="text-xs">Stop: {wp.stopDurationMin} min</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Route Polyline */}
          {polylineCoords.length > 1 && (
            <Polyline
              positions={polylineCoords}
              color="#3b82f6"
              weight={3}
              opacity={0.7}
              dashArray="5, 5"
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}
