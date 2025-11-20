import { useEffect, useState } from "react";
import api from "../../api/axiosClient";
import toast from "react-hot-toast";

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
      <h1 className="text-3xl font-bold text-white mb-6">Vehicles</h1>
      <div className="flex justify-between mb-4">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          + Add Vehicle
        </button>

        <div>
          <input
            type="text"
            placeholder="Search vehicles..."
            className="w-full bg-[#1A1A1A] border border-gray-700 text-gray-200 rounded px-3 py-2 
               focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      {loading ? (
        <p className="text-gray-400">Loading vehicles...</p>
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
    <div className="overflow-x-auto rounded-lg border border-gray-800">
      <table className="w-full text-left text-gray-300">
        <thead className="bg-[#1A1A1A]">
          <tr>
            <th className="px-4 py-3 border-b border-gray-800">#</th>
            <th className="px-4 py-3 border-b border-gray-800">Vehicle No</th>
            <th className="px-4 py-3 border-b border-gray-800">Model</th>
            <th className="px-4 py-3 border-b border-gray-800">Type</th>
            <th className="px-4 py-3 border-b border-gray-800">
              Capacity (Kg)
            </th>
            <th className="px-4 py-3 border-b border-gray-800">
              Insurance Expiry
            </th>
            <th className="px-4 py-3 border-b border-gray-800">Actions</th>
          </tr>
        </thead>

        <tbody>
          {vehicles.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-4 text-gray-500">
                No vehicles found.
              </td>
            </tr>
          ) : (
            vehicles.map((v, i) => (
              <tr key={v._id} className="hover:bg-[#1E1E1E] transition">
                <td className="px-4 py-3 border-b border-gray-800">{i + 1}</td>
                <td className="px-4 py-3 border-b border-gray-800">
                  {v.vehicleNo}
                </td>
                <td className="px-4 py-3 border-b border-gray-800">
                  {v.model}
                </td>
                <td className="px-4 py-3 border-b border-gray-800">{v.type}</td>
                <td className="px-4 py-3 border-b border-gray-800">
                  {v.capacityKg}
                </td>
                <td className="px-4 py-3 border-b border-gray-800">
                  {new Date(v.insurance?.expiryDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 border-b border-gray-800">
                  <button
                    className="text-blue-400 hover:text-blue-500 mr-3 cursor-pointer"
                    onClick={() => onEdit(v)}
                  >
                    Edit
                  </button>

                  <button
                    className="text-red-400 hover:text-red-500 cursor-pointer"
                    onClick={() => onDelete(v)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
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

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1A1A1A] p-6 rounded-xl w-full max-w-lg border border-gray-800">
        <h2 className="text-xl font-semibold mb-4 text-white">
          Add New Vehicle
        </h2>

        <form className="space-y-4" onSubmit={handleCreate}>
          <div>
            <label className="text-gray-300">Vehicle Number</label>
            <input
              type="text"
              className="w-full mt-1 bg-[#2A2A2A] border border-gray-700 text-gray-200 rounded px-3 py-2"
              value={vehicleNo}
              onChange={(e) => setVehicleNo(e.target.value)}
            />
          </div>

          <div>
            <label className="text-gray-300">Model</label>
            <input
              type="text"
              className="w-full mt-1 bg-[#2A2A2A] border border-gray-700 text-gray-200 rounded px-3 py-2"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </div>

          <div>
            <label className="text-gray-300">Type</label>
            <input
              type="text"
              className="w-full mt-1 bg-[#2A2A2A] border border-gray-700 text-gray-200 rounded px-3 py-2"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
          </div>

          <div>
            <label className="text-gray-300">Capacity (Kg)</label>
            <input
              type="number"
              className="w-full mt-1 bg-[#2A2A2A] border border-gray-700 text-gray-200 rounded px-3 py-2"
              value={capacityKg}
              onChange={(e) => setCapacityKg(e.target.value)}
            />
          </div>

          <div>
            <label className="text-gray-300">Insurance Policy Number</label>
            <input
              type="text"
              className="w-full mt-1 bg-[#2A2A2A] border border-gray-700 text-gray-200 rounded px-3 py-2"
              value={policyNumber}
              onChange={(e) => setPolicyNumber(e.target.value)}
            />
          </div>

          <div>
            <label className="text-gray-300">Insurance Expiry Date</label>
            <input
              type="date"
              className="w-full mt-1 bg-[#2A2A2A] border border-gray-700 text-gray-200 rounded px-3 py-2"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 cursor-pointer"
            >
              {loading ? "Adding..." : "Add Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
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

  if (!open || !vehicle) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1A1A1A] p-6 rounded-xl w-full max-w-lg border border-gray-800">
        <h2 className="text-xl font-semibold mb-4 text-white">Edit Vehicle</h2>

        <form className="space-y-4" onSubmit={handleUpdate}>
          <div>
            <label className="text-gray-300">Vehicle Number</label>
            <input
              type="text"
              className="w-full mt-1 bg-[#2A2A2A] border border-gray-700 text-gray-200 px-3 py-2 rounded"
              value={vehicleNo}
              onChange={(e) => setVehicleNo(e.target.value)}
            />
          </div>

          <div>
            <label className="text-gray-300">Model</label>
            <input
              type="text"
              className="w-full mt-1 bg-[#2A2A2A] border border-gray-700 text-gray-200 px-3 py-2 rounded"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </div>

          <div>
            <label className="text-gray-300">Type</label>
            <input
              type="text"
              className="w-full mt-1 bg-[#2A2A2A] border border-gray-700 text-gray-200 px-3 py-2 rounded"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
          </div>

          <div>
            <label className="text-gray-300">Capacity (Kg)</label>
            <input
              type="number"
              className="w-full mt-1 bg-[#2A2A2A] border border-gray-700 text-gray-200 px-3 py-2 rounded"
              value={capacityKg}
              onChange={(e) => setCapacityKg(e.target.value)}
            />
          </div>

          <div>
            <label className="text-gray-300">Insurance Policy Number</label>
            <input
              type="text"
              className="w-full mt-1 bg-[#2A2A2A] border border-gray-700 text-gray-200 px-3 py-2 rounded"
              value={policyNumber}
              onChange={(e) => setPolicyNumber(e.target.value)}
            />
          </div>

          <div>
            <label className="text-gray-300">Insurance Expiry Date</label>
            <input
              type="date"
              className="w-full mt-1 bg-[#2A2A2A] border border-gray-700 text-gray-200 px-3 py-2 rounded"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 cursor-pointer"
            >
              {loading ? "Updating..." : "Update Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
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

  if (!open || !vehicle) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1A1A1A] p-6 rounded-xl w-full max-w-md border border-gray-800">
        <h2 className="text-xl font-semibold text-white mb-4">
          Delete Vehicle
        </h2>

        <p className="text-gray-300 mb-6">
          Are you sure you want to delete{" "}
          <span className="text-red-400 font-semibold">
            {vehicle.vehicleNo}
          </span>
          ? This action cannot be undone.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 cursor-pointer"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
