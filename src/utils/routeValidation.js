/**
 * Frontend validation utilities for Route forms
 * Matches backend Joi schema validation
 */

// Valid vehicle types (must match backend enum)
export const VEHICLE_TYPES = ["Truck", "Mini Truck", "Trailer", "Van", "Other"];

/**
 * Validates a coordinate point (source/destination/waypoint)
 */
export const validatePoint = (point, fieldName = "Location") => {
  const errors = [];

  if (!point.name?.trim()) {
    errors.push(`${fieldName} name is required`);
  }

  if (!point.lat || isNaN(Number(point.lat))) {
    errors.push(`${fieldName} latitude is required and must be a valid number`);
  } else if (Math.abs(Number(point.lat)) > 90) {
    errors.push(`${fieldName} latitude must be between -90 and 90`);
  }

  if (!point.lng || isNaN(Number(point.lng))) {
    errors.push(
      `${fieldName} longitude is required and must be a valid number`
    );
  } else if (Math.abs(Number(point.lng)) > 180) {
    errors.push(`${fieldName} longitude must be between -180 and 180`);
  }

  return errors;
};

/**
 * Validates waypoint data
 */
export const validateWaypoint = (waypoint, index) => {
  const errors = validatePoint(waypoint, `Waypoint ${index + 1}`);

  if (
    waypoint.stopDurationMin !== undefined &&
    waypoint.stopDurationMin !== ""
  ) {
    const duration = Number(waypoint.stopDurationMin);
    if (isNaN(duration) || duration < 0) {
      errors.push(`Waypoint ${index + 1} stop duration must be 0 or greater`);
    }
  }

  return errors;
};

/**
 * Validates toll data
 */
export const validateToll = (toll, index) => {
  const errors = [];

  if (!toll.name?.trim()) {
    errors.push(`Toll ${index + 1} name is required`);
  }

  if (toll.cost !== undefined && toll.cost !== "") {
    const cost = Number(toll.cost);
    if (isNaN(cost) || cost < 0) {
      errors.push(`Toll ${index + 1} cost must be 0 or greater`);
    }
  }

  return errors;
};

/**
 * Validates vehicle types
 */
export const validateVehicleTypes = (types) => {
  const errors = [];

  if (types && types.length > 0) {
    const invalidTypes = types.filter((type) => !VEHICLE_TYPES.includes(type));
    if (invalidTypes.length > 0) {
      errors.push(`Invalid vehicle types: ${invalidTypes.join(", ")}`);
    }
  }

  return errors;
};

/**
 * Main route validation function
 */
export const validateRoute = (formData) => {
  const errors = [];

  // Route name validation
  if (!formData.name?.trim()) {
    errors.push("Route name is required");
  }

  // Source validation
  errors.push(...validatePoint(formData.source, "Source"));

  // Destination validation
  errors.push(...validatePoint(formData.destination, "Destination"));

  // Distance validation
  if (!formData.distanceKm || isNaN(Number(formData.distanceKm))) {
    errors.push("Distance is required and must be a valid number");
  } else if (Number(formData.distanceKm) < 1) {
    errors.push("Distance must be at least 1 km");
  }

  // Duration validation
  if (
    !formData.estimatedDurationHr ||
    isNaN(Number(formData.estimatedDurationHr))
  ) {
    errors.push("Estimated duration is required and must be a valid number");
  } else if (Number(formData.estimatedDurationHr) < 0.1) {
    errors.push("Estimated duration must be at least 0.1 hours");
  }

  // Waypoints validation
  if (formData.waypoints && formData.waypoints.length > 0) {
    formData.waypoints.forEach((waypoint, index) => {
      errors.push(...validateWaypoint(waypoint, index));
    });
  }

  // Tolls validation
  if (formData.tolls && formData.tolls.length > 0) {
    formData.tolls.forEach((toll, index) => {
      errors.push(...validateToll(toll, index));
    });
  }

  // Vehicle types validation
  if (formData.preferredVehicleTypes) {
    errors.push(...validateVehicleTypes(formData.preferredVehicleTypes));
  }

  return errors.filter(Boolean); // Remove empty strings
};

/**
 * Formats route data for API submission
 */
export const formatRouteData = (
  formData,
  waypoints = [],
  tolls = [],
  vehicleTypes = []
) => {
  return {
    name: formData.name?.trim(),
    source: {
      name: formData.source.name?.trim(),
      lat: Number(formData.source.lat),
      lng: Number(formData.source.lng),
    },
    destination: {
      name: formData.destination.name?.trim(),
      lat: Number(formData.destination.lat),
      lng: Number(formData.destination.lng),
    },
    waypoints: waypoints.map((wp) => ({
      name: wp.name?.trim(),
      lat: Number(wp.lat),
      lng: Number(wp.lng),
      stopDurationMin: Number(wp.stopDurationMin) || 0,
    })),
    distanceKm: Number(formData.distanceKm),
    estimatedDurationHr: Number(formData.estimatedDurationHr),
    tolls: tolls.map((toll) => ({
      name: toll.name?.trim(),
      cost: Number(toll.cost) || 0,
    })),
    preferredVehicleTypes: vehicleTypes,
  };
};

/**
 * Calculate total toll costs
 */
export const calculateTotalTolls = (tolls) => {
  return tolls.reduce((total, toll) => total + (Number(toll.cost) || 0), 0);
};

/**
 * Calculate estimated fuel cost based on distance
 * @param {number} distanceKm - Distance in kilometers
 * @param {number} fuelPricePerLiter - Current fuel price per liter
 * @param {number} mileage - Vehicle mileage in km/liter
 */
export const calculateEstimatedFuelCost = (
  distanceKm,
  fuelPricePerLiter = 100,
  mileage = 6
) => {
  return Math.round((distanceKm / mileage) * fuelPricePerLiter);
};

/**
 * Estimate total route cost
 */
export const calculateRouteEstimate = (
  route,
  fuelPricePerLiter = 100,
  mileage = 6
) => {
  const fuelCost = calculateEstimatedFuelCost(
    route.distanceKm,
    fuelPricePerLiter,
    mileage
  );
  const tollCost = calculateTotalTolls(route.tolls || []);

  return {
    fuelCost,
    tollCost,
    totalCost: fuelCost + tollCost,
    distanceKm: route.distanceKm,
    estimatedDurationHr: route.estimatedDurationHr,
  };
};
