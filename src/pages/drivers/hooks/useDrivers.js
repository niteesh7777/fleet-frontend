import { useState, useEffect } from "react";
import api from "../../../api/axiosClient";
import toast from "react-hot-toast";

export default function useDrivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/drivers");
      setDrivers(res.data?.data?.drivers || []);
    } catch (err) {
      toast.error("Failed to load drivers");
    } finally {
      setLoading(false);
    }
  };

  const createDriver = async (payload) => {
    await api.post("/admin/drivers", payload);
    toast.success("Driver created successfully!");
    fetchDrivers();
  };

  const updateDriver = async (id, payload) => {
    await api.put(`/drivers/${id}`, payload);
    toast.success("Driver updated successfully!");
    fetchDrivers();
  };

  const deleteDriver = async (id) => {
    await api.delete(`/drivers/${id}`);
    toast.success("Driver deleted successfully!");
    fetchDrivers();
  };

  const deactivateDriver = async (id, reason) => {
    await api.put(`/drivers/${id}/deactivate`, { reason });
    toast.success("Driver deactivated!");
    fetchDrivers();
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  return {
    drivers,
    loading,
    createDriver,
    updateDriver,
    deleteDriver,
    deactivateDriver,
    fetchDrivers,
  };
}
