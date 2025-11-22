import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const variants = {
    success: 'bg-[var(--success-light)] text-[var(--success)]',
    warning: 'bg-[var(--warning-light)] text-[var(--warning)]',
    danger: 'bg-[var(--danger-light)] text-[var(--danger)]',
    info: 'bg-[var(--info-light)] text-[var(--info)]',
    primary: 'bg-[var(--primary-light)] text-[var(--primary)]',
    neutral: 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]',
};

const Badge = ({ className, variant = 'neutral', children, ...props }) => {
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
