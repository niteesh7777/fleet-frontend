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

        // If user exists but no token (page refresh), try to get new token
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
        // SECURITY: Never persist access tokens in localStorage (XSS risk)
        // token: state.token, // ❌ Removed - stored in memory only
        user: state.user, // ✅ Safe to persist
        // isInitialized is not persisted - always starts false
      }),
    }
  )
);
