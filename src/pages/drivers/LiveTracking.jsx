import React, { useState, useEffect } from "react";
import { driverApi } from "../../api/endpoints";
import DriverMap from "../../components/DriverMap";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

export default function LiveTracking() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [error, setError] = useState(null);

  const fetchDrivers = async () => {
    try {
      setError(null);
      const data = await driverApi.getAll();
      setDrivers(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Error fetching drivers:", error);
      setError("Failed to fetch driver locations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();

    // Auto-refresh every 30 seconds if enabled
    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchDrivers, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const driversWithLocation = drivers.filter(
    (d) => d.currentLocation?.lat && d.currentLocation?.lng
  );

  const activeDrivers = drivers.filter((d) => d.status === "active").length;
  const onTripDrivers = drivers.filter((d) => d.status === "on-trip").length;
  const inactiveDrivers = drivers.filter((d) => d.status === "inactive").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading driver locations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            Live Driver Tracking
          </h1>
          <p className="text-sm text-[var(--text-tertiary)] mt-1">
            Real-time location monitoring for all active drivers
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Auto-refresh (30s)</span>
          </label>
          <Button variant="primary" onClick={fetchDrivers} size="sm">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh Now
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Drivers</p>
              <p className="text-3xl font-bold text-gray-900">
                {drivers.length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-3xl font-bold text-green-600">
                {activeDrivers}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">On Trip</p>
              <p className="text-3xl font-bold text-red-600">{onTripDrivers}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Inactive</p>
              <p className="text-3xl font-bold text-gray-600">
                {inactiveDrivers}
              </p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
              <svg
                className="w-8 h-8 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Map */}
      <Card>
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Driver Locations
          </h2>
          <div className="text-sm text-gray-500">
            <span className="font-medium">{driversWithLocation.length}</span> of{" "}
            <span className="font-medium">{drivers.length}</span> drivers have
            active locations
          </div>
        </div>
        <DriverMap drivers={drivers} height="600px" />
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>On Trip</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-500"></div>
              <span>Inactive</span>
            </div>
          </div>
          <div>Last updated: {lastUpdate.toLocaleTimeString()}</div>
        </div>
      </Card>

      {/* Driver List */}
      <Card>
        <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">
          Driver Details
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  License
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Location Update
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {drivers.map((driver) => (
                <tr key={driver._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {driver.userId?.name || "N/A"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {driver.userId?.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        driver.status === "active"
                          ? "bg-green-100 text-green-800"
                          : driver.status === "on-trip"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {driver.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {driver.licenseNo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {driver.assignedVehicle?.vehicleNo || "Not assigned"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {driver.currentLocation?.lastUpdated ? (
                      <div>
                        <div>
                          {new Date(
                            driver.currentLocation.lastUpdated
                          ).toLocaleDateString()}
                        </div>
                        <div className="text-xs">
                          {new Date(
                            driver.currentLocation.lastUpdated
                          ).toLocaleTimeString()}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">No location data</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
