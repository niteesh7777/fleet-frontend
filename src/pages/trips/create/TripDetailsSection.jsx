import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import LocationAutocomplete from "./LocationAutocomplete";

export default function TripDetailsSection({
  form,
  onFormChange,
  onSourceChange,
  onDestinationChange,
  clients,
  errors = {},
}) {
  return (
    <Card className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-(--text-primary)">
          Trip Details
        </h2>
        <p className="text-sm text-(--text-secondary)">
          Enter source, destination, client, and goods information
        </p>
      </div>

      <div className="grid gap-6">
        <div>
          <LocationAutocomplete
            label="Source location *"
            placeholder="Search by city, address, or coordinates"
            value={form.source}
            onChange={onSourceChange}
          />
          {errors.source && (
            <p className="text-xs text-[var(--danger)] mt-1">{errors.source}</p>
          )}
        </div>

        <div>
          <LocationAutocomplete
            label="Destination location *"
            placeholder="Search by city, address, or coordinates"
            value={form.destination}
            onChange={onDestinationChange}
          />
          {errors.destination && (
            <p className="text-xs text-[var(--danger)] mt-1">
              {errors.destination}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-(--text-secondary) mb-1 block">
            Client *
          </label>
          <select
            value={form.clientId}
            onChange={(event) => onFormChange({ clientId: event.target.value })}
            className={`w-full bg-(--bg-secondary) border text-(--text-primary) rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-(--primary) focus:border-transparent ${
              errors.clientId
                ? "border-[var(--danger)]"
                : "border-(--border-primary)"
            }`}
          >
            <option value="">Select client</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.name}
              </option>
            ))}
          </select>
          {errors.clientId && (
            <p className="text-xs text-[var(--danger)] mt-1">
              {errors.clientId}
            </p>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-(--text-secondary) mb-1 block">
            Goods type *
          </label>
          <Input
            placeholder="e.g., Electronics, Perishables"
            value={form.goodsType}
            onChange={(event) =>
              onFormChange({ goodsType: event.target.value })
            }
            className={errors.goodsType ? "border-[var(--danger)]" : ""}
          />
          {errors.goodsType && (
            <p className="text-xs text-[var(--danger)] mt-1">
              {errors.goodsType}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="text-sm font-medium text-(--text-secondary) mb-1 block">
            Quantity / weight (kg)
          </label>
          <Input
            type="number"
            min={0}
            step={0.1}
            placeholder="Optional"
            value={form.quantity}
            onChange={(event) => onFormChange({ quantity: event.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-(--text-secondary) mb-1 block">
            Start time
          </label>
          <Input
            type="datetime-local"
            value={form.startTime}
            onChange={(event) =>
              onFormChange({ startTime: event.target.value })
            }
          />
        </div>
        <div>
          <label className="text-sm font-medium text-(--text-secondary) mb-1 block">
            Internal notes
          </label>
          <Input
            placeholder="Optional"
            value={form.notes}
            onChange={(event) => onFormChange({ notes: event.target.value })}
          />
        </div>
      </div>
    </Card>
  );
}
