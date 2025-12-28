import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import LocationAutocomplete from "./LocationAutocomplete";

export default function TripDetailsSection({
  form,
  onFormChange,
  onSourceChange,
  onDestinationChange,
  clients,
}) {
  return (
    <Card className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-(--text-primary)">
          Trip Details
        </h2>
        <p className="text-sm text-(--text-secondary)">
          One screen to capture trip intent, route, and assignment.
        </p>
      </div>

      <div className="grid gap-6">
        <LocationAutocomplete
          label="Source location"
          placeholder="Search by city, address, or coordinates"
          value={form.source}
          onChange={onSourceChange}
        />

        <LocationAutocomplete
          label="Destination location"
          placeholder="Search by city, address, or coordinates"
          value={form.destination}
          onChange={onDestinationChange}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-(--text-secondary) mb-1 block">
            Client
          </label>
          <select
            value={form.clientId}
            onChange={(event) => onFormChange({ clientId: event.target.value })}
            className="w-full bg-(--bg-secondary) border border-(--border-primary) text-(--text-primary) rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-(--primary) focus:border-transparent"
          >
            <option value="">Select client</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-(--text-secondary) mb-1 block">
            Goods type
          </label>
          <Input
            placeholder="e.g., Electronics, Perishables"
            value={form.goodsType}
            onChange={(event) =>
              onFormChange({ goodsType: event.target.value })
            }
          />
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
