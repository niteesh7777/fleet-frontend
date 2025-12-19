import { useState, useEffect } from "react";
import api from "../api/axiosClient";

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/profile");
      setProfile(response.data.data);
    } catch (err) {
      setError(err);
      console.error("Failed to fetch profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data) => {
    const response = await api.put("/profile", data);
    setProfile(response.data.data);
    return response.data;
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    updateProfile,
  };
};
