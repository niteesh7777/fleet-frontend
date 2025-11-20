import { useState, useEffect } from "react";
import api from "../../../api/axiosClient";
import toast from "react-hot-toast";

export default function useTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const res = await api.get("/trips");
      setTrips(res.data?.data?.trips || []);
    } catch (err) {
      toast.error("Failed to load trips");
    } finally {
      setLoading(false);
    }
  };

  const createTrip = async (payload) => {
    await api.post("/trips", payload);
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
