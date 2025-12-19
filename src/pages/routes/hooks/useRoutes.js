import { useState, useEffect } from "react";
import api from "../../../api/axiosClient";
import toast from "react-hot-toast";

export default function useRoutes() {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRoutes = async () => {
        try {
            setLoading(true);
            const res = await api.get("/routes");
            setRoutes(res.data?.data?.routes || []);
        } catch (err) {
            toast.error("Failed to load routes");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const createRoute = async (payload) => {
        try {
            await api.post("/routes", payload);
            toast.success("Route created successfully!");
            fetchRoutes();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create route");
            throw err;
        }
    };

    const updateRoute = async (id, payload) => {
        try {
            await api.put(`/routes/${id}`, payload);
            toast.success("Route updated successfully!");
            fetchRoutes();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update route");
            throw err;
        }
    };

    const deleteRoute = async (id) => {
        try {
            await api.delete(`/routes/${id}`);
            toast.success("Route deleted successfully!");
            fetchRoutes();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete route");
            throw err;
        }
    };

    useEffect(() => {
        fetchRoutes();
    }, []);

    return {
        routes,
        loading,
        createRoute,
        updateRoute,
        deleteRoute,
    };
}
