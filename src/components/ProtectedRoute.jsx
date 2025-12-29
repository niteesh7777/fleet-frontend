import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";

export default function ProtectedRoute() {
  const { user, isInitialized, initializeAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(!isInitialized);

  useEffect(() => {
    const initialize = async () => {
      if (!isInitialized) {
        await initializeAuth();
      }
      setIsLoading(false);
    };

    initialize();
  }, [isInitialized, initializeAuth]);

  // Show loading while initializing auth state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // allow the route to render its children
}
