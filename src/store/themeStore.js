import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'dark', // default theme
      
      setTheme: (theme) => {
        set({ theme });
        // Update the data-theme attribute on the document element
        document.documentElement.setAttribute('data-theme', theme);
      },
      
      toggleTheme: () => {
        set((state) => {
          const newTheme = state.theme === 'dark' ? 'light' : 'dark';
          document.documentElement.setAttribute('data-theme', newTheme);
          return { theme: newTheme };
        });
      },
    }),
    {
      name: 'theme-storage', // localStorage key
      onRehydrateStorage: () => (state) => {
        // Apply theme on initial load
        if (state?.theme) {
          document.documentElement.setAttribute('data-theme', state.theme);
        }
      },
    }
  )
);
