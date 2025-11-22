import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const Card = React.forwardRef(({ className, children, hover = false, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-xl p-6 shadow-sm transition-all duration-200",
                hover && "hover:shadow-lg hover:-translate-y-1",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
});

Card.displayName = 'Card';

export default Card;
