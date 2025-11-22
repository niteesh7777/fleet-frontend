import Badge from './Badge';

export default function StatusBadge({ status }) {
    const getStatusConfig = () => {
        // Vehicle statuses
        if (status === 'available') return { label: 'Available', variant: 'success' };
        if (status === 'in-trip') return { label: 'In Trip', variant: 'warning' };
        if (status === 'maintenance') return { label: 'Maintenance', variant: 'danger' };

        // Trip statuses
        if (status === 'scheduled') return { label: 'Scheduled', variant: 'info' };
        if (status === 'started') return { label: 'Started', variant: 'primary' };
        if (status === 'in-transit') return { label: 'In Transit', variant: 'warning' };
        if (status === 'completed') return { label: 'Completed', variant: 'success' };
        if (status === 'cancelled') return { label: 'Cancelled', variant: 'danger' };

        // Driver/User statuses
        if (status === 'active' || status === true) return { label: 'Active', variant: 'success' };
        if (status === 'inactive' || status === false) return { label: 'Inactive', variant: 'danger' };

        // Default
        return { label: status || 'Unknown', variant: 'neutral' };
    };

    const config = getStatusConfig();

    return (
        <Badge variant={config.variant}>
            {config.label}
        </Badge>
    );
}
