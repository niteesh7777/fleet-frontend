import { useCallback, useEffect, useState } from "react";
import api from "../../../api/axiosClient";
import toast from "react-hot-toast";

const initialState = {
  drivers: [],
  vehicles: [],
  clients: [],
  routes: [],
};

export default function useAvailableResources(autoFetch = true) {
  const [resources, setResources] = useState(initialState);
  const [loading, setLoading] = useState(autoFetch);

  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/trips/available-resources");
      const payload = response.data?.data || response.data || {};
      setResources({
        drivers: payload.drivers || [],
        vehicles: payload.vehicles || [],
        clients: payload.clients || [],
        routes: payload.routes || [],
      });
    } catch (error) {
      console.error("Failed to load trip resources", error);
      toast.error("Unable to load available drivers, vehicles, or clients");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchResources();
    }
  }, [autoFetch, fetchResources]);

  return {
    ...resources,
    loading,
    refresh: fetchResources,
  };
}
