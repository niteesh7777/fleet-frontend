import { useState } from "react";
import toast from "react-hot-toast";
import StatusBadge from "../../components/ui/StatusBadge";
import LoadingSkeleton from "../../components/ui/LoadingSkeleton";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Card from "../../components/ui/Card";
import PaginationControls from "../../components/ui/PaginationControls";
import TableFooter from "../../components/ui/TableFooter";
import SearchAndFilter from "../../components/common/SearchAndFilter";
import { vehicleApi } from "../../api/endpoints";
import { usePagination } from "../../hooks/usePagination";
import { FiPlus, FiUsers, FiEdit2, FiTrash2 } from "react-icons/fi";
import SelectDriverModal from "./SelectDriverModal";
import AssignedDriversPanel from "./AssignedDriversPanel";
import AssignmentStatusBadge from "./AssignmentStatusBadge";
import AddVehicleModal from "./AddVehicleModal";
import EditVehicleModal from "./EditVehicleModal";
import DeleteVehicleModal from "./DeleteVehicleModal";
import useBulkSelection, {
  BulkActionToolbar,
  BulkSelectCheckbox,
} from "../../hooks/useBulkSelection.jsx";

export default function Vehicles() {
  // Pagination hook setup
  const {
    data: vehicles,
    loading,
    error,
    pagination,
    goToPage,
    changeLimit,
    updateParams,
    refresh,
  } = usePagination({
    apiCall: vehicleApi.getAllPaginated,
    defaultLimit: 10,
  });

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  // Driver assignment states
  const [assignDriverModalOpen, setAssignDriverModalOpen] = useState(false);
  const [showDriversPanel, setShowDriversPanel] = useState(false);
  const [vehicleForAssignment, setVehicleForAssignment] = useState(null);

  // Bulk selection
  const bulkSelection = useBulkSelection(vehicles || [], "_id");

  // Filter configuration
  const filterConfig = [
    {
      key: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "available", label: "Available" },
        { value: "in-trip", label: "In Trip" },
        { value: "maintenance", label: "Maintenance" },
        { value: "out-of-service", label: "Out of Service" },
      ],
    },
    {
      key: "type",
      label: "Vehicle Type",
      type: "select",
      options: [
        { value: "truck", label: "Truck" },
        { value: "van", label: "Van" },
        { value: "pickup", label: "Pickup" },
        { value: "trailer", label: "Trailer" },
      ],
    },
  ];

  // Handle search and filter
  const handleSearch = (searchTerm) => {
    updateParams({ search: searchTerm });
  };

  const handleFilter = (filters) => {
    // If filters is empty, explicitly clear all filter keys
    if (Object.keys(filters).length === 0) {
      // Get all filter keys from filterConfig
      const filterKeys = filterConfig.map((f) => f.key);
      const clearedFilters = {};
      filterKeys.forEach((key) => {
        clearedFilters[key] = undefined;
      });
      updateParams(clearedFilters);
    } else {
      updateParams(filters);
    }
  };

  // Driver assignment handlers
  const handleAssignDriver = (vehicle) => {
    setVehicleForAssignment(vehicle);
    setAssignDriverModalOpen(true);
  };

  const handleViewDrivers = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowDriversPanel(true);
  };

  const handleAssignmentSuccess = () => {
    setAssignDriverModalOpen(false);
    setVehicleForAssignment(null);
    refresh(); // Refresh the data
  };

  // CRUD handlers
  const handleCreate = async (formData) => {
    try {
      await vehicleApi.create(formData);
      toast.success("Vehicle created successfully");
      setShowAddModal(false);
      refresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create vehicle");
    }
  };

  const handleUpdate = async (id, formData) => {
    try {
      await vehicleApi.update(id, formData);
      toast.success("Vehicle updated successfully");
      setEditModalOpen(false);
      refresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update vehicle");
    }
  };

  const handleEdit = (vehicle) => {
    setSelectedVehicle(vehicle);
    setEditModalOpen(true);
  };

  const handleDelete = (vehicle) => {
    setVehicleToDelete(vehicle);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (vehicleId) => {
    try {
      await vehicleApi.delete(vehicleId);
      toast.success("Vehicle deleted successfully");
      setDeleteModalOpen(false);
      setVehicleToDelete(null);
      refresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete vehicle");
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">
            <h3 className="font-medium">Error loading vehicles</h3>
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
          Fleet Management
        </h1>
        <Button
          onClick={() => setShowAddModal(true)}
          icon={<FiPlus />}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Add Vehicle
        </Button>
      </div>

      <Card className="mb-6">
        <SearchAndFilter
          onSearch={handleSearch}
          onFilter={handleFilter}
          searchPlaceholder="Search by vehicle number, model, type..."
          filters={filterConfig}
        />
      </Card>

      <BulkActionToolbar
        selectedCount={bulkSelection.selectedCount}
        onDelete={async () => {
          const selectedIds = bulkSelection.selectedIds;
          if (
            window.confirm(
              `Delete ${selectedIds.length} selected vehicle(s)? This action cannot be undone.`,
            )
          ) {
            try {
              const result = await vehicleApi.bulkDelete(selectedIds);

              if (result.deleted.length > 0) {
                toast.success(
                  `Successfully deleted ${result.deleted.length} vehicle(s)`,
                );
              }

              if (result.failed.length > 0) {
                toast.error(
                  `Failed to delete ${result.failed.length} vehicle(s): ${result.failed.map((f) => f.reason).join(", ")}`,
                );
              }

              bulkSelection.clearSelection();
              refresh();
            } catch (error) {
              toast.error(
                error.response?.data?.message || "Bulk delete failed",
              );
            }
          }
        }}
        onExport={() => {
          const selected = bulkSelection.getSelectedItems();
          console.log("Exporting vehicles:", selected);
          toast.success(`Exported ${selected.length} vehicles`);
        }}
        onClearSelection={bulkSelection.clearSelection}
      />

      <Card>
        {loading ? (
          <LoadingSkeleton count={5} />
        ) : vehicles.length === 0 ? (
          <EmptyState
            title="No vehicles found"
            description="Get started by adding your first vehicle to the fleet"
            actionLabel="Add Vehicle"
            onAction={() => setShowAddModal(true)}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <BulkSelectCheckbox
                        checked={bulkSelection.isAllSelected}
                        indeterminate={bulkSelection.isSomeSelected}
                        onChange={bulkSelection.toggleAll}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Vehicle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Type & Capacity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Insurance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Drivers
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {vehicles.map((vehicle) => (
                    <tr
                      key={vehicle._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-6 py-4">
                        <BulkSelectCheckbox
                          checked={bulkSelection.isSelected(vehicle._id)}
                          onChange={() =>
                            bulkSelection.toggleSelection(vehicle._id)
                          }
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {vehicle.vehicleNo}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {vehicle.model}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {vehicle.type}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {vehicle.capacityKg} kg
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge
                          status={vehicle.status}
                          variant={
                            vehicle.status === "available"
                              ? "success"
                              : vehicle.status === "in-trip"
                                ? "warning"
                                : vehicle.status === "maintenance"
                                  ? "info"
                                  : "danger"
                          }
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {vehicle.insurance?.policyNumber || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <AssignmentStatusBadge
                          assignedCount={vehicle.assignedDrivers?.length || 0}
                          maxCapacity={vehicle.driverCapacity || 2}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAssignDriver(vehicle)}
                            icon={<FiUsers size={16} />}
                            title="Assign Driver"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDrivers(vehicle)}
                            title="View Assigned Drivers"
                          >
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(vehicle)}
                            icon={<FiEdit2 size={16} />}
                            title="Edit Vehicle"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(vehicle)}
                            icon={<FiTrash2 size={16} />}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Delete Vehicle"
                          />
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
                totalItems={pagination.total}
                itemsPerPage={pagination.limit}
                onPageChange={goToPage}
                onItemsPerPageChange={changeLimit}
              />
            </TableFooter>
          </>
        )}
      </Card>

      <AddVehicleModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleCreate}
      />

      <EditVehicleModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedVehicle(null);
        }}
        onSubmit={handleUpdate}
        vehicle={selectedVehicle}
      />

      <DeleteVehicleModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setVehicleToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        vehicle={vehicleToDelete}
      />

      <SelectDriverModal
        isOpen={assignDriverModalOpen}
        onClose={() => setAssignDriverModalOpen(false)}
        vehicle={vehicleForAssignment}
        onAssignmentSuccess={handleAssignmentSuccess}
      />

      <Modal
        isOpen={showDriversPanel}
        onClose={() => setShowDriversPanel(false)}
        title={`Assigned Drivers - ${selectedVehicle?.vehicleNo || "Vehicle"}`}
        size="large"
      >
        {selectedVehicle && (
          <AssignedDriversPanel
            vehicle={selectedVehicle}
            onDriverRemoved={refresh}
          />
        )}
      </Modal>
    </div>
  );
}
