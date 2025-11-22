export default function LoadingSkeleton({ type = 'card', count = 1 }) {
    if (type === 'card') {
        return (
            <div className="space-y-4">
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="card animate-pulse">
                        <div className="flex items-start gap-4">
                            <div className="skeleton w-12 h-12 rounded-lg"></div>
                            <div className="flex-1 space-y-3">
                                <div className="skeleton h-4 w-3/4 rounded"></div>
                                <div className="skeleton h-3 w-1/2 rounded"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (type === 'table') {
        return (
            <div className="overflow-x-auto rounded-lg border border-[var(--border-primary)]">
                <table className="w-full">
                    <thead className="bg-[var(--bg-secondary)]">
                        <tr>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <th key={i} className="px-4 py-3 border-b border-[var(--border-primary)]">
                                    <div className="skeleton h-4 w-20 rounded"></div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: count }).map((_, i) => (
                            <tr key={i}>
                                {Array.from({ length: 5 }).map((_, j) => (
                                    <td key={j} className="px-4 py-3 border-b border-[var(--border-primary)]">
                                        <div className="skeleton h-4 w-full rounded"></div>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    if (type === 'stat') {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="card animate-pulse">
                        <div className="flex items-start gap-4">
                            <div className="skeleton w-14 h-14 rounded-xl"></div>
                            <div className="flex-1 space-y-2">
                                <div className="skeleton h-3 w-20 rounded"></div>
                                <div className="skeleton h-6 w-16 rounded"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // Default line skeleton
    return (
        <div className="space-y-2">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="skeleton h-4 w-full rounded"></div>
            ))}
        </div>
    );
}
