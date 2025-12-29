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
    // No need to manually set Authorization header
    // Backend will extract access token from httpOnly cookie
    // withCredentials: true ensures cookies are sent with requests
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

    // CRITICAL: Skip retry logic for logout and refresh endpoints to prevent infinite loops
    const isLogoutRequest = originalRequest.url?.includes("/auth/logout");
    const isRefreshRequest = originalRequest.url?.includes("/auth/refresh");
    const skipAuthRefresh = originalRequest.skipAuthRefresh;

    if (isLogoutRequest || isRefreshRequest || skipAuthRefresh) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      useAuthStore.getState().logout(false); // Don't show toast - we'll show unauthorized error
      showUnauthorizedError();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await api.post("/auth/refresh");
      return api(originalRequest);
    } catch (refreshError) {
      useAuthStore.getState().logout(false); // Don't show toast - we'll show unauthorized error
      showUnauthorizedError();
      return Promise.reject(refreshError);
    }
  }
);

export default api;
