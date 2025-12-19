import { useState, useEffect } from "react";
import api from "../../../api/axiosClient";
import {
  showCreateSuccess,
  showUpdateSuccess,
  showDeleteSuccess,
  showCreateError,
  showUpdateError,
  showDeleteError,
  showFetchError,
} from "../../../utils/toast";

export default function useDrivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/drivers");
      setDrivers(res.data?.data?.drivers || []);
    } catch (err) {
      showFetchError("drivers", err);
      console.error("Fetch drivers error:", err);
    } finally {
      setLoading(false);
    }
  };

  const createDriver = async (payload) => {
    try {
      await api.post("/admin/drivers", payload);
      showCreateSuccess("Driver");
      fetchDrivers();
    } catch (err) {
      showCreateError("Driver", err);
      throw err;
    }
  };

  const updateDriver = async (id, payload) => {
    try {
      await api.put(`/drivers/${id}`, payload);
      showUpdateSuccess("Driver");
      fetchDrivers();
    } catch (err) {
      showUpdateError("Driver", err);
      throw err;
    }
  };

  const deleteDriver = async (id) => {
    try {
      await api.delete(`/drivers/${id}`);
      showDeleteSuccess("Driver");
      fetchDrivers();
    } catch (err) {
      showDeleteError("Driver", err);
      throw err;
    }
  };

  const deactivateDriver = async (id, reason) => {
    try {
      await api.put(`/drivers/${id}/deactivate`, { reason });
      showUpdateSuccess("Driver status");
      fetchDrivers();
    } catch (err) {
      showUpdateError("Driver status", err);
      throw err;
    }
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
