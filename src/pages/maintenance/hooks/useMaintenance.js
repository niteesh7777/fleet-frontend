import { useState, useEffect } from "react";
import api from "../../../api/axiosClient";
import toast from "react-hot-toast";

export default function useMaintenance() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMaintenance = async () => {
        try {
            setLoading(true);
            const res = await api.get("/maintenance");
            setLogs(res.data?.data?.maintenanceLogs || []);
        } catch (err) {
            toast.error("Failed to load maintenance logs");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchByVehicle = async (vehicleId) => {
        try {
            setLoading(true);
            const res = await api.get(`/maintenance/vehicle/${vehicleId}`);
            setLogs(res.data?.data?.maintenanceLogs || []);
        } catch (err) {
            toast.error("Failed to load vehicle maintenance logs");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const createMaintenance = async (payload) => {
        try {
            await api.post("/maintenance", payload);
            toast.success("Maintenance log created successfully!");
            fetchMaintenance();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create maintenance log");
            throw err;
        }
    };

    const updateMaintenance = async (id, payload) => {
        try {
            await api.put(`/maintenance/${id}`, payload);
            toast.success("Maintenance log updated successfully!");
            fetchMaintenance();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update maintenance log");
            throw err;
        }
    };

    const deleteMaintenance = async (id) => {
        try {
            await api.delete(`/maintenance/${id}`);
            toast.success("Maintenance log deleted successfully!");
            fetchMaintenance();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete maintenance log");
            throw err;
        }
    };

    useEffect(() => {
        fetchMaintenance();
    }, []);

    return {
        logs,
        loading,
        createMaintenance,
        updateMaintenance,
        deleteMaintenance,
        fetchByVehicle,
    };
}
