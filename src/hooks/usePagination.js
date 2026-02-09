import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook for managing pagination state and API calls
 */
export function usePagination({
  apiCall,
  initialParams = {},
  defaultLimit = 10,
  enableAutoFetch = true,
}) {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: defaultLimit,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);

  // Fetch data from API
  const fetchData = useCallback(
    async (customParams = {}) => {
      setLoading(true);
      setError(null);

      try {
        const queryParams = {
          page: pagination.page,
          limit: pagination.limit,
          ...params,
          ...customParams,
        };

        // Remove undefined, null, and empty string values
        Object.keys(queryParams).forEach((key) => {
          if (
            queryParams[key] === undefined ||
            queryParams[key] === null ||
            queryParams[key] === ""
          ) {
            delete queryParams[key];
          }
        });

        const response = await apiCall(queryParams);

        if (response?.items && response?.pagination) {
          setData(response.items);
          setPagination(response.pagination);
        } else {
          // Fallback for non-paginated responses
          setData(response || []);
          setPagination((prev) => ({
            ...prev,
            total: (response || []).length,
            totalPages: 1,
          }));
        }
      } catch (err) {
        setError(err.message || "Failed to fetch data");
        setData([]);
        setPagination((prev) => ({
          ...prev,
          total: 0,
          totalPages: 0,
        }));
      } finally {
        setLoading(false);
      }
    },
    [apiCall, pagination.page, pagination.limit, params],
  );

  // Update pagination and fetch data
  const goToPage = useCallback(
    (page) => {
      if (
        page >= 1 &&
        page <= pagination.totalPages &&
        page !== pagination.page
      ) {
        setPagination((prev) => ({ ...prev, page }));
      }
    },
    [pagination.page, pagination.totalPages],
  );

  const changeLimit = useCallback(
    (newLimit) => {
      if (newLimit > 0 && newLimit !== pagination.limit) {
        setPagination((prev) => ({
          ...prev,
          limit: newLimit,
          page: 1, // Reset to first page when changing limit
        }));
      }
    },
    [pagination.limit],
  );

  const nextPage = useCallback(() => {
    if (pagination.hasNext) {
      goToPage(pagination.page + 1);
    }
  }, [pagination.hasNext, pagination.page, goToPage]);

  const prevPage = useCallback(() => {
    if (pagination.hasPrev) {
      goToPage(pagination.page - 1);
    }
  }, [pagination.hasPrev, pagination.page, goToPage]);

  const updateParams = useCallback((newParams) => {
    setParams((prev) => {
      const updated = { ...prev, ...newParams };
      // Remove keys with undefined values
      Object.keys(updated).forEach((key) => {
        if (updated[key] === undefined) {
          delete updated[key];
        }
      });
      return updated;
    });
    // Reset to first page when params change
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const reset = useCallback(() => {
    setPagination({
      total: 0,
      page: 1,
      limit: defaultLimit,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    });
    setParams(initialParams);
    setData([]);
    setError(null);
  }, [defaultLimit, initialParams]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // Auto-fetch when pagination or params change
  useEffect(() => {
    if (enableAutoFetch) {
      fetchData();
    }
  }, [fetchData, enableAutoFetch]);

  return {
    // Data state
    data,
    loading,
    error,

    // Pagination state
    pagination,

    // Pagination controls
    goToPage,
    nextPage,
    prevPage,
    changeLimit,

    // Parameter management
    params,
    updateParams,

    // Utility functions
    fetchData,
    refresh,
    reset,

    // Computed values
    isEmpty: !loading && data.length === 0,
    hasData: data.length > 0,
    currentPage: pagination.page,
    totalPages: pagination.totalPages,
    totalItems: pagination.total,
    itemsPerPage: pagination.limit,

    // Page info
    startItem: Math.max((pagination.page - 1) * pagination.limit + 1, 0),
    endItem: Math.min(pagination.page * pagination.limit, pagination.total),
  };
}
