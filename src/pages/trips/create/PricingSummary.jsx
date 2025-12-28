import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import { FiInfo } from "react-icons/fi";

const formatDuration = (minutes) => {
  if (minutes <= 0) return "--";
  const rounded = Math.round(minutes);
  const hours = Math.floor(rounded / 60);
  const mins = rounded % 60;
  if (hours === 0) return `${mins}m`;
  return `${hours}h ${mins}m`;
};

export default function PricingSummary({
  distanceKm,
  ratePerKm,
  durationMin,
  onRateChange,
  totalPrice,
  isCalculating,
}) {
  return (
    <Card className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-(--text-primary)">
          Route & Cost
        </h2>
        <p className="text-sm text-(--text-secondary)">
          Distance and pricing auto-calculate while you adjust the rate per km.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-(--text-tertiary)">Distance</p>
          <p className="text-2xl font-semibold text-(--text-primary)">
            {isCalculating
              ? "--"
              : distanceKm > 0
                ? `${distanceKm.toFixed(1)} km`
                : "--"}
          </p>
        </div>
        <div>
          <p className="text-sm text-(--text-tertiary)">Duration (est.)</p>
          <p className="text-2xl font-semibold text-(--text-primary)">
            {isCalculating ? "--" : formatDuration(durationMin)}
          </p>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-(--text-secondary) mb-1 block">
          Rate per km
        </label>
        <Input
          type="number"
          min={0}
          step={0.5}
          value={ratePerKm}
          onChange={(event) => onRateChange(Number(event.target.value) || 0)}
        />
      </div>

      <div className="rounded-lg border border-(--border-primary) bg-(--bg-primary) p-4">
        <p className="text-sm text-(--text-secondary) flex items-center gap-2">
          <FiInfo /> Total price formula
        </p>
        <p className="text-lg font-semibold text-(--text-primary) mt-2">
          {isCalculating
            ? "distance × rate"
            : `${distanceKm.toFixed(1)} km × ₹${ratePerKm.toFixed(2)} = ₹${totalPrice.toLocaleString()}`}
        </p>
      </div>
    </Card>
  );
}
