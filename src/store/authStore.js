import { create } from "zustand";
import { persist } from "zustand/middleware";
import { showSessionExpired, showLogoutSuccess } from "../utils/toast";
import api from "../api/axiosClient";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isInitialized: false,
      isLoggingOut: false,

      setUser: (user) => set({ user }),
      setInitialized: (isInitialized) => set({ isInitialized }),

      logout: async (showToast = true) => {
        const state = get();

        // Prevent recursive logout calls
        if (state.isLoggingOut) {
          return;
        }

        set({ isLoggingOut: true });

        // Clear state immediately (security first)
        set({ user: null, isInitialized: true });

        // Try to call backend logout to clear httpOnly cookies (best effort)
        try {
          await api.post("/auth/logout", {}, { skipAuthRefresh: true });
        } catch (error) {
          // Silently fail - state is already cleared
        }

        set({ isLoggingOut: false });

        if (showToast) {
          showLogoutSuccess();
        }
      },

      // Initialize auth state - attempt token refresh if user exists
      initializeAuth: async () => {
        const state = get();
        if (state.isInitialized) return;

        // If user exists in localStorage, verify session is still valid
        if (state.user) {
          try {
            const response = await api.post("/auth/refresh");
            if (response.data?.success) {
              set({ isInitialized: true });
              return;
            }
          } catch (error) {
            // Session expired or invalid
          }
          set({ user: null, isInitialized: true });
          showSessionExpired();
        } else {
          set({ isInitialized: true });
        }
      },
    }),

    {
      name: "auth-storage", // localStorage key
      partialize: (state) => ({
        // Only store user info - tokens are in httpOnly cookies (XSS-safe)
        user: state.user, // ✅ Safe to persist
        // isInitialized is not persisted - always starts false
      }),
      // Don't set isInitialized in onRehydrateStorage
      // Let ProtectedRoute call initializeAuth() to verify session
    }
  )
);
