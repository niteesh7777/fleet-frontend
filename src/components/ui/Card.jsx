import React from "react";
import { cn } from "../../utils/cn";

const Card = React.forwardRef(
  ({ className, children, hover = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-(--bg-elevated) border border-(--border-primary) rounded-xl p-6 shadow-sm transition-all duration-200",
          hover && "hover:shadow-lg hover:-translate-y-1",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;
