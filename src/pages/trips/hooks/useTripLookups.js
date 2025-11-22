import { useState } from "react";
import api from "../../../api/axiosClient";
import toast from "react-hot-toast";

export default function useTripLookups() {
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [clients, setClients] = useState([]);

  const fetchAll = async () => {
    try {
      const [dRes, vRes, cRes] = await Promise.all([
        api.get("/drivers"),
        api.get("/vehicles"),
        api.get("/clients"),
      ]);

      setDrivers(dRes.data?.data?.drivers || []);
      setVehicles(vRes.data?.data?.vehicles || []);
      setClients(cRes.data?.data?.clients || []);
    } catch (err) {
      toast.error("Failed to load dropdown data");
    }
  };

  return { drivers, vehicles, clients, fetchAll };
}
