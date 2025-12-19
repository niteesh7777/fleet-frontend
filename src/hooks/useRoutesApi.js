/**
 * Enhanced Routes API hook with better error handling and caching
 */
import { useState, useEffect, useCallback } from "react";
import api from "../api/axiosClient";
import toast from "react-hot-toast";

export default function useRoutesApi() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all routes
  const fetchRoutes = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      const res = await api.get("/routes");
      const routesData = res.data?.data?.routes || [];

      setRoutes(routesData);
      return routesData;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to load routes";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Fetch routes error:", err);
      return [];
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  // Fetch single route by ID
  const fetchRoute = useCallback(async (id) => {
    try {
      const res = await api.get(`/routes/${id}`);
      return res.data?.data?.route || null;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to load route";
      toast.error(errorMessage);
      console.error("Fetch route error:", err);
      throw err;
    }
  }, []);

  // Create new route
  const createRoute = useCallback(
    async (routeData) => {
      try {
        const res = await api.post("/routes", routeData);
        const newRoute = res.data?.data?.route;

        if (newRoute) {
          setRoutes((prev) => [...prev, newRoute]);
        } else {
          // Refetch if response doesn't include the new route
          await fetchRoutes(false);
        }

        toast.success("Route created successfully!");
        return newRoute;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to create route";
        toast.error(errorMessage);
        console.error("Create route error:", err);
        throw err;
      }
    },
    [fetchRoutes]
  );

  // Update existing route
  const updateRoute = useCallback(
    async (id, routeData) => {
      try {
        const res = await api.put(`/routes/${id}`, routeData);
        const updatedRoute = res.data?.data?.route;

        if (updatedRoute) {
          setRoutes((prev) =>
            prev.map((route) => (route._id === id ? updatedRoute : route))
          );
        } else {
          // Refetch if response doesn't include updated route
          await fetchRoutes(false);
        }

        toast.success("Route updated successfully!");
        return updatedRoute;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to update route";
        toast.error(errorMessage);
        console.error("Update route error:", err);
        throw err;
      }
    },
    [fetchRoutes]
  );

  // Delete route
  const deleteRoute = useCallback(async (id) => {
    try {
      await api.delete(`/routes/${id}`);

      setRoutes((prev) => prev.filter((route) => route._id !== id));
      toast.success("Route deleted successfully!");
      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete route";
      toast.error(errorMessage);
      console.error("Delete route error:", err);
      throw err;
    }
  }, []);

  // Search routes by query
  const searchRoutes = useCallback(
    (query) => {
      if (!query.trim()) return routes;

      const searchTerm = query.toLowerCase().trim();
      return routes.filter(
        (route) =>
          route.name?.toLowerCase().includes(searchTerm) ||
          route.source?.name?.toLowerCase().includes(searchTerm) ||
          route.destination?.name?.toLowerCase().includes(searchTerm) ||
          route.waypoints?.some((wp) =>
            wp.name?.toLowerCase().includes(searchTerm)
          )
      );
    },
    [routes]
  );

  // Filter routes by criteria
  const filterRoutes = useCallback(
    (filters) => {
      return routes.filter((route) => {
        if (
          filters.isActive !== undefined &&
          route.isActive !== filters.isActive
        ) {
          return false;
        }

        if (filters.minDistance && route.distanceKm < filters.minDistance) {
          return false;
        }

        if (filters.maxDistance && route.distanceKm > filters.maxDistance) {
          return false;
        }

        if (filters.vehicleTypes?.length > 0) {
          const hasMatchingVehicle = route.preferredVehicleTypes?.some((type) =>
            filters.vehicleTypes.includes(type)
          );
          if (!hasMatchingVehicle) return false;
        }

        return true;
      });
    },
    [routes]
  );

  // Get route statistics
  const getRouteStats = useCallback(() => {
    return {
      total: routes.length,
      active: routes.filter((r) => r.isActive).length,
      inactive: routes.filter((r) => !r.isActive).length,
      totalDistance: routes.reduce((sum, r) => sum + (r.distanceKm || 0), 0),
      averageDistance:
        routes.length > 0
          ? routes.reduce((sum, r) => sum + (r.distanceKm || 0), 0) /
            routes.length
          : 0,
    };
  }, [routes]);

  // Refresh routes data
  const refreshRoutes = useCallback(() => {
    return fetchRoutes(true);
  }, [fetchRoutes]);

  // Initial load
  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  return {
    // Data
    routes,
    loading,
    error,

    // CRUD operations
    createRoute,
    updateRoute,
    deleteRoute,
    fetchRoute,

    // Utilities
    searchRoutes,
    filterRoutes,
    refreshRoutes,
    getRouteStats,
  };
}
