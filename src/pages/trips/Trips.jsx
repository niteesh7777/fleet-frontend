import { useState } from "react";
import useTrips from "./hooks/useTrips";
import { FiPlus, FiSearch } from "react-icons/fi";

import EditTripModal from "./components/EditTripModal";
import TripsTable from "./components/TripsTable";
import AddTripModal from "./components/AddTripModal";
import DeleteTripModal from "./components/DeleteTripModal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import LoadingSkeleton from "../../components/ui/LoadingSkeleton";

export default function Trips() {
  const { trips, loading, createTrip, updateTrip, deleteTrip } = useTrips();

  const [showEdit, setShowEdit] = useState(false);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);

  // FIX 1: Safe Filtering
  // Handle cases where client, driver, or vehicle might be null to avoid "undefined" in search
  const filtered = trips.filter((t) => {
    const searchString = `
      ${t.client?.name || ""} 
      ${t.driver?.user?.name || ""} 
      ${t.vehicle?.vehicleNo || ""}
    `.toLowerCase();
    return searchString.includes(search.toLowerCase());
  });

  // FIX 2: Handlers to manage Async Logic & Modal Closing
  const handleAddSubmit = async (data) => {
    await createTrip(data);
    setShowAdd(false);
  };

  const handleEditSubmit = async (data) => {
    if (selectedTrip?._id) {
      // Assuming updateTrip expects (id, data)
      await updateTrip(selectedTrip._id, data);
      setShowEdit(false);
      setSelectedTrip(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (selectedTrip?._id) {
      // Assuming deleteTrip expects (id)
      await deleteTrip(selectedTrip._id);
      setShowDelete(false);
      setSelectedTrip(null);
    }
  };

  const closeModals = () => {
    setShowAdd(false);
    setShowEdit(false);
    setShowDelete(false);
    setSelectedTrip(null); // Clear selection on close
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">Trips</h1>

      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <Button
          onClick={() => setShowAdd(true)}
          icon={<FiPlus size={18} />}
        >
          Add Trip
        </Button>

        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Search trips..."
            icon={<FiSearch size={18} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton type="table" count={5} />
      ) : (
        <TripsTable
          trips={filtered}
          onEdit={(trip) => {
            setSelectedTrip(trip);
            setShowEdit(true);
          }}
          onDelete={(trip) => {
            setSelectedTrip(trip);
            setShowDelete(true);
          }}
        />
      )}

      {/* Add Modal */}
      {/* FIX 3: Render Modals conditionally or handle cleanup */}
      <AddTripModal
        open={showAdd}
        onClose={closeModals}
        onSubmit={handleAddSubmit}
      />

      {/* Delete Modal */}
      <DeleteTripModal
        open={showDelete}
        onClose={closeModals}
        trip={selectedTrip}
        onConfirm={handleDeleteConfirm}
      />

      {/* Edit Modal */}
      {/* Conditionally render to ensure selectedTrip exists before mounting */}
      {showEdit && selectedTrip && (
        <EditTripModal
          open={showEdit}
          onClose={closeModals}
          trip={selectedTrip}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
}
