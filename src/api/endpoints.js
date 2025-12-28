import api from "./axiosClient";

/**
 * Vehicle API functions with pagination support
 */
export const vehicleApi = {
  // Get all vehicles (non-paginated)
  getAll: async () => {
    const response = await api.get("/vehicles");
    return response.data?.data?.vehicles || [];
  },

  // Get vehicles with pagination
  getAllPaginated: async (params = {}) => {
    const response = await api.get("/vehicles/paginated", { params });
    return response.data?.data || { items: [], pagination: {} };
  },

  // Get single vehicle
  getById: async (id) => {
    const response = await api.get(`/vehicles/${id}`);
    return response.data?.data?.vehicle;
  },

  // Create vehicle
  create: async (data) => {
    const response = await api.post("/vehicles", data);
    return response.data?.data?.vehicle;
  },

  // Update vehicle
  update: async (id, data) => {
    const response = await api.put(`/vehicles/${id}`, data);
    return response.data?.data?.vehicle;
  },

  // Delete vehicle
  delete: async (id) => {
    const response = await api.delete(`/vehicles/${id}`);
    return response.data?.data?.vehicle;
  },

  // Assign driver to vehicle
  assignDriver: async (vehicleId, driverId) => {
    const response = await api.post(`/vehicles/${vehicleId}/assign-driver`, {
      driverId,
    });
    return response.data?.data?.vehicle;
  },

  // Remove driver from vehicle
  removeDriver: async (vehicleId, driverId) => {
    const response = await api.post(`/vehicles/${vehicleId}/remove-driver`, {
      driverId,
    });
    return response.data?.data?.vehicle;
  },
};

/**
 * Driver API functions with pagination support
 */
export const driverApi = {
  // Get all drivers (non-paginated)
  getAll: async () => {
    const response = await api.get("/drivers");
    return response.data?.data?.drivers || [];
  },

  // Get drivers with pagination
  getAllPaginated: async (params = {}) => {
    const response = await api.get("/drivers/paginated", { params });
    return response.data?.data || { items: [], pagination: {} };
  },

  // Get single driver
  getById: async (id) => {
    const response = await api.get(`/drivers/${id}`);
    return response.data?.data?.driver;
  },

  // Create driver
  create: async (data) => {
    const response = await api.post("/drivers", data);
    return response.data?.data?.driver;
  },

  // Update driver
  update: async (id, data) => {
    const response = await api.put(`/drivers/${id}`, data);
    return response.data?.data?.driver;
  },

  // Delete driver
  delete: async (id) => {
    const response = await api.delete(`/drivers/${id}`);
    return response.data?.data?.driver;
  },
};

/**
 * Client API functions with pagination support
 */
export const clientApi = {
  // Get all clients (non-paginated)
  getAll: async () => {
    const response = await api.get("/clients");
    return response.data?.data?.clients || [];
  },

  // Get clients with pagination
  getAllPaginated: async (params = {}) => {
    const response = await api.get("/clients/paginated", { params });
    return response.data?.data || { items: [], pagination: {} };
  },

  // Get single client
  getById: async (id) => {
    const response = await api.get(`/clients/${id}`);
    return response.data?.data?.client;
  },

  // Create client
  create: async (data) => {
    const response = await api.post("/clients", data);
    return response.data?.data?.client;
  },

  // Update client
  update: async (id, data) => {
    const response = await api.put(`/clients/${id}`, data);
    return response.data?.data?.client;
  },

  // Delete client
  delete: async (id) => {
    const response = await api.delete(`/clients/${id}`);
    return response.data?.data?.client;
  },
};

/**
 * Trip API functions with pagination support
 */
export const tripApi = {
  // Get all trips (non-paginated)
  getAll: async () => {
    const response = await api.get("/trips");
    return response.data?.data?.trips || [];
  },

  // Get trips with pagination
  getAllPaginated: async (params = {}) => {
    const response = await api.get("/trips/paginated", { params });
    return response.data?.data || { items: [], pagination: {} };
  },

  // Get single trip
  getById: async (id) => {
    const response = await api.get(`/trips/${id}`);
    return response.data?.data?.trip;
  },

  // Create trip
  create: async (data) => {
    const response = await api.post("/trips", data);
    return response.data?.data?.trip;
  },

  // Update trip
  update: async (id, data) => {
    const response = await api.put(`/trips/${id}`, data);
    return response.data?.data?.trip;
  },

  // Delete trip
  delete: async (id) => {
    const response = await api.delete(`/trips/${id}`);
    return response.data?.data?.trip;
  },

  // Update trip progress
  updateProgress: async (id, progressData) => {
    const response = await api.post(`/trips/${id}/progress`, progressData);
    return response.data?.data?.trip;
  },

  // Complete trip
  complete: async (id, completionData) => {
    const response = await api.post(`/trips/${id}/complete`, completionData);
    return response.data?.data?.trip;
  },
};

/**
 * Route API functions with pagination support
 */
export const routeApi = {
  // Get all routes (non-paginated)
  getAll: async () => {
    const response = await api.get("/routes");
    return response.data?.data?.routes || [];
  },

  // Get routes with pagination
  getAllPaginated: async (params = {}) => {
    const response = await api.get("/routes/paginated", { params });
    return response.data?.data || { items: [], pagination: {} };
  },

  // Get single route
  getById: async (id) => {
    const response = await api.get(`/routes/${id}`);
    return response.data?.data?.route;
  },

  // Create route
  create: async (data) => {
    const response = await api.post("/routes", data);
    return response.data?.data?.route;
  },

  // Update route
  update: async (id, data) => {
    const response = await api.put(`/routes/${id}`, data);
    return response.data?.data?.route;
  },

  // Delete route
  delete: async (id) => {
    const response = await api.delete(`/routes/${id}`);
    return response.data?.data?.route;
  },
};

/**
 * Maintenance API functions with pagination support
 */
export const maintenanceApi = {
  // Get all maintenance logs (non-paginated)
  getAll: async () => {
    const response = await api.get("/maintenance");
    return response.data?.data?.maintenanceLogs || [];
  },

  // Get maintenance logs with pagination
  getAllPaginated: async (params = {}) => {
    const response = await api.get("/maintenance/paginated", { params });
    return response.data?.data || { items: [], pagination: {} };
  },

  // Get single maintenance log
  getById: async (id) => {
    const response = await api.get(`/maintenance/${id}`);
    return response.data?.data?.maintenanceLog;
  },

  // Create maintenance log
  create: async (data) => {
    const response = await api.post("/maintenance", data);
    return response.data?.data?.maintenanceLog;
  },

  // Update maintenance log
  update: async (id, data) => {
    const response = await api.put(`/maintenance/${id}`, data);
    return response.data?.data?.maintenanceLog;
  },

  // Delete maintenance log
  delete: async (id) => {
    const response = await api.delete(`/maintenance/${id}`);
    return response.data?.data?.maintenanceLog;
  },
};

/**
 * Authentication API functions
 */
export const authApi = {
  // Company user login
  login: async (email, password, companySlug) => {
    const response = await api.post("/auth/login", {
      email,
      password,
      companySlug,
    });
    return response.data?.data;
  },

  // Platform signup (company onboarding)
  platformSignup: async (data) => {
    const response = await api.post("/platform/auth/signup", data);
    return response.data?.data;
  },

  // Token refresh
  refresh: async () => {
    const response = await api.post("/auth/refresh");
    return response.data?.data;
  },
};
