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
    const state = useAuthStore.getState();
    const token = state.token;

    // Endpoints that don't require authentication
    const publicEndpoints = [
      "/auth/login",
      "/auth/register",
      "/auth/refresh",
      "/platform/auth/signup",
    ];
    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      config.url?.startsWith(endpoint)
    );

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (!isPublicEndpoint && state.user) {
      // Warn only if user is logged in but token is missing for protected endpoints
      console.warn(
        "[API] No token available for protected request:",
        config.url,
        "User:",
        state.user?.name
      );
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

    console.warn("[API] 401 Error - Attempting token refresh", {
      url: originalRequest.url,
      hasToken: !!useAuthStore.getState().token,
    });

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
      console.error(
        "[API] Token refresh failed:",
        refreshError.response?.data?.message
      );
      useAuthStore.getState().logout();
      showUnauthorizedError();
      return Promise.reject(refreshError);
    }
  }
);

export default api;
