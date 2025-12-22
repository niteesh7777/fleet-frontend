import { Fragment } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  fullScreen = false,
}) => {
  if (!isOpen) return null;

  const sizeClasses = fullScreen
    ? "w-full h-full max-w-full max-h-full rounded-none"
    : "w-full max-w-lg max-h-[90vh]";

  const containerClasses = fullScreen
    ? "fixed inset-0 flex items-start justify-start z-50 pointer-events-none"
    : "fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4";

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          <div className={containerClasses}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={cn(
                `bg-[var(--bg-elevated)] border border-[var(--border-primary)] shadow-2xl pointer-events-auto flex flex-col ${sizeClasses}`,
                className
              )}
            >
              <div className="flex items-center justify-between p-6 border-b border-[var(--border-primary)]">
                <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors p-1 rounded-md hover:bg-[var(--bg-secondary)]"
                >
                  <FiX size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto">{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Modal;
