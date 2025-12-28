import React from "react";
import { cn } from "../../utils/cn";

const Input = React.forwardRef(({ className, error, icon, ...props }, ref) => {
  return (
    <div className="relative w-full">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-(--text-tertiary)">
          {icon}
        </div>
      )}
      <input
        className={cn(
          "w-full bg-(--bg-secondary) border border-(--border-primary) text-(--text-primary) rounded-lg py-2.5 px-4 transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-(--primary) focus:border-transparent",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          icon && "pl-10",
          error && "border-(--danger) focus:ring-(--danger)",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-(--danger)">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
