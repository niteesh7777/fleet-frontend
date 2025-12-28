import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";

const modes = [
  { key: "auto", label: "Auto assign" },
  { key: "manual", label: "Manual select" },
];

export default function AssignmentPanel({
  mode,
  onModeChange,
  drivers,
  vehicles,
  selectedDriverId,
  selectedVehicleId,
  suggestedDriver,
  suggestedVehicle,
  onDriverChange,
  onVehicleChange,
}) {
  return (
    <Card className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-(--text-primary)">
            Assignment
          </h2>
          <p className="text-sm text-(--text-secondary)">
            Assign available driver and vehicle. Auto mode suggests the best fit
            based on availability.
          </p>
        </div>
      </div>

      <div className="inline-flex rounded-lg border border-(--border-primary) bg-(--bg-primary) p-1">
        {modes.map((entry) => (
          <button
            key={entry.key}
            type="button"
            onClick={() => onModeChange(entry.key)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              mode === entry.key
                ? "bg-(--primary) text-white shadow"
                : "text-(--text-secondary) hover:text-(--text-primary)"
            }`}
          >
            {entry.label}
          </button>
        ))}
      </div>

      {mode === "auto" && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-(--border-primary) bg-(--bg-primary) p-4">
            <p className="text-xs uppercase tracking-wide text-(--text-tertiary)">
              Suggested driver
            </p>
            {suggestedDriver ? (
              <div className="mt-2 text-sm text-(--text-secondary)">
                <p className="text-base font-semibold text-(--text-primary)">
                  {suggestedDriver.name || "Unnamed driver"}
                </p>
                <p>{suggestedDriver.licenseNo}</p>
                <p className="text-xs">Status: {suggestedDriver.status}</p>
              </div>
            ) : (
              <p className="mt-2 text-sm text-(--text-tertiary)">
                No available driver suggestions right now.
              </p>
            )}
            {suggestedDriver && (
              <Button
                type="button"
                variant="ghost"
                className="mt-3"
                onClick={() => onDriverChange(suggestedDriver._id)}
              >
                Use suggestion
              </Button>
            )}
          </div>
          <div className="rounded-xl border border-(--border-primary) bg-(--bg-primary) p-4">
            <p className="text-xs uppercase tracking-wide text-(--text-tertiary)">
              Suggested vehicle
            </p>
            {suggestedVehicle ? (
              <div className="mt-2 text-sm text-(--text-secondary)">
                <p className="text-base font-semibold text-(--text-primary)">
                  {suggestedVehicle.vehicleNo}
                </p>
                <p>{suggestedVehicle.model}</p>
                <p className="text-xs">
                  Capacity: {suggestedVehicle.capacityKg || "--"} kg
                </p>
              </div>
            ) : (
              <p className="mt-2 text-sm text-(--text-tertiary)">
                No available vehicle suggestions right now.
              </p>
            )}
            {suggestedVehicle && (
              <Button
                type="button"
                variant="ghost"
                className="mt-3"
                onClick={() => onVehicleChange(suggestedVehicle._id)}
              >
                Use suggestion
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-(--text-secondary) mb-1 block">
            {mode === "auto" ? "Driver (editable)" : "Driver"}
          </label>
          <select
            value={selectedDriverId || ""}
            onChange={(event) => onDriverChange(event.target.value)}
            className="w-full bg-(--bg-secondary) border border-(--border-primary) text-(--text-primary) rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-(--primary) focus:border-transparent"
          >
            <option value="">Select available driver</option>
            {drivers.map((driver) => (
              <option key={driver._id} value={driver._id}>
                {driver.name || "Unnamed driver"} · {driver.licenseNo}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-(--text-secondary) mb-1 block">
            {mode === "auto" ? "Vehicle (editable)" : "Vehicle"}
          </label>
          <select
            value={selectedVehicleId || ""}
            onChange={(event) => onVehicleChange(event.target.value)}
            className="w-full bg-(--bg-secondary) border border-(--border-primary) text-(--text-primary) rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-(--primary) focus:border-transparent"
          >
            <option value="">Select available vehicle</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle._id} value={vehicle._id}>
                {vehicle.vehicleNo} · {vehicle.model}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Card>
  );
}
