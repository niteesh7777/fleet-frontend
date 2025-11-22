import { FiInbox, FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';

export default function EmptyState({
    icon: Icon,
    title,
    description,
    action,
    type = 'default'
}) {
    // Default icons based on type
    const defaultIcons = {
        default: FiInbox,
        error: FiAlertCircle,
        success: FiCheckCircle,
        info: FiInfo,
    };

    const IconComponent = Icon || defaultIcons[type];

    return (
        <div className="empty-state py-12">
            <div className="empty-state-icon text-[var(--text-tertiary)]">
                <IconComponent size={64} />
            </div>

            <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                {title}
            </h3>

            {description && (
                <p className="text-[var(--text-secondary)] mb-6 max-w-md">
                    {description}
                </p>
            )}

            {action && (
                <div className="mt-4">
                    {action}
                </div>
            )}
        </div>
    );
}
