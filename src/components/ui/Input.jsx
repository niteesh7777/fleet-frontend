import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const Input = React.forwardRef(({ className, error, icon, ...props }, ref) => {
    return (
        <div className="relative w-full">
            {icon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--text-tertiary)]">
                    {icon}
                </div>
            )}
            <input
                className={cn(
                    "w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg py-2.5 px-4 transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    icon && "pl-10",
                    error && "border-[var(--danger)] focus:ring-[var(--danger)]",
                    className
                )}
                ref={ref}
                {...props}
            />
            {error && <p className="mt-1 text-xs text-[var(--danger)]">{error}</p>}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
