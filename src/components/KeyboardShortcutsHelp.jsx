import { useState, useEffect } from "react";
import Modal from "../components/ui/Modal";
import { keyboardShortcuts } from "../hooks/useKeyboardShortcuts";

/**
 * Keyboard shortcuts help modal
 * Shows available keyboard shortcuts to users
 */
export default function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleShowHelp = () => setIsOpen(true);
    document.addEventListener("showKeyboardHelp", handleShowHelp);
    return () =>
      document.removeEventListener("showKeyboardHelp", handleShowHelp);
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="⌨️ Keyboard Shortcuts"
      size="medium"
    >
      <div className="space-y-6">
        {keyboardShortcuts.map((category, idx) => (
          <div key={idx}>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
              {category.category}
            </h3>
            <div className="space-y-2">
              {category.shortcuts.map((shortcut, sidx) => (
                <div
                  key={sidx}
                  className="flex justify-between items-center py-2 px-3 bg-[var(--bg-secondary)] rounded"
                >
                  <span className="text-[var(--text-secondary)]">
                    {shortcut.description}
                  </span>
                  <div className="flex gap-1">
                    {shortcut.keys.map((key, kidx) => (
                      <kbd
                        key={kidx}
                        className="px-2 py-1 text-xs font-semibold text-[var(--text-primary)] bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded shadow"
                      >
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="pt-4 border-t border-[var(--border-primary)] text-center text-sm text-[var(--text-tertiary)]">
          Press{" "}
          <kbd className="px-2 py-1 bg-[var(--bg-secondary)] rounded">?</kbd> or{" "}
          <kbd className="px-2 py-1 bg-[var(--bg-secondary)] rounded">Ctrl</kbd>{" "}
          + <kbd className="px-2 py-1 bg-[var(--bg-secondary)] rounded">/</kbd>{" "}
          to show this help anytime
        </div>
      </div>
    </Modal>
  );
}
