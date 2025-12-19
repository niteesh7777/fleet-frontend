import React, { useState, useEffect, useCallback } from "react";
import {
  FiMapPin,
  FiClock,
  FiTruck,
  FiFlag,
  FiAlertCircle,
  FiNavigation,
  FiRefreshCw,
} from "react-icons/fi";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import useTripProgress from "../hooks/useTripProgress";

const STATUS_CONFIG = {
  pending: {
    icon: FiClock,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-200",
  },
  "in-progress": {
    icon: FiTruck,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-200",
  },
  delayed: {
    icon: FiAlertCircle,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    borderColor: "border-orange-200",
  },
  "at-waypoint": {
    icon: FiMapPin,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-200",
  },
  completed: {
    icon: FiFlag,
    color: "text-green-600",
    bgColor: "bg-green-100",
    borderColor: "border-green-200",
  },
  cancelled: {
    icon: FiAlertCircle,
    color: "text-red-600",
    bgColor: "bg-red-100",
    borderColor: "border-red-200",
  },
};

/**
 * Timeline component showing trip progress history
 */
export default function StatusTimeline({ trip, className = "", onRefresh }) {
  const [progressHistory, setProgressHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getTripProgress } = useTripProgress();

  const loadProgressHistory = useCallback(async () => {
    if (!trip?._id) return;

    try {
      setLoading(true);
      const history = await getTripProgress(trip._id);

      // If no history from API, create mock data for demonstration
      if (history.length === 0) {
        const mockHistory = createMockHistory(trip);
        setProgressHistory(mockHistory);
      } else {
        setProgressHistory(history);
      }
    } catch (error) {
      console.error("Failed to load progress history:", error);
      // Show mock data on error for demo purposes
      const mockHistory = createMockHistory(trip);
      setProgressHistory(mockHistory);
    } finally {
      setLoading(false);
    }
  }, [trip, getTripProgress]);

  // Create mock history for demonstration
  const createMockHistory = (trip) => {
    const now = new Date();
    const history = [
      {
        _id: "1",
        status: "pending",
        timestamp: new Date(now.getTime() - 7200000).toISOString(), // 2 hours ago
        currentLocation: {
          name: trip.route?.source?.name || "Origin",
          coordinates: [77.5946, 12.9716], // Bangalore coordinates
        },
        notes: "Trip created and assigned to driver",
        metadata: {},
      },
    ];

    if (
      ["in-progress", "delayed", "at-waypoint", "completed"].includes(
        trip.status
      )
    ) {
      history.unshift({
        _id: "2",
        status: "in-progress",
        timestamp: new Date(now.getTime() - 5400000).toISOString(), // 1.5 hours ago
        currentLocation: {
          name: "Highway Checkpoint",
          coordinates: [77.65, 13.05],
        },
        notes: "Journey started, all systems normal",
        metadata: {
          fuelLevel: 95,
          odometerReading: 125000,
          weatherConditions: "clear",
        },
      });
    }

    if (["delayed", "at-waypoint", "completed"].includes(trip.status)) {
      history.unshift({
        _id: "3",
        status: trip.status === "delayed" ? "delayed" : "at-waypoint",
        timestamp: new Date(now.getTime() - 1800000).toISOString(), // 30 minutes ago
        currentLocation: {
          name: trip.status === "delayed" ? "Traffic Junction" : "Rest Stop",
          coordinates: [77.7, 13.1],
        },
        notes:
          trip.status === "delayed"
            ? "Heavy traffic causing delays"
            : "Scheduled break at rest stop",
        metadata: {
          fuelLevel: 80,
          odometerReading: 125150,
          ...(trip.status === "delayed" && { delayReason: "Heavy traffic" }),
          ...(trip.status === "at-waypoint" && {
            waypointReached: "Highway Rest Stop",
          }),
        },
      });
    }

    if (trip.status === "completed") {
      history.unshift({
        _id: "4",
        status: "completed",
        timestamp: new Date(now.getTime() - 300000).toISOString(), // 5 minutes ago
        currentLocation: {
          name: trip.route?.destination?.name || "Destination",
          coordinates: [77.8, 13.2],
        },
        notes: "Trip completed successfully, cargo delivered",
        metadata: {
          fuelLevel: 65,
          odometerReading: 125300,
          deliveryConfirmed: true,
        },
      });
    }

    return history;
  };

  useEffect(() => {
    loadProgressHistory();
  }, [loadProgressHistory]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    let timeAgo;
    if (diffHours > 0) {
      timeAgo = `${diffHours}h ${diffMinutes}m ago`;
    } else if (diffMinutes > 0) {
      timeAgo = `${diffMinutes}m ago`;
    } else {
      timeAgo = "Just now";
    }

    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timeAgo,
    };
  };

  const handleRefresh = () => {
    loadProgressHistory();
    onRefresh?.();
  };

  if (!trip) return null;

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Trip Progress Timeline
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            {trip.tripCode} • {trip.route?.source?.name} →{" "}
            {trip.route?.destination?.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
              STATUS_CONFIG[trip.status]?.bgColor || "bg-gray-100"
            } ${STATUS_CONFIG[trip.status]?.color || "text-gray-800"}`}
          >
            {trip.status?.replace("-", " ").toUpperCase()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            icon={<FiRefreshCw size={14} />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : progressHistory.length === 0 ? (
        <div className="text-center py-8">
          <FiClock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-[var(--text-primary)] mb-2">
            No Progress Updates
          </h4>
          <p className="text-[var(--text-secondary)]">
            Progress updates will appear here as the trip advances.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {progressHistory.map((update, index) => {
            const config =
              STATUS_CONFIG[update.status] || STATUS_CONFIG.pending;
            const Icon = config.icon;
            const { date, time, timeAgo } = formatTimestamp(update.timestamp);
            const isLatest = index === 0;

            return (
              <div key={update._id} className="flex items-start gap-4">
                {/* Timeline Icon */}
                <div
                  className={`
                  relative shrink-0 w-10 h-10 rounded-full border-2 ${
                    config.bgColor
                  } ${config.borderColor}
                  flex items-center justify-center transition-all duration-200
                  ${
                    isLatest
                      ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900"
                      : ""
                  }
                `}
                >
                  <Icon className={`w-5 h-5 ${config.color}`} />
                  {index < progressHistory.length - 1 && (
                    <div className="absolute top-10 left-1/2 w-0.5 h-6 bg-gray-300 dark:bg-gray-600 transform -translate-x-1/2"></div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-[var(--text-primary)] capitalize">
                      {update.status.replace("-", " ")}
                    </span>
                    {isLatest && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        Current
                      </span>
                    )}
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1 text-sm text-[var(--text-secondary)] mb-2">
                    <FiMapPin className="w-4 h-4 shrink-0" />
                    <span className="truncate">
                      {update.currentLocation?.name || "Location not specified"}
                    </span>
                    {update.currentLocation?.coordinates && (
                      <Button
                        variant="ghost"
                        size="xs"
                        className="ml-1 p-0 h-auto text-blue-600 hover:text-blue-700"
                        onClick={() => {
                          const [lng, lat] = update.currentLocation.coordinates;
                          window.open(
                            `https://maps.google.com/?q=${lat},${lng}`,
                            "_blank"
                          );
                        }}
                        title="View on map"
                      >
                        <FiNavigation size={12} />
                      </Button>
                    )}
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-center gap-4 text-xs text-[var(--text-tertiary)] mb-2">
                    <span>
                      {date} at {time}
                    </span>
                    <span className="font-medium">{timeAgo}</span>
                  </div>

                  {/* Notes */}
                  {update.notes && (
                    <p className="text-sm text-[var(--text-secondary)] bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-2">
                      {update.notes}
                    </p>
                  )}

                  {/* Status-specific information */}
                  {update.metadata?.delayReason && (
                    <div className="text-sm text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/20 rounded-lg p-2 mb-2">
                      <FiAlertCircle className="inline w-4 h-4 mr-1" />
                      <strong>Delay:</strong> {update.metadata.delayReason}
                    </div>
                  )}

                  {update.metadata?.waypointReached && (
                    <div className="text-sm text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2 mb-2">
                      <FiMapPin className="inline w-4 h-4 mr-1" />
                      <strong>Waypoint:</strong>{" "}
                      {update.metadata.waypointReached}
                    </div>
                  )}

                  {/* Vehicle metrics */}
                  {(update.metadata?.fuelLevel ||
                    update.metadata?.odometerReading ||
                    update.metadata?.weatherConditions) && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-[var(--text-secondary)] mt-2">
                      {update.metadata.fuelLevel && (
                        <div className="flex items-center gap-1">
                          <FiTruck className="w-4 h-4 text-blue-600" />
                          <span>Fuel: {update.metadata.fuelLevel}%</span>
                        </div>
                      )}
                      {update.metadata.odometerReading && (
                        <div>
                          <strong>Odometer:</strong>{" "}
                          {update.metadata.odometerReading.toLocaleString()} km
                        </div>
                      )}
                      {update.metadata.weatherConditions && (
                        <div>
                          <strong>Weather:</strong>{" "}
                          {update.metadata.weatherConditions}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
