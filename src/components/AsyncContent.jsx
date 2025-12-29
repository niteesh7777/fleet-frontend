import LoadingSkeleton from "./ui/LoadingSkeleton";
import Button from "./ui/Button";

/**
 * Reusable async content wrapper
 * Handles loading, error, and empty states consistently
 *
 * @param {boolean} loading - Loading state
 * @param {string|Error} error - Error message or Error object
 * @param {ReactNode} skeleton - Custom loading skeleton (optional)
 * @param {ReactNode} emptyState - Custom empty state (optional)
 * @param {boolean} isEmpty - Whether content is empty
 * @param {Function} onRetry - Retry callback for error state
 * @param {ReactNode} children - Content to display when loaded
 *
 * @example
 * <AsyncContent
 *   loading={loading}
 *   error={error}
 *   isEmpty={data.length === 0}
 *   skeleton={<DriversSkeleton />}
 *   emptyState={<EmptyState message="No drivers found" />}
 *   onRetry={refresh}
 * >
 *   {data && <DriversTable data={data} />}
 * </AsyncContent>
 */
export default function AsyncContent({
  loading,
  error,
  skeleton,
  emptyState,
  isEmpty = false,
  onRetry,
  children,
  className = "",
}) {
  // Loading state
  if (loading) {
    return skeleton || <LoadingSkeleton count={5} />;
  }

  // Error state
  if (error) {
    const errorMessage =
      typeof error === "string" ? error : error?.message || "An error occurred";

    return (
      <div className={`p-6 ${className}`}>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="text-red-800 dark:text-red-200">
            <h3 className="font-medium text-lg mb-2">Error</h3>
            <p className="mb-4">{errorMessage}</p>
            {onRetry && (
              <Button onClick={onRetry} variant="danger" size="sm">
                Try Again
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (isEmpty && emptyState) {
    return <div className={className}>{emptyState}</div>;
  }

  // Content
  return <div className={className}>{children}</div>;
}
