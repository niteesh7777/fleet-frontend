import React from 'react';
import { Link } from 'react-router-dom';
import { FiLoader } from 'react-icons/fi';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const variants = {
    primary: 'bg-gradient-primary text-white hover:opacity-90 shadow-md hover:shadow-lg border-transparent',
    secondary: 'bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] border-[var(--border-primary)]',
    outline: 'bg-transparent border-[var(--border-primary)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]',
    ghost: 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] border-transparent shadow-none',
    danger: 'bg-[var(--danger)] text-white hover:bg-red-700 shadow-md hover:shadow-lg border-transparent',
};

const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
};

const Button = React.forwardRef(({
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled,
    href,
    to,
    children,
    icon,
    ...props
}, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed border';

    const classes = cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
    );

    const content = (
        <>
            {isLoading && <FiLoader className="animate-spin" />}
            {!isLoading && icon && <span className="text-current">{icon}</span>}
            {children}
        </>
    );

    if (to) {
        return (
            <Link to={to} className={classes} ref={ref} {...props}>
                {content}
            </Link>
        );
    }

    if (href) {
        return (
            <a href={href} className={classes} ref={ref} {...props}>
                {content}
            </a>
        );
    }

    return (
        <button
            ref={ref}
            className={classes}
            disabled={disabled || isLoading}
            {...props}
        >
            {content}
        </button>
    );
});

Button.displayName = 'Button';

export default Button;
