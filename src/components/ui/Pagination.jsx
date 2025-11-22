import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage = 10,
    totalItems = 0
}) {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border-primary)] bg-[var(--bg-elevated)]">
            <div className="flex-1 flex justify-between sm:hidden">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-[var(--text-primary)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Previous
                </button>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-[var(--text-primary)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Next
                </button>
            </div>

            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-[var(--text-secondary)]">
                        Showing <span className="font-medium text-[var(--text-primary)]">{startItem}</span> to{' '}
                        <span className="font-medium text-[var(--text-primary)]">{endItem}</span> of{' '}
                        <span className="font-medium text-[var(--text-primary)]">{totalItems}</span> results
                    </p>
                </div>

                <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-[var(--border-primary)] bg-[var(--bg-elevated)] text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <span className="sr-only">Previous</span>
                            <FiChevronLeft size={20} />
                        </button>

                        {startPage > 1 && (
                            <>
                                <button
                                    onClick={() => onPageChange(1)}
                                    className="relative inline-flex items-center px-4 py-2 border border-[var(--border-primary)] bg-[var(--bg-elevated)] text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
                                >
                                    1
                                </button>
                                {startPage > 2 && (
                                    <span className="relative inline-flex items-center px-4 py-2 border border-[var(--border-primary)] bg-[var(--bg-elevated)] text-sm font-medium text-[var(--text-secondary)]">
                                        ...
                                    </span>
                                )}
                            </>
                        )}

                        {pages.map((page) => (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${page === currentPage
                                    ? 'z-10 bg-[var(--primary)] border-[var(--primary)] text-white'
                                    : 'border-[var(--border-primary)] bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                        {endPage < totalPages && (
                            <>
                                {endPage < totalPages - 1 && (
                                    <span className="relative inline-flex items-center px-4 py-2 border border-[var(--border-primary)] bg-[var(--bg-elevated)] text-sm font-medium text-[var(--text-secondary)]">
                                        ...
                                    </span>
                                )}
                                <button
                                    onClick={() => onPageChange(totalPages)}
                                    className="relative inline-flex items-center px-4 py-2 border border-[var(--border-primary)] bg-[var(--bg-elevated)] text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors"
                                >
                                    {totalPages}
                                </button>
                            </>
                        )}

                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-[var(--border-primary)] bg-[var(--bg-elevated)] text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <span className="sr-only">Next</span>
                            <FiChevronRight size={20} />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
}
