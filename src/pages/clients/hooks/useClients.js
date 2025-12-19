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

export default function useClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await api.get("/clients");
      setClients(res.data?.data?.clients || []);
    } catch (err) {
      showFetchError("clients", err);
      console.error("Fetch clients error:", err);
    } finally {
      setLoading(false);
    }
  };

  const createClient = async (payload) => {
    try {
      await api.post("/clients", payload);
      showCreateSuccess("Client");
      fetchClients();
    } catch (err) {
      showCreateError("Client", err);
      throw err;
    }
  };

  const updateClient = async (id, payload) => {
    try {
      await api.put(`/clients/${id}`, payload);
      showUpdateSuccess("Client");
      fetchClients();
    } catch (err) {
      showUpdateError("Client", err);
      throw err;
    }
  };

  const deleteClient = async (id) => {
    try {
      await api.delete(`/clients/${id}`);
      showDeleteSuccess("Client");
      fetchClients();
    } catch (err) {
      showDeleteError("Client", err);
      throw err;
    }
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
