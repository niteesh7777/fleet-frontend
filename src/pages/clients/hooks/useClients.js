import { useState, useEffect } from "react";
import api from "../../../api/axiosClient";
import toast from "react-hot-toast";

export default function useClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await api.get("/clients");
      setClients(res.data?.data?.clients || []);
    } catch (err) {
      toast.error("Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  const createClient = async (payload) => {
    await api.post("/clients", payload);
    toast.success("Client created!");
    fetchClients();
  };

  const updateClient = async (id, payload) => {
    await api.put(`/clients/${id}`, payload);
    toast.success("Client updated!");
    fetchClients();
  };

  const deleteClient = async (id) => {
    await api.delete(`/clients/${id}`);
    toast.success("Client deleted!");
    fetchClients();
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    loading,
    createClient,
    updateClient,
    deleteClient,
  };
}
