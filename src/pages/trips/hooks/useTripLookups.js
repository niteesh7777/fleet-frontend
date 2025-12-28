import { useState } from "react";
import api from "../../../api/axiosClient";
import toast from "react-hot-toast";

export default function useTripLookups() {
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [clients, setClients] = useState([]);
  const [routes, setRoutes] = useState([]); // ✅ ADD ROUTES STATE

  const fetchAll = async () => {
    try {
      const [dRes, vRes, cRes, rRes] = await Promise.all([
        api.get("/drivers"),
        api.get("/vehicles"),
        api.get("/clients"),
        api.get("/routes"), // ✅ ADD ROUTES
      ]);

      setDrivers(dRes.data?.data?.drivers || []);
      setVehicles(vRes.data?.data?.vehicles || []);
      setClients(cRes.data?.data?.clients || []);
      setRoutes(rRes.data?.data?.routes || []); // ✅ SET ROUTES
    } catch {
      toast.error("Failed to load dropdown data");
    }
  };

  return { drivers, vehicles, clients, routes, fetchAll }; // ✅ RETURN ROUTES
}
