import { useState } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { FiPlus, FiX } from "react-icons/fi";
import { useAuthStore } from "../../../store/authStore";
import {
  validateRoute,
  formatRouteData,
  VEHICLE_TYPES,
  calculateRouteEstimate,
} from "../../../utils/routeValidation";

export default function AddRouteModal({ isOpen, onClose, onSubmit }) {
  const { user } = useAuthStore();
  const [form, setForm] = useState({
    name: "",
    source: { name: "", lat: "", lng: "" },
    destination: { name: "", lat: "", lng: "" },
    distanceKm: "",
    estimatedDurationHr: "",
  });

  const [waypoints, setWaypoints] = useState([]);
  const [tolls, setTolls] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleNestedChange = (parent, field, value) => {
    setForm({
      ...form,
      [parent]: { ...form[parent], [field]: value },
    });
  };

  // Waypoint handlers
  const addWaypoint = () => {
    setWaypoints([
      ...waypoints,
      { name: "", lat: "", lng: "", stopDurationMin: 0 },
    ]);
  };

  const removeWaypoint = (index) => {
    setWaypoints(waypoints.filter((_, i) => i !== index));
  };

  const updateWaypoint = (index, field, value) => {
    const updated = [...waypoints];
    updated[index][field] = value;
    setWaypoints(updated);
  };

  // Toll handlers
  const addToll = () => {
    setTolls([...tolls, { name: "", cost: 0 }]);
  };

  const removeToll = (index) => {
    setTolls(tolls.filter((_, i) => i !== index));
  };

  const updateToll = (index, field, value) => {
    const updated = [...tolls];
    updated[index][field] = value;
    setTolls(updated);
  };

  // Vehicle type handlers
  const toggleVehicleType = (type) => {
    if (vehicleTypes.includes(type)) {
      setVehicleTypes(vehicleTypes.filter((t) => t !== type));
    } else {
      setVehicleTypes([...vehicleTypes, type]);
    }
  };

  const validateForm = () => {
    const routeData = {
      name: form.name,
      source: form.source,
      destination: form.destination,
      distanceKm: form.distanceKm,
      estimatedDurationHr: form.estimatedDurationHr,
      waypoints,
      tolls,
      preferredVehicleTypes: vehicleTypes,
    };

    const errors = validateRoute(routeData);
    return errors.length > 0 ? errors[0] : null; // Return first error
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    const payload = formatRouteData(form, waypoints, tolls, vehicleTypes);

    // Backend returns 'id' in login response, but MongoDB uses '_id'
    if (user?.id || user?._id) {
      payload.createdBy = user.id || user._id;
    }

    try {
      setSubmitting(true);
      await onSubmit(payload);

      // Show cost estimate
      const estimate = calculateRouteEstimate(payload);
      toast.success(
        `Route created! Estimated cost: ₹${estimate.totalCost} (Fuel: ₹${estimate.fuelCost}, Tolls: ₹${estimate.tollCost})`
      );

      handleClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setForm({
      name: "",
      source: { name: "", lat: "", lng: "" },
      destination: { name: "", lat: "", lng: "" },
      distanceKm: "",
      estimatedDurationHr: "",
    });
    setWaypoints([]);
    setTolls([]);
    setVehicleTypes([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Route">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Route Name */}
        <Input
          label="Route Name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="e.g., Mumbai to Delhi"
          required
        />

        {/* Source Location */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-[var(--text-primary)]">
            Source Location
          </label>
          <Input
            placeholder="Location name"
            value={form.source.name}
            onChange={(e) =>
              handleNestedChange("source", "name", e.target.value)
            }
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              step="any"
              placeholder="Latitude"
              value={form.source.lat}
              onChange={(e) =>
                handleNestedChange("source", "lat", e.target.value)
              }
              required
            />
            <Input
              type="number"
              step="any"
              placeholder="Longitude"
              value={form.source.lng}
              onChange={(e) =>
                handleNestedChange("source", "lng", e.target.value)
              }
              required
            />
          </div>
        </div>

        {/* Destination Location */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-[var(--text-primary)]">
            Destination Location
          </label>
          <Input
            placeholder="Location name"
            value={form.destination.name}
            onChange={(e) =>
              handleNestedChange("destination", "name", e.target.value)
            }
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              step="any"
              placeholder="Latitude"
              value={form.destination.lat}
              onChange={(e) =>
                handleNestedChange("destination", "lat", e.target.value)
              }
              required
            />
            <Input
              type="number"
              step="any"
              placeholder="Longitude"
              value={form.destination.lng}
              onChange={(e) =>
                handleNestedChange("destination", "lng", e.target.value)
              }
              required
            />
          </div>
        </div>

        {/* Distance and Duration */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Distance (km)"
            type="number"
            step="any"
            min="1"
            value={form.distanceKm}
            onChange={(e) => handleChange("distanceKm", e.target.value)}
            placeholder="e.g., 1400"
            required
          />
          <Input
            label="Estimated Duration (hours)"
            type="number"
            step="any"
            min="0.1"
            value={form.estimatedDurationHr}
            onChange={(e) =>
              handleChange("estimatedDurationHr", e.target.value)
            }
            placeholder="e.g., 24"
            required
          />
        </div>

        {/* Waypoints */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-[var(--text-primary)]">
              Waypoints (Optional)
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              icon={<FiPlus size={16} />}
              onClick={addWaypoint}
            >
              Add Waypoint
            </Button>
          </div>
          {waypoints.map((wp, index) => (
            <div
              key={index}
              className="p-4 border border-[var(--border-primary)] rounded-lg space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--text-secondary)]">
                  Waypoint {index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  icon={<FiX size={16} />}
                  onClick={() => removeWaypoint(index)}
                />
              </div>
              <Input
                placeholder="Waypoint name"
                value={wp.name}
                onChange={(e) => updateWaypoint(index, "name", e.target.value)}
              />
              <div className="grid grid-cols-3 gap-2">
                <Input
                  type="number"
                  step="any"
                  placeholder="Latitude"
                  value={wp.lat}
                  onChange={(e) => updateWaypoint(index, "lat", e.target.value)}
                />
                <Input
                  type="number"
                  step="any"
                  placeholder="Longitude"
                  value={wp.lng}
                  onChange={(e) => updateWaypoint(index, "lng", e.target.value)}
                />
                <Input
                  type="number"
                  min="0"
                  placeholder="Stop (min)"
                  value={wp.stopDurationMin}
                  onChange={(e) =>
                    updateWaypoint(index, "stopDurationMin", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>

        {/* Tolls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-[var(--text-primary)]">
              Tolls (Optional)
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              icon={<FiPlus size={16} />}
              onClick={addToll}
            >
              Add Toll
            </Button>
          </div>
          {tolls.map((toll, index) => (
            <div
              key={index}
              className="p-4 border border-[var(--border-primary)] rounded-lg space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--text-secondary)]">
                  Toll {index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  icon={<FiX size={16} />}
                  onClick={() => removeToll(index)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Toll name"
                  value={toll.name}
                  onChange={(e) => updateToll(index, "name", e.target.value)}
                />
                <Input
                  type="number"
                  min="0"
                  placeholder="Cost (₹)"
                  value={toll.cost}
                  onChange={(e) => updateToll(index, "cost", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Preferred Vehicle Types */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-[var(--text-primary)]">
            Preferred Vehicle Types (Optional)
          </label>
          <div className="flex flex-wrap gap-2">
            {VEHICLE_TYPES.map((type) => (
              <label
                key={type}
                className="flex items-center gap-2 px-3 py-2 border border-[var(--border-primary)] rounded-lg cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <input
                  type="checkbox"
                  checked={vehicleTypes.includes(type)}
                  onChange={() => toggleVehicleType(type)}
                  className="rounded"
                />
                <span className="text-sm text-[var(--text-primary)]">
                  {type}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create Route"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

AddRouteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
