import React from "react";
import Button from "./Button";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMoreHorizontal,
} from "react-icons/fi";

/**
 * Pagination controls component with comprehensive navigation
 */
export default function PaginationControls({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
  className = "",
  showItemsPerPage = true,
  showPageInfo = true,
  pageSizeOptions = [5, 10, 25, 50, 100],
}) {
  // Don't render if there's only one page and no items
  if (totalPages <= 1 && totalItems === 0) {
    return null;
  }

  const startItem = Math.max((currentPage - 1) * itemsPerPage + 1, 0);
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 7;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Complex logic for large page counts
      const sidePages = 2; // Pages to show on each side of current

      // Always include first page
      pages.push(1);

      // Calculate range around current page
      let start = Math.max(currentPage - sidePages, 2);
      let end = Math.min(currentPage + sidePages, totalPages - 1);

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push("...");
      }

      // Add pages around current
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push("...");
      }

      // Always include last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 ${className}`}
    >
      {/* Items per page selector */}
      {showItemsPerPage && (
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <span>Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange?.(parseInt(e.target.value))}
            className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 text-sm"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span>per page</span>
        </div>
      )}

      {/* Page info */}
      {showPageInfo && (
        <div className="text-sm text-[var(--text-secondary)]">
          {totalItems > 0 ? (
            <>
              Showing{" "}
              <span className="font-medium text-[var(--text-primary)]">
                {startItem}
              </span>{" "}
              to{" "}
              <span className="font-medium text-[var(--text-primary)]">
                {endItem}
              </span>{" "}
              of{" "}
              <span className="font-medium text-[var(--text-primary)]">
                {totalItems}
              </span>{" "}
              results
            </>
          ) : (
            "No results found"
          )}
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          {/* Previous button */}
          <Button
            variant="ghost"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => onPageChange?.(currentPage - 1)}
            icon={<FiChevronLeft size={16} />}
            className="px-2"
            title="Previous page"
          >
            Previous
          </Button>

          {/* Page numbers */}
          <div className="flex items-center gap-1 mx-2">
            {pageNumbers.map((page, index) => (
              <React.Fragment key={`${page}-${index}`}>
                {page === "..." ? (
                  <span className="px-2 py-1 text-[var(--text-tertiary)]">
                    <FiMoreHorizontal size={16} />
                  </span>
                ) : (
                  <Button
                    variant={page === currentPage ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => onPageChange?.(page)}
                    className={`px-3 py-1 min-w-[32px] ${
                      page === currentPage
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {page}
                  </Button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Next button */}
          <Button
            variant="ghost"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange?.(currentPage + 1)}
            icon={<FiChevronRight size={16} />}
            className="px-2"
            title="Next page"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
