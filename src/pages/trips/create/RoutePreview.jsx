import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Card from "../../../components/ui/Card";
import { FiClock, FiTrendingUp } from "react-icons/fi";

// Ensure Leaflet default icons resolve from parcel/vite build
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function MapBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!map || points.length === 0) return;
    map.fitBounds(points, { padding: [32, 32] });
  }, [map, points]);
  return null;
}

export default function RoutePreview({
  source,
  destination,
  geometry,
  distanceKm,
  durationMin,
  isCalculating,
  routeError,
}) {
  const polylinePositions = geometry?.length
    ? geometry
    : source && destination
      ? [
          [source.lat, source.lng],
          [destination.lat, destination.lng],
        ]
      : [];

  const boundsPoints = polylinePositions.length
    ? polylinePositions
    : source && destination
      ? [
          [source.lat, source.lng],
          [destination.lat, destination.lng],
        ]
      : [];

  const center = boundsPoints.length
    ? boundsPoints[Math.floor(boundsPoints.length / 2)]
    : [20.5937, 78.9629];

  return (
    <Card className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold text-(--text-primary)">
            Route Preview
          </h2>
          <p className="text-sm text-(--text-secondary)">
            {isCalculating
              ? "Calculating route..."
              : "Visualize distance and travel estimate"}
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm text-(--text-secondary)">
          <span className="flex items-center gap-1">
            <FiTrendingUp />
            {isCalculating
              ? "..."
              : distanceKm > 0
                ? `${distanceKm.toFixed(1)} km`
                : "--"}
          </span>
          <span className="flex items-center gap-1">
            <FiClock />
            {isCalculating
              ? "..."
              : durationMin > 0
                ? `${Math.round(durationMin / 60)}h ${Math.round(durationMin % 60)}m`
                : "--"}
          </span>
        </div>
      </div>

      {routeError && (
        <div className="mb-4 p-3 bg-[var(--danger)]/10 border border-[var(--danger)] rounded-lg">
          <p className="text-sm text-[var(--danger)]">{routeError}</p>
        </div>
      )}

      <div className="flex-1 rounded-xl overflow-hidden border border-(--border-primary)">
        <MapContainer
          center={center}
          zoom={6}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {boundsPoints.length > 0 && <MapBounds points={boundsPoints} />}

          {polylinePositions.length > 0 && (
            <Polyline
              positions={polylinePositions}
              color="#2563eb"
              weight={5}
              opacity={0.7}
            />
          )}

          {source && (
            <Marker position={[source.lat, source.lng]}>
              <Popup>Source</Popup>
            </Marker>
          )}

          {destination && (
            <Marker position={[destination.lat, destination.lng]}>
              <Popup>Destination</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </Card>
  );
}
