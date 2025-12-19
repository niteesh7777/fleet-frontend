import axios from "axios";
import { useAuthStore } from "../store/authStore";
import {
  showNetworkError,
  showServerError,
  showUnauthorizedError,
} from "../utils/toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle network errors
    if (!error.response) {
      showNetworkError();
      return Promise.reject(error);
    }

    // Handle server errors (5xx)
    if (error.response.status >= 500) {
      showServerError();
      return Promise.reject(error);
    }

    // Handle 401 unauthorized
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      useAuthStore.getState().logout();
      showUnauthorizedError();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const refreshResponse = await api.post("/auth/refresh");
      const newAccessToken = refreshResponse.data.data.accessToken; // ✅ Fixed: correct path

      useAuthStore.getState().setToken(newAccessToken);
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      useAuthStore.getState().logout();
      showUnauthorizedError();
      return Promise.reject(refreshError);
    }
  }
);

export default api;
