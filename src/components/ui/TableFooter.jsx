import React from "react";

/**
 * Table footer component with pagination and summary information
 */
export default function TableFooter({
  children,
  className = "",
  showBorder = true,
}) {
  return (
    <div
      className={`
        ${showBorder ? "border-t border-gray-200 dark:border-gray-700" : ""}
        bg-white dark:bg-gray-800 
        ${className}
      `.trim()}
    >
      {children}
    </div>
  );
}
