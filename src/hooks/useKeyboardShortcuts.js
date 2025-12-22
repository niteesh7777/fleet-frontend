import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Keyboard shortcuts hook
 * Provides common keyboard shortcuts for power users
 */
export default function useKeyboardShortcuts() {
  const navigate = useNavigate();

  const handleKeyPress = useCallback(
    (event) => {
      // Check for modifier keys (Ctrl/Cmd)
      const isMod = event.ctrlKey || event.metaKey;

      // Ignore if user is typing in input/textarea
      if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA" ||
        event.target.isContentEditable
      ) {
        return;
      }

      // Navigation shortcuts (Ctrl/Cmd + Key)
      if (isMod) {
        switch (event.key.toLowerCase()) {
          case "k": // Ctrl+K - Global search
            event.preventDefault();
            // Trigger global search (implement in components)
            document.dispatchEvent(new CustomEvent("openGlobalSearch"));
            break;

          case "h": // Ctrl+H - Home/Dashboard
            event.preventDefault();
            navigate("/dashboard");
            break;

          case "v": // Ctrl+V - Vehicles
            event.preventDefault();
            navigate("/dashboard/vehicles");
            break;

          case "d": // Ctrl+D - Drivers
            event.preventDefault();
            navigate("/dashboard/drivers");
            break;

          case "t": // Ctrl+T - Trips
            event.preventDefault();
            navigate("/dashboard/trips");
            break;

          case "r": // Ctrl+R - Routes (override default refresh)
            if (event.shiftKey) {
              event.preventDefault();
              navigate("/dashboard/routes");
            }
            break;

          case "m": // Ctrl+M - Maintenance
            event.preventDefault();
            navigate("/dashboard/maintenance");
            break;

          case "/": // Ctrl+/ - Keyboard shortcuts help
            event.preventDefault();
            document.dispatchEvent(new CustomEvent("showKeyboardHelp"));
            break;

          default:
            break;
        }
      }

      // Single key shortcuts (no modifier)
      if (!isMod && !event.shiftKey && !event.altKey) {
        switch (event.key) {
          case "?": // Show help
            event.preventDefault();
            document.dispatchEvent(new CustomEvent("showKeyboardHelp"));
            break;

          case "Escape": // Close modals/dialogs
            document.dispatchEvent(new CustomEvent("escapePressed"));
            break;

          default:
            break;
        }
      }
    },
    [navigate]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  return null;
}

/**
 * Keyboard shortcuts help modal content
 */
export const keyboardShortcuts = [
  {
    category: "Navigation",
    shortcuts: [
      { keys: ["Ctrl", "H"], description: "Go to Dashboard" },
      { keys: ["Ctrl", "V"], description: "Go to Vehicles" },
      { keys: ["Ctrl", "D"], description: "Go to Drivers" },
      { keys: ["Ctrl", "T"], description: "Go to Trips" },
      { keys: ["Ctrl", "Shift", "R"], description: "Go to Routes" },
      { keys: ["Ctrl", "M"], description: "Go to Maintenance" },
    ],
  },
  {
    category: "Actions",
    shortcuts: [
      { keys: ["Ctrl", "K"], description: "Open Global Search" },
      { keys: ["Ctrl", "/"], description: "Show Keyboard Shortcuts" },
      { keys: ["Esc"], description: "Close Modal/Dialog" },
      { keys: ["?"], description: "Show Help" },
    ],
  },
];
