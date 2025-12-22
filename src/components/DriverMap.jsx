import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in webpack/vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom marker icons based on driver status
const createCustomIcon = (status) => {
  const colors = {
    "on-trip": "#ef4444", // red
    active: "#22c55e", // green
    inactive: "#9ca3af", // gray
  };

  const color = colors[status] || "#3b82f6"; // default blue

  const svgIcon = `
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.5 0C5.596 0 0 5.596 0 12.5c0 9.375 12.5 28.5 12.5 28.5S25 21.875 25 12.5C25 5.596 19.404 0 12.5 0z" 
            fill="${color}" stroke="#fff" stroke-width="2"/>
      <circle cx="12.5" cy="12.5" r="6" fill="#fff"/>
    </svg>
  `;

  return new L.DivIcon({
    className: "custom-marker",
    html: svgIcon,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
};

export default function DriverMap({ drivers, height = "600px" }) {
  // Filter drivers with valid locations
  const driversWithLocation = drivers.filter(
    (d) => d.currentLocation?.lat && d.currentLocation?.lng
  );

  // Set map center to first driver with location or stay at default
  const mapCenter =
    driversWithLocation.length > 0
      ? [
          driversWithLocation[0].currentLocation.lat,
          driversWithLocation[0].currentLocation.lng,
        ]
      : [37.7749, -122.4194]; // Default: San Francisco

  const getStatusBadgeClass = (status) => {
    const classes = {
      "on-trip": "bg-red-100 text-red-800",
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
    };
    return classes[status] || "bg-blue-100 text-blue-800";
  };

  return (
    <div
      style={{ height, width: "100%", borderRadius: "8px", overflow: "hidden" }}
    >
      {driversWithLocation.length === 0 ? (
        <div className="flex items-center justify-center h-full bg-gray-100">
          <div className="text-center p-8">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No driver locations available
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Drivers need to start location tracking from the mobile app.
            </p>
          </div>
        </div>
      ) : (
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {driversWithLocation.map((driver) => (
            <Marker
              key={driver._id}
              position={[
                driver.currentLocation.lat,
                driver.currentLocation.lng,
              ]}
              icon={createCustomIcon(driver.status)}
            >
              <Popup>
                <div className="p-2" style={{ minWidth: "200px" }}>
                  <h3 className="font-bold text-lg mb-2">
                    {driver.userId?.name || "Driver"}
                  </h3>

                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(driver.status)}`}
                      >
                        {driver.status}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">License:</span>
                      <span className="font-medium">{driver.licenseNo}</span>
                    </div>

                    {driver.contact?.phone && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-medium">
                          {driver.contact.phone}
                        </span>
                      </div>
                    )}

                    {driver.assignedVehicle && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Vehicle:</span>
                        <span className="font-medium">
                          {driver.assignedVehicle.vehicleNo || "N/A"}
                        </span>
                      </div>
                    )}

                    <div className="pt-2 border-t mt-2">
                      <span className="text-gray-600 text-xs">
                        Last Updated:
                      </span>
                      <div className="text-xs font-medium">
                        {new Date(
                          driver.currentLocation.lastUpdated
                        ).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
}
