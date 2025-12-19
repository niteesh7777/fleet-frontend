/**
 * Trip status constants and transitions for the fleet management system
 */

export const TRIP_STATUSES = {
  PENDING: "pending",
  IN_PROGRESS: "in-progress",
  DELAYED: "delayed",
  AT_WAYPOINT: "at-waypoint",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const TRIP_STATUS_LABELS = {
  [TRIP_STATUSES.PENDING]: "Pending",
  [TRIP_STATUSES.IN_PROGRESS]: "In Progress",
  [TRIP_STATUSES.DELAYED]: "Delayed",
  [TRIP_STATUSES.AT_WAYPOINT]: "At Waypoint",
  [TRIP_STATUSES.COMPLETED]: "Completed",
  [TRIP_STATUSES.CANCELLED]: "Cancelled",
};

export const TRIP_STATUS_COLORS = {
  [TRIP_STATUSES.PENDING]: "bg-yellow-100 text-yellow-800",
  [TRIP_STATUSES.IN_PROGRESS]: "bg-blue-100 text-blue-800",
  [TRIP_STATUSES.DELAYED]: "bg-orange-100 text-orange-800",
  [TRIP_STATUSES.AT_WAYPOINT]: "bg-purple-100 text-purple-800",
  [TRIP_STATUSES.COMPLETED]: "bg-green-100 text-green-800",
  [TRIP_STATUSES.CANCELLED]: "bg-red-100 text-red-800",
};

/**
 * Valid status transitions for trip progress
 */
export const VALID_TRANSITIONS = {
  [TRIP_STATUSES.PENDING]: [TRIP_STATUSES.IN_PROGRESS, TRIP_STATUSES.CANCELLED],
  [TRIP_STATUSES.IN_PROGRESS]: [
    TRIP_STATUSES.DELAYED,
    TRIP_STATUSES.AT_WAYPOINT,
    TRIP_STATUSES.COMPLETED,
    TRIP_STATUSES.CANCELLED,
  ],
  [TRIP_STATUSES.DELAYED]: [
    TRIP_STATUSES.IN_PROGRESS,
    TRIP_STATUSES.AT_WAYPOINT,
    TRIP_STATUSES.COMPLETED,
    TRIP_STATUSES.CANCELLED,
  ],
  [TRIP_STATUSES.AT_WAYPOINT]: [
    TRIP_STATUSES.IN_PROGRESS,
    TRIP_STATUSES.DELAYED,
    TRIP_STATUSES.COMPLETED,
  ],
  [TRIP_STATUSES.COMPLETED]: [], // Terminal state
  [TRIP_STATUSES.CANCELLED]: [], // Terminal state
};

/**
 * Check if a status transition is valid
 */
export const isValidTransition = (fromStatus, toStatus) => {
  return VALID_TRANSITIONS[fromStatus]?.includes(toStatus) || false;
};

/**
 * Get available next statuses for a given current status
 */
export const getAvailableTransitions = (currentStatus) => {
  return VALID_TRANSITIONS[currentStatus] || [];
};
