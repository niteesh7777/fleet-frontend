import { useEffect, useRef, useState } from "react";
import { FiMapPin, FiSearch } from "react-icons/fi";
import { cn } from "../../../utils/cn";

const NOMINATIM_ENDPOINT = "https://nominatim.openstreetmap.org/search";

export default function LocationAutocomplete({
  label,
  placeholder,
  onChange,
  value = null,
  className,
}) {
  const [query, setQuery] = useState(value?.label || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    setQuery(value?.label || "");
  }, [value?.label]);

  useEffect(() => {
    if (!query || query.length < 3) {
      setResults([]);
      return;
    }

    setLoading(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          format: "json",
          q: query,
          addressdetails: 1,
          limit: 5,
        });
        const response = await fetch(
          `${NOMINATIM_ENDPOINT}?${params.toString()}`,
          {
            headers: {
              "Accept-Language": "en",
              "User-Agent": "fleet-management-admin/1.0",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Geocode lookup failed");
        }
        const payload = await response.json();
        const mapped = payload.map((item) => ({
          label: item.display_name,
          lat: Number(item.lat),
          lng: Number(item.lon),
        }));
        setResults(mapped);
        setOpen(mapped.length > 0);
      } catch (error) {
        console.error(`Failed to fetch suggestions for ${label}`, error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [label, query]);

  const handleSelect = (location) => {
    onChange?.(location);
    setQuery(location.label);
    setResults([]);
    setOpen(false);
  };

  const handleBlur = () => {
    setTimeout(() => setOpen(false), 100);
  };

  return (
    <div className={cn("relative", className)}>
      <label className="block text-sm font-medium text-(--text-secondary) mb-1">
        {label}
      </label>
      <div className="relative">
        <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-tertiary)" />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            if (results.length > 0) setOpen(true);
          }}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full bg-(--bg-secondary) border border-(--border-primary) text-(--text-primary) rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-(--primary) focus:border-transparent"
        />
        {loading && (
          <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-(--text-tertiary)" />
        )}
      </div>
      {open && results.length > 0 && (
        <ul className="absolute z-40 mt-1 w-full max-h-60 overflow-y-auto rounded-lg border border-(--border-primary) bg-(--bg-elevated) shadow-lg">
          {results.map((location) => (
            <li
              key={`${location.lat}-${location.lng}`}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => handleSelect(location)}
              className="px-4 py-2 text-sm text-(--text-primary) hover:bg-(--bg-secondary) cursor-pointer"
            >
              {location.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
