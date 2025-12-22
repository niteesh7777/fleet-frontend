import { useState } from "react";
import { FiBell, FiX, FiCheck, FiTrash2 } from "react-icons/fi";
import { useNotificationStore } from "../store/notificationStore";
import { formatDistanceToNow } from "date-fns";

/**
 * Notification Center Component
 * Displays persistent notifications with actions
 */
export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = useNotificationStore();

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return "✅";
      case "warning":
        return "⚠️";
      case "error":
        return "❌";
      case "info":
      default:
        return "ℹ️";
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "success":
        return "border-green-500 bg-green-500/10";
      case "warning":
        return "border-yellow-500 bg-yellow-500/10";
      case "error":
        return "border-red-500 bg-red-500/10";
      case "info":
      default:
        return "border-blue-500 bg-blue-500/10";
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-lg shadow-2xl z-50 max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-primary)]">
              <h3 className="font-semibold text-[var(--text-primary)]">
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 text-sm text-[var(--text-secondary)]">
                    ({unreadCount} unread)
                  </span>
                )}
              </h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-700"
                    title="Mark all as read"
                  >
                    <FiCheck size={16} />
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-xs text-red-600 hover:text-red-700"
                    title="Clear all"
                  >
                    <FiTrash2 size={16} />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  <FiX size={18} />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="text-center py-12 text-[var(--text-secondary)]">
                  <FiBell size={48} className="mx-auto mb-4 opacity-30" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--border-primary)]">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-[var(--bg-secondary)] transition-colors ${
                        !notification.read
                          ? "border-l-4 " +
                            getNotificationColor(notification.type)
                          : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-[var(--text-primary)] text-sm">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-[var(--text-secondary)] mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-[var(--text-tertiary)] mt-2">
                            {formatDistanceToNow(
                              new Date(notification.timestamp),
                              {
                                addSuffix: true,
                              }
                            )}
                          </p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-blue-600 hover:text-blue-700"
                              title="Mark as read"
                            >
                              <FiCheck size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-red-600 hover:text-red-700"
                            title="Delete"
                          >
                            <FiX size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
