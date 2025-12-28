// src/hooks/useSocket.js
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuthStore } from "../store/authStore";

const SOCKET_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/v1\/?$/, "") ||
  "http://localhost:4000";

/**
 * Custom hook for Socket.IO real-time communication
 * Automatically connects/disconnects based on authentication state
 *
 * @returns {Object} Socket connection and state
 */
export function useSocket() {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuthStore();

  useEffect(() => {
    // Only connect if authenticated
    if (!token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setIsConnected(false);
      return;
    }

    // Initialize socket connection
    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    // Connection event handlers
    socketRef.current.on("connect", () => {
      console.log("[Socket] Connected:", socketRef.current.id);
      setIsConnected(true);
      setError(null);
    });

    socketRef.current.on("disconnect", (reason) => {
      console.log("[Socket] Disconnected:", reason);
      setIsConnected(false);
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("[Socket] Connection error:", err.message);
      setError(err.message);
      setIsConnected(false);
    });

    // Cleanup on unmount or token change
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [token]);

  /**
   * Subscribe to a socket event
   * @param {string} event - Event name
   * @param {Function} handler - Event handler function
   */
  const on = (event, handler) => {
    if (socketRef.current) {
      socketRef.current.on(event, handler);
    }
  };

  /**
   * Unsubscribe from a socket event
   * @param {string} event - Event name
   * @param {Function} handler - Event handler function
   */
  const off = (event, handler) => {
    if (socketRef.current) {
      socketRef.current.off(event, handler);
    }
  };

  /**
   * Emit a socket event
   * @param {string} event - Event name
   * @param {*} data - Event data
   * @param {Function} callback - Acknowledgment callback
   */
  const emit = (event, data, callback) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(event, data, callback);
    } else {
      console.warn("[Socket] Cannot emit - not connected");
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    error,
    on,
    off,
    emit,
  };
}

/**
 * Custom hook for listening to driver location updates
 * @param {Function} onLocationUpdate - Callback for location updates
 */
export function useDriverLocationUpdates(onLocationUpdate) {
  const { on, off, isConnected } = useSocket();

  useEffect(() => {
    if (!isConnected || !onLocationUpdate) return;

    const handleLocationUpdate = (data) => {
      console.log("[Socket] Driver location updated:", data);
      onLocationUpdate(data);
    };

    on("driver:location:updated", handleLocationUpdate);

    return () => {
      off("driver:location:updated", handleLocationUpdate);
    };
  }, [isConnected, onLocationUpdate, on, off]);
}

/**
 * Custom hook for listening to driver online/offline status
 * @param {Function} onStatusChange - Callback for status changes
 */
export function useDriverStatus(onStatusChange) {
  const { on, off, isConnected } = useSocket();

  useEffect(() => {
    if (!isConnected || !onStatusChange) return;

    const handleOnline = (data) => {
      console.log("[Socket] Driver online:", data);
      onStatusChange({ ...data, status: "online" });
    };

    const handleOffline = (data) => {
      console.log("[Socket] Driver offline:", data);
      onStatusChange({ ...data, status: "offline" });
    };

    on("driver:online", handleOnline);
    on("driver:offline", handleOffline);

    return () => {
      off("driver:online", handleOnline);
      off("driver:offline", handleOffline);
    };
  }, [isConnected, onStatusChange, on, off]);
}
