import React from "react";
import { cn } from "../../utils/cn";

const variants = {
  success: "bg-(--success-light) text-(--success)",
  warning: "bg-(--warning-light) text-(--warning)",
  danger: "bg-(--danger-light) text-(--danger)",
  info: "bg-(--info-light) text-(--info)",
  primary: "bg-(--primary-light) text-(--primary)",
  neutral: "bg-(--bg-tertiary) text-(--text-secondary)",
};

const Badge = ({ className, variant = "neutral", children, ...props }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
