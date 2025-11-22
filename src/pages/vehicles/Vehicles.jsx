import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import toast from "react-hot-toast";
import StatusBadge from "../../components/ui/StatusBadge";
import LoadingSkeleton from "../../components/ui/LoadingSkeleton";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import Card from "../../components/ui/Card";
import { FiPlus, FiSearch } from "react-icons/fi";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);
  const [search, setSearch] = useState("");

  const filteredVehicles = vehicles.filter((v) => {
    const s = search.toLowerCase();

    return (
      v.vehicleNo.toLowerCase().includes(s) ||
      v.model.toLowerCase().includes(s) ||
      v.type.toLowerCase().includes(s) ||
      String(v.capacityKg).includes(s) ||
      v.insurance?.policyNumber.toLowerCase().includes(s)
    );
  });

  const fetchVehicles = async () => {
    try {
      setLoading(true);

      const res = await api.get("/vehicles");

      // FIXED: correct extraction
      setVehicles(res.data.data.vehicles || []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">Vehicles</h1>
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <Button
          onClick={() => setShowModal(true)}
          icon={<FiPlus size={18} />}
        >
          Add Vehicle
        </Button>

        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Search vehicles..."
            icon={<FiSearch size={18} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      {loading ? (
        <LoadingSkeleton type="table" count={5} />
      ) : filteredVehicles.length === 0 ? (
        <EmptyState
          title="No vehicles found"
          description={search ? "Try adjusting your search terms" : "Get started by adding your first vehicle"}
          action={
            !search && (
              <Button onClick={() => setShowModal(true)} icon={<FiPlus size={18} />}>
                Add Vehicle
              </Button>
            )
          }
        />
      ) : (
        <VehiclesTable
          vehicles={filteredVehicles}
          onEdit={(v) => {
            setSelectedVehicle(v);
            setEditModalOpen(true);
          }}
          onDelete={(v) => {
            setVehicleToDelete(v);
            setDeleteModalOpen(true);
          }}
        />
      )}
      <AddVehicleModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={fetchVehicles} // refresh table after add
      />
      <EditVehicleModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={fetchVehicles}
        vehicle={selectedVehicle}
      />
      <DeleteVehicleModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onSuccess={fetchVehicles}
        vehicle={vehicleToDelete}
      />
    </div>
  );
}

function VehiclesTable({ vehicles, onEdit, onDelete }) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[var(--bg-secondary)]">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">#</th>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Vehicle No</th>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Model</th>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Capacity (Kg)
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Insurance Expiry
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--border-primary)]">
            {vehicles.map((v, i) => (
              <tr key={v._id} className="table-row-hover transition-colors">
                <td className="px-4 py-4 text-sm text-[var(--text-tertiary)]">{i + 1}</td>
                <td className="px-4 py-4">
                  <span className="font-mono font-semibold text-[var(--text-primary)]">
                    {v.vehicleNo}
                  </span>
                </td>
                <td className="px-4 py-4 text-[var(--text-primary)]">
                  {v.model}
                </td>
                <td className="px-4 py-4 text-[var(--text-secondary)]">{v.type}</td>
                <td className="px-4 py-4">
                  <StatusBadge status={v.status} />
                </td>
                <td className="px-4 py-4 text-[var(--text-primary)] font-medium">
                  {v.capacityKg.toLocaleString()}
                </td>
                <td className="px-4 py-4 text-[var(--text-secondary)] text-sm">
                  {new Date(v.insurance?.expiryDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(v)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[var(--danger)] hover:text-[var(--danger)] hover:bg-[var(--danger-light)]"
                      onClick={() => onDelete(v)}
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
    </Card>
  );
}

function AddVehicleModal({ open, onClose, onSuccess }) {
  const [vehicleNo, setVehicleNo] = useState("");
  const [model, setModel] = useState("");
  const [type, setType] = useState("");
  const [capacityKg, setCapacityKg] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (
      !vehicleNo ||
      !model ||
      !type ||
      !capacityKg ||
      !policyNumber ||
      !expiryDate
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        vehicleNo,
        model,
        type,
        capacityKg: Number(capacityKg),
        insurance: {
          policyNumber,
          expiryDate,
        },
      };

      await api.post("/vehicles", payload);

      toast.success("Vehicle added successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to add vehicle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Add New Vehicle">
      <form className="space-y-4" onSubmit={handleCreate}>
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">Vehicle Number</label>
          <Input
            value={vehicleNo}
            onChange={(e) => setVehicleNo(e.target.value)}
            placeholder="e.g. KA-01-AB-1234"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">Model</label>
          <Input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="e.g. Tata Ace"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">Type</label>
          <Input
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="e.g. Truck"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">Capacity (Kg)</label>
          <Input
            type="number"
            value={capacityKg}
            onChange={(e) => setCapacityKg(e.target.value)}
            placeholder="e.g. 1000"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">Insurance Policy Number</label>
          <Input
            value={policyNumber}
            onChange={(e) => setPolicyNumber(e.target.value)}
            placeholder="Policy Number"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">Insurance Expiry Date</label>
          <Input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            isLoading={loading}
          >
            Add Vehicle
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function EditVehicleModal({ open, onClose, onSuccess, vehicle }) {
  const [vehicleNo, setVehicleNo] = useState(vehicle?.vehicleNo || "");
  const [model, setModel] = useState(vehicle?.model || "");
  const [type, setType] = useState(vehicle?.type || "");
  const [capacityKg, setCapacityKg] = useState(vehicle?.capacityKg || "");
  const [policyNumber, setPolicyNumber] = useState(
    vehicle?.insurance?.policyNumber || ""
  );
  const [expiryDate, setExpiryDate] = useState(
    vehicle?.insurance?.expiryDate?.slice(0, 10) || ""
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (vehicle) {
      setVehicleNo(vehicle.vehicleNo);
      setModel(vehicle.model);
      setType(vehicle.type);
      setCapacityKg(vehicle.capacityKg);
      setPolicyNumber(vehicle.insurance?.policyNumber || "");
      setExpiryDate(vehicle.insurance?.expiryDate?.slice(0, 10) || "");
    }
  }, [vehicle]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        vehicleNo,
        model,
        type,
        capacityKg: Number(capacityKg),
        insurance: {
          policyNumber,
          expiryDate,
        },
      };

      await api.put(`/vehicles/${vehicle._id}`, payload);

      toast.success("Vehicle updated successfully!");

      onSuccess(); // refresh data
      onClose(); // close modal
    } catch (err) {
      console.log(err);
      toast.error("Failed to update vehicle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Edit Vehicle">
      <form className="space-y-4" onSubmit={handleUpdate}>
        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">Vehicle Number</label>
          <Input
            value={vehicleNo}
            onChange={(e) => setVehicleNo(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">Model</label>
          <Input
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">Type</label>
          <Input
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">Capacity (Kg)</label>
          <Input
            type="number"
            value={capacityKg}
            onChange={(e) => setCapacityKg(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">Insurance Policy Number</label>
          <Input
            value={policyNumber}
            onChange={(e) => setPolicyNumber(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[var(--text-secondary)] mb-1 block">Insurance Expiry Date</label>
          <Input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            isLoading={loading}
          >
            Update Vehicle
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function DeleteVehicleModal({ open, onClose, onSuccess, vehicle }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);

      await api.delete(`/vehicles/${vehicle._id}`);

      toast.success("Vehicle deleted successfully");
      onSuccess(); // refresh list
      onClose(); // close modal
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete vehicle");
    } finally {
      setLoading(false);
    }
  };

  if (!vehicle) return null;

  return (
    <Modal isOpen={open} onClose={onClose} title="Delete Vehicle">
      <p className="text-[var(--text-secondary)] mb-6">
        Are you sure you want to delete{" "}
        <span className="text-[var(--danger)] font-semibold">
          {vehicle.vehicleNo}
        </span>
        ? This action cannot be undone.
      </p>

      <div className="flex justify-end gap-3">
        <Button
          variant="ghost"
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          variant="danger"
          onClick={handleDelete}
          isLoading={loading}
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
}
