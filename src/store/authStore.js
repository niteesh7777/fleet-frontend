import { create } from "zustand";
import { persist } from "zustand/middleware";
import { showSessionExpired, showLogoutSuccess } from "../utils/toast";
import api from "../api/axiosClient";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isInitialized: false,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setInitialized: (isInitialized) => set({ isInitialized }),

      logout: () => {
        set({ user: null, token: null, isInitialized: true });
        showLogoutSuccess();
      },

      // Initialize auth state - attempt token refresh if user exists but no token
      initializeAuth: async () => {
        const state = get();
        if (state.isInitialized) return;

        // Token is now persisted in localStorage, so it should be available after rehydration
        // Only try to refresh if user exists but still no token (shouldn't happen now)
        if (state.user && !state.token) {
          try {
            const response = await api.post("/auth/refresh");

            if (response.data?.success) {
              set({
                token: response.data.data.accessToken,
                isInitialized: true,
              });
              return;
            }
          } catch (error) {
            console.log(
              "Auto-refresh failed:",
              error.response?.data?.message || error.message
            );
          }

          // If refresh fails, clear user and redirect to login
          set({ user: null, token: null, isInitialized: true });
          showSessionExpired();
        } else {
          set({ isInitialized: true });
        }
      },
    }),

    {
      name: "auth-storage", // localStorage key
      partialize: (state) => ({
        // Store token in localStorage despite XSS concerns - needed for persistent auth
        // In production, use HTTP-only cookies instead
        token: state.token, // ✅ Store token for persistent sessions
        user: state.user, // ✅ Safe to persist
        // isInitialized is not persisted - always starts false
      }),
    }
  )
);
