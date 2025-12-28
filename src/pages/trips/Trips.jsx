import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useTrips from "./hooks/useTrips";
import { FiPlus, FiSearch } from "react-icons/fi";
import { useAuthStore } from "../../store/authStore";

import EditTripModal from "./components/EditTripModal";
import TripsTable from "./components/TripsTable";
import DeleteTripModal from "./components/DeleteTripModal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import LoadingSkeleton from "../../components/ui/LoadingSkeleton";
import Modal from "../../components/ui/Modal";
import TripMapCreator from "../../components/TripMapCreator";

// Import new trip progress components
import ProgressUpdateForm from "./components/ProgressUpdateForm";
import StatusTimeline from "./components/StatusTimeline";

export default function Trips() {
  const { trips, loading, createTrip, updateTrip, deleteTrip } = useTrips();
  const { user } = useAuthStore();
  const isAdmin = [
    "company_owner",
    "company_admin",
    "company_manager",
  ].includes(user?.companyRole);
  const navigate = useNavigate();

  const [showEdit, setShowEdit] = useState(false);
  const [search, setSearch] = useState("");
  const [showMapCreator, setShowMapCreator] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);

  // Progress update states
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [timelineModalOpen, setTimelineModalOpen] = useState(false);
  const [tripForProgress, setTripForProgress] = useState(null);

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
    setShowEdit(false);
    setShowDelete(false);
    setShowMapCreator(false);
    setSelectedTrip(null); // Clear selection on close
    setProgressModalOpen(false);
    setTimelineModalOpen(false);
    setTripForProgress(null);
  };

  // Progress update handlers
  const handleUpdateProgress = (trip) => {
    setTripForProgress(trip);
    setProgressModalOpen(true);
  };

  const handleViewTimeline = (trip) => {
    setTripForProgress(trip);
    setTimelineModalOpen(true);
  };

  const handleProgressSuccess = () => {
    // Refresh trips data after progress update
    // This will trigger useTrips to refetch data
    closeModals();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">
        Trips
      </h1>

      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        {isAdmin && (
          <div className="flex gap-2">
            <Button
              onClick={() => navigate("/dashboard/trips/create")}
              icon={<FiPlus size={18} />}
            >
              Add Trip
            </Button>
            <Button
              onClick={() => setShowMapCreator(true)}
              variant="primary"
              icon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              }
            >
              Map View
            </Button>
          </div>
        )}

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
          onUpdateProgress={handleUpdateProgress}
          onViewTimeline={handleViewTimeline}
          onTripComplete={handleProgressSuccess}
        />
      )}

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

      {/* Progress Update Modal */}
      <ProgressUpdateForm
        isOpen={progressModalOpen}
        onClose={() => setProgressModalOpen(false)}
        trip={tripForProgress}
        onSuccess={handleProgressSuccess}
      />

      {/* Timeline Modal */}
      <Modal
        isOpen={timelineModalOpen}
        onClose={() => setTimelineModalOpen(false)}
        title={`Trip Progress Timeline - ${
          tripForProgress?.tripCode || "Trip"
        }`}
        size="large"
      >
        {tripForProgress && (
          <StatusTimeline
            trip={tripForProgress}
            onRefresh={handleProgressSuccess}
          />
        )}
      </Modal>

      {/* Map-Based Trip Creator */}
      {showMapCreator && (
        <TripMapCreator onClose={closeModals} onSubmit={handleAddSubmit} />
      )}
    </div>
  );
}
