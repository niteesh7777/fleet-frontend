import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import LoadingSkeleton from "../../components/ui/LoadingSkeleton";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import PaginationControls from "../../components/ui/PaginationControls";
import TableFooter from "../../components/ui/TableFooter";
import SearchAndFilter from "../../components/common/SearchAndFilter";
import { driverApi } from "../../api/endpoints";
import { usePagination } from "../../hooks/usePagination";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { MdOutlineMap } from "react-icons/md";
import StatusBadge from "../../components/ui/StatusBadge";
import AddDriverModal from "./components/AddDriverModal";
import EditDriverModal from "./components/EditDriverModal";
import DeleteDriverModal from "./components/DeleteDriverModal";
import useBulkSelection, {
  BulkActionToolbar,
  BulkSelectCheckbox,
} from "../../hooks/useBulkSelection.jsx";

export default function DriversPaginated() {
  const navigate = useNavigate();

  // Pagination hook setup
  const {
    data: drivers,
    loading,
    error,
    pagination,
    goToPage,
    changeLimit,
    updateParams,
    refresh,
  } = usePagination({
    apiCall: driverApi.getAllPaginated,
    defaultLimit: 10,
  });

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState(null);

  // Bulk selection
  const bulkSelection = useBulkSelection(drivers || [], "_id");

  // Filter configuration
  const filterConfig = [
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "active", label: "Active" },
        { value: "on-trip", label: "On Trip" },
        { value: "inactive", label: "Inactive" },
        { value: "suspended", label: "Suspended" },
      ],
    },
  ];

  // Handle search and filter
  const handleSearch = (searchTerm) => {
    updateParams({ search: searchTerm });
  };

  const handleFilter = (filters) => {
    updateParams(filters);
  };

  // CRUD handlers
  const handleCreate = async (formData) => {
    try {
      await driverApi.create(formData);
      toast.success("Driver created successfully");
      setShowAddModal(false);
      refresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create driver");
    }
  };

  const handleEdit = (driver) => {
    setSelectedDriver(driver);
    setEditModalOpen(true);
  };

  const handleUpdate = async (id, formData) => {
    try {
      await driverApi.update(id, formData);
      toast.success("Driver updated successfully");
      setEditModalOpen(false);
      refresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update driver");
    }
  };

  const handleDelete = (driver) => {
    setDriverToDelete(driver);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (id) => {
    try {
      await driverApi.delete(id);
      toast.success("Driver deleted successfully");
      setDeleteModalOpen(false);
      refresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete driver");
    }
  };

  // Bulk delete handler
  const handleBulkDelete = async () => {
    const selectedIds = bulkSelection.selectedIds;
    if (
      window.confirm(
        `Delete ${selectedIds.length} selected driver(s)? This action cannot be undone.`
      )
    ) {
      try {
        const result = await driverApi.bulkDelete(selectedIds);

        if (result.deleted.length > 0) {
          toast.success(
            `Successfully deleted ${result.deleted.length} driver(s)`
          );
        }

        if (result.failed.length > 0) {
          toast.error(
            `Failed to delete ${result.failed.length} driver(s): ${result.failed.map((f) => f.reason).join(", ")}`
          );
        }

        bulkSelection.clearSelection();
        refresh();
      } catch (error) {
        toast.error(error.response?.data?.message || "Bulk delete failed");
      }
    }
  };

  // Bulk export handler
  const handleBulkExport = () => {
    const selectedItems = bulkSelection.getSelectedItems();
    console.log("Exporting drivers:", selectedItems);
    toast.success(`Exporting ${selectedItems.length} drivers...`);
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">
            <h3 className="font-medium">Error loading drivers</h3>
            <p className="mt-1">{error}</p>
            <Button onClick={refresh} className="mt-2">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const hasActiveFilters = Object.keys(updateParams).some(
    (key) => key !== "page" && key !== "limit"
  );
  const hasSearchQuery = pagination?.search || false;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-(--text-primary)">Drivers</h1>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowAddModal(true)}
            icon={<FiPlus />}
            className="bg-(--primary) hover:bg-(--primary-dark) text-white"
          >
            Add Driver
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/drivers/live-tracking")}
            icon={<MdOutlineMap size={18} />}
          >
            Live Tracking
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <SearchAndFilter
          onSearch={handleSearch}
          onFilter={handleFilter}
          searchPlaceholder="Search drivers by name, license, phone..."
          filters={filterConfig}
          activeFilters={{}}
        />
      </Card>

      {/* Bulk Action Toolbar */}
      {bulkSelection.selectedCount > 0 && (
        <BulkActionToolbar
          selectedCount={bulkSelection.selectedCount}
          onDelete={handleBulkDelete}
          onExport={handleBulkExport}
          onClearSelection={bulkSelection.clearSelection}
        />
      )}

      {/* Table */}
      {loading ? (
        <LoadingSkeleton type="table" count={10} />
      ) : drivers && drivers.length === 0 ? (
        <EmptyState
          title={
            hasSearchQuery || hasActiveFilters
              ? "No drivers found"
              : "No drivers yet"
          }
          description={
            hasSearchQuery || hasActiveFilters
              ? "Try adjusting your search or filters"
              : "Get started by adding your first driver to the fleet"
          }
          actionLabel={
            hasSearchQuery || hasActiveFilters ? "Clear Filters" : "Add Driver"
          }
          onAction={() => {
            if (hasSearchQuery || hasActiveFilters) {
              updateParams({ search: "", status: "" });
            } else {
              setShowAddModal(true);
            }
          }}
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-(--border-primary)">
              <thead className="bg-(--bg-secondary)">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <BulkSelectCheckbox
                      checked={bulkSelection.isAllSelected}
                      indeterminate={bulkSelection.isSomeSelected}
                      onChange={bulkSelection.toggleAll}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-(--text-secondary) uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-(--text-secondary) uppercase tracking-wider">
                    License No
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-(--text-secondary) uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-(--text-secondary) uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-(--text-secondary) uppercase tracking-wider">
                    Assigned Vehicle
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-(--text-secondary) uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-(--bg-primary) divide-y divide-(--border-primary)">
                {drivers.map((driver) => (
                  <tr
                    key={driver._id}
                    className="hover:bg-(--bg-secondary) transition-colors"
                  >
                    <td className="px-4 py-4">
                      <BulkSelectCheckbox
                        checked={bulkSelection.isSelected(driver._id)}
                        onChange={() =>
                          bulkSelection.toggleSelection(driver._id)
                        }
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-(--text-primary)">
                            {driver.user?.name || "N/A"}
                          </div>
                          <div className="text-sm text-(--text-secondary)">
                            {driver.user?.email || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-(--text-primary)">
                      {driver.licenseNo}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-(--text-primary)">
                      {driver.contact?.phone || "N/A"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <StatusBadge status={driver.status} />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-(--text-primary)">
                      {driver.assignedVehicle?.vehicleNo || "Not assigned"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(driver)}
                          icon={<FiEdit2 size={16} />}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(driver)}
                          icon={<FiTrash2 size={16} />}
                          className="text-(--danger) hover:text-(--danger)"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <TableFooter>
            <PaginationControls
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={goToPage}
              pageSize={pagination.limit}
              onPageSizeChange={changeLimit}
              totalItems={pagination.total}
            />
          </TableFooter>
        </Card>
      )}

      {/* Modals */}
      <AddDriverModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleCreate}
      />

      <EditDriverModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        driver={selectedDriver}
        onSubmit={handleUpdate}
      />

      <DeleteDriverModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        driver={driverToDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
