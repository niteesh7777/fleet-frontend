import { useState } from "react";
import StatusBadge from "../../components/ui/StatusBadge";
import LoadingSkeleton from "../../components/ui/LoadingSkeleton";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Card from "../../components/ui/Card";
import PaginationControls from "../../components/ui/PaginationControls";
import TableFooter from "../../components/ui/TableFooter";
import SearchAndFilter from "../../components/common/SearchAndFilter";
import { tripApi } from "../../api/endpoints";
import { usePagination } from "../../hooks/usePagination";
import { FiPlus, FiEdit2, FiTrash2, FiMapPin } from "react-icons/fi";
import { formatDate } from "../../utils/dateUtils";

export default function TripsPaginated() {
  // Pagination hook setup
  const {
    data: trips,
    loading,
    error,
    pagination,
    goToPage,
    changeLimit,
    updateParams,
    refresh,
  } = usePagination({
    apiCall: tripApi.getAllPaginated,
    defaultLimit: 10,
  });

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);

  // Filter configuration
  const filterConfig = [
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "planned", label: "Planned" },
        { value: "in-progress", label: "In Progress" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
      ],
    },
    {
      key: "clientId",
      label: "Client",
      type: "input",
      placeholder: "Search by client name",
    },
    {
      key: "dateRange",
      label: "Date Range",
      type: "dateRange",
    },
  ];

  // Handle search and filter
  const handleSearch = (searchTerm) => {
    updateParams({ search: searchTerm });
  };

  const handleFilter = (filters) => {
    // If filters is empty, explicitly clear all filter keys
    if (Object.keys(filters).length === 0) {
      // Get all filter keys from filterConfig (including nested keys for dateRange)
      const filterKeys = filterConfig.flatMap((f) => {
        if (f.type === "dateRange") {
          return [`${f.key}_from`, `${f.key}_to`];
        }
        return [f.key];
      });
      const clearedFilters = {};
      filterKeys.forEach((key) => {
        clearedFilters[key] = undefined;
      });
      updateParams(clearedFilters);
    } else {
      updateParams(filters);
    }
  };

  // CRUD handlers
  const handleEdit = (trip) => {
    setSelectedTrip(trip);
    setEditModalOpen(true);
  };

  const handleDelete = (trip) => {
    setSelectedTrip(trip);
    setDeleteModalOpen(true);
  };

  const handleProgress = (trip) => {
    setSelectedTrip(trip);
    setShowProgressModal(true);
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "planned":
        return "info";
      case "in-progress":
        return "warning";
      case "completed":
        return "success";
      case "cancelled":
        return "danger";
      default:
        return "secondary";
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">
            <h3 className="font-medium">Error loading trips</h3>
            <p className="mt-1">{error}</p>
            <Button onClick={refresh} className="mt-2">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Trip Management
        </h1>
        <Button
          onClick={() => setShowAddModal(true)}
          icon={<FiPlus />}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Create Trip
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <SearchAndFilter
          onSearch={handleSearch}
          onFilter={handleFilter}
          searchPlaceholder="Search by trip code, client, route..."
          filters={filterConfig}
        />
      </Card>

      {/* Trips Table */}
      <Card>
        {loading ? (
          <LoadingSkeleton count={5} />
        ) : trips.length === 0 ? (
          <EmptyState
            title="No trips found"
            description="Get started by creating your first trip"
            actionLabel="Create Trip"
            onAction={() => setShowAddModal(true)}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Trip Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Route
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Schedule
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {trips.map((trip) => (
                    <tr
                      key={trip._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {trip.tripCode}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {trip.clientId?.name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {trip.clientId?.type || ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {trip.routeId?.name || "N/A"}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <FiMapPin size={12} />
                          {trip.routeId?.distanceKm || 0} km
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge
                          status={trip.status}
                          variant={getStatusVariant(trip.status)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div>Start: {formatDate(trip.startTime)}</div>
                        {trip.endTime && (
                          <div>End: {formatDate(trip.endTime)}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleProgress(trip)}
                            title="Update Progress"
                          >
                            Progress
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(trip)}
                            icon={<FiEdit2 size={16} />}
                            title="Edit Trip"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(trip)}
                            icon={<FiTrash2 size={16} />}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Delete Trip"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <TableFooter>
              <PaginationControls
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                totalItems={pagination.total}
                itemsPerPage={pagination.limit}
                onPageChange={goToPage}
                onItemsPerPageChange={changeLimit}
              />
            </TableFooter>
          </>
        )}
      </Card>

      {/* Placeholder Modals - To be implemented */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Create New Trip"
        >
          <div className="p-4">
            <p className="text-gray-600">
              Create Trip Modal - To be implemented
            </p>
            <Button onClick={() => setShowAddModal(false)} className="mt-4">
              Close
            </Button>
          </div>
        </Modal>
      )}

      {editModalOpen && (
        <Modal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title="Edit Trip"
        >
          <div className="p-4">
            <p className="text-gray-600">Edit Trip Modal - To be implemented</p>
            <Button onClick={() => setEditModalOpen(false)} className="mt-4">
              Close
            </Button>
          </div>
        </Modal>
      )}

      {deleteModalOpen && (
        <Modal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Delete Trip"
        >
          <div className="p-4">
            <p className="text-gray-600">
              Delete Trip Modal - To be implemented
            </p>
            <Button onClick={() => setDeleteModalOpen(false)} className="mt-4">
              Close
            </Button>
          </div>
        </Modal>
      )}

      {showProgressModal && (
        <Modal
          isOpen={showProgressModal}
          onClose={() => setShowProgressModal(false)}
          title="Update Trip Progress"
          size="large"
        >
          <div className="p-4">
            <p className="text-gray-600">
              Trip Progress Update Modal - To be implemented
            </p>
            <Button
              onClick={() => setShowProgressModal(false)}
              className="mt-4"
            >
              Close
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
