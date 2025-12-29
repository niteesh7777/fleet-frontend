import { FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";

/**
 * Reusable page header component
 * Eliminates duplication of "flex items-center justify-between" pattern
 *
 * @param {string} title - Main heading text
 * @param {string} subtitle - Optional subtitle/description
 * @param {ReactNode} action - Optional action button(s) on the right
 * @param {Array<string|Object>} breadcrumbs - Optional breadcrumb navigation
 * @param {string} className - Additional CSS classes
 *
 * @example
 * <PageHeader
 *   title="Fleet Management"
 *   subtitle="Manage your vehicle fleet"
 *   action={<Button onClick={handleAdd}><FiPlus /> Add Vehicle</Button>}
 *   breadcrumbs={[
 *     { label: 'Dashboard', href: '/dashboard' },
 *     { label: 'Vehicles', href: '/dashboard/vehicles' }
 *   ]}
 * />
 */
export default function PageHeader({
  title,
  subtitle,
  action,
  breadcrumbs,
  className = "",
}) {
  return (
    <div className={`mb-6 ${className}`}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-3">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              {typeof crumb === "string" ? (
                <span>{crumb}</span>
              ) : crumb.href ? (
                <Link
                  to={crumb.href}
                  className="hover:text-[var(--primary)] transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span>{crumb.label}</span>
              )}
              {index < breadcrumbs.length - 1 && (
                <FiChevronRight
                  size={14}
                  className="text-[var(--text-tertiary)]"
                />
              )}
            </div>
          ))}
        </nav>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[var(--text-secondary)] mt-1">{subtitle}</p>
          )}
        </div>
        {action && <div className="flex items-center gap-3">{action}</div>}
      </div>
    </div>
  );
}
