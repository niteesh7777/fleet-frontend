import { useState, useEffect } from "react";
import api from "../../../api/axiosClient";
import toast from "react-hot-toast";
import { useAuthStore } from "../../../store/authStore";

export default function useTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  const fetchTrips = async (filters = {}) => {
    try {
      setLoading(true);
      // Check if user is a driver (vs owner/admin/manager)
      const endpoint =
        user?.companyRole === "company_driver" ? "/trips/my" : "/trips";
      const res = await api.get(endpoint, { params: filters });
      // Response structure: { items: [...], pagination: {...} }
      setTrips(res.data?.data?.items || []);
    } catch (err) {
      toast.error("Failed to load trips");
      console.error("Error fetching trips:", err);
    } finally {
      setLoading(false);
    }
  };

  const createTrip = async (payload) => {
    // Ensure driverIds and vehicleIds are arrays
    const finalPayload = {
      ...payload,
      driverIds: Array.isArray(payload.driverIds)
        ? payload.driverIds
        : [payload.driverIds].filter(Boolean),
      vehicleIds: Array.isArray(payload.vehicleIds)
        ? payload.vehicleIds
        : [payload.vehicleIds].filter(Boolean),
    };
    await api.post("/trips", finalPayload);
    toast.success("Trip created!");
    await fetchTrips();
  };

  const updateTrip = async (id, payload) => {
    await api.put(`/trips/${id}`, payload);
    toast.success("Trip updated!");
    await fetchTrips();
  };

  const deleteTrip = async (id) => {
    await api.delete(`/trips/${id}`);
    toast.success("Trip deleted!");
    await fetchTrips();
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return {
    trips,
    loading,
    fetchTrips,
    createTrip,
    updateTrip,
    deleteTrip,
  };
}
