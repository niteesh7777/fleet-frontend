import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiX } from "react-icons/fi";
import { MdRoute } from "react-icons/md";
import { FaCarSide, FaIdBadge, FaUsers } from "react-icons/fa";
import api from "../api/axiosClient";

/**
 * Global search component
 * Allows searching across all entities (vehicles, drivers, trips, etc.)
 */
export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({
    vehicles: [],
    drivers: [],
    trips: [],
    clients: [],
  });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Listen for Ctrl+K to open search
  useEffect(() => {
    const handleOpenSearch = () => {
      setIsOpen(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    };

    document.addEventListener("openGlobalSearch", handleOpenSearch);
    return () =>
      document.removeEventListener("openGlobalSearch", handleOpenSearch);
  }, []);

  // Search across all entities
  useEffect(() => {
    if (!query.trim()) {
      setResults({ vehicles: [], drivers: [], trips: [], clients: [] });
      return;
    }

    const searchTimer = setTimeout(async () => {
      setLoading(true);
      try {
        const [vehiclesRes, driversRes, tripsRes, clientsRes] =
          await Promise.all([
            api
              .get("/vehicles")
              .catch(() => ({ data: { data: { vehicles: [] } } })),
            api
              .get("/drivers")
              .catch(() => ({ data: { data: { drivers: [] } } })),
            api.get("/trips").catch(() => ({ data: { data: { items: [] } } })),
            api
              .get("/clients")
              .catch(() => ({ data: { data: { clients: [] } } })),
          ]);

        const searchLower = query.toLowerCase();

        setResults({
          vehicles: (vehiclesRes.data.data?.vehicles || [])
            .filter(
              (v) =>
                v.vehicleNo?.toLowerCase().includes(searchLower) ||
                v.model?.toLowerCase().includes(searchLower)
            )
            .slice(0, 5),
          drivers: (driversRes.data.data?.drivers || [])
            .filter(
              (d) =>
                d.user?.name?.toLowerCase().includes(searchLower) ||
                d.licenseNo?.toLowerCase().includes(searchLower)
            )
            .slice(0, 5),
          trips: (tripsRes.data.data?.items || [])
            .filter(
              (t) =>
                t.tripCode?.toLowerCase().includes(searchLower) ||
                t.client?.name?.toLowerCase().includes(searchLower)
            )
            .slice(0, 5),
          clients: (clientsRes.data.data?.clients || [])
            .filter(
              (c) =>
                c.name?.toLowerCase().includes(searchLower) ||
                c.email?.toLowerCase().includes(searchLower)
            )
            .slice(0, 5),
        });
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimer);
  }, [query]);

  const handleResultClick = (type, id) => {
    setIsOpen(false);
    setQuery("");
    navigate(`/dashboard/${type}`);
  };

  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
  };

  if (!isOpen) return null;

  const totalResults =
    results.vehicles.length +
    results.drivers.length +
    results.trips.length +
    results.clients.length;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Search Modal */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4">
        <div className="bg-[var(--bg-elevated)] rounded-lg shadow-2xl border border-[var(--border-primary)] overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center px-4 py-3 border-b border-[var(--border-primary)]">
            <FiSearch className="text-[var(--text-secondary)] mr-3" size={20} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search vehicles, drivers, trips, clients..."
              className="flex-1 bg-transparent text-[var(--text-primary)] outline-none placeholder-[var(--text-tertiary)]"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1"
              >
                <FiX size={18} />
              </button>
            )}
            <kbd className="ml-3 px-2 py-1 text-xs bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto p-2">
            {loading ? (
              <div className="text-center py-8 text-[var(--text-secondary)]">
                Searching...
              </div>
            ) : query && totalResults === 0 ? (
              <div className="text-center py-8 text-[var(--text-secondary)]">
                No results found for "{query}"
              </div>
            ) : (
              <>
                {results.vehicles.length > 0 && (
                  <SearchResultSection
                    title="Vehicles"
                    icon={<FaCarSide />}
                    items={results.vehicles}
                    onItemClick={(item) =>
                      handleResultClick("vehicles", item._id)
                    }
                    renderItem={(v) => (
                      <>
                        <div className="font-medium">{v.vehicleNo}</div>
                        <div className="text-sm text-[var(--text-secondary)]">
                          {v.model} - {v.type}
                        </div>
                      </>
                    )}
                  />
                )}

                {results.drivers.length > 0 && (
                  <SearchResultSection
                    title="Drivers"
                    icon={<FaIdBadge />}
                    items={results.drivers}
                    onItemClick={(item) =>
                      handleResultClick("drivers", item._id)
                    }
                    renderItem={(d) => (
                      <>
                        <div className="font-medium">{d.user?.name}</div>
                        <div className="text-sm text-[var(--text-secondary)]">
                          License: {d.licenseNo}
                        </div>
                      </>
                    )}
                  />
                )}

                {results.trips.length > 0 && (
                  <SearchResultSection
                    title="Trips"
                    icon={<MdRoute />}
                    items={results.trips}
                    onItemClick={(item) => handleResultClick("trips", item._id)}
                    renderItem={(t) => (
                      <>
                        <div className="font-medium">{t.tripCode}</div>
                        <div className="text-sm text-[var(--text-secondary)]">
                          {t.client?.name} - {t.status}
                        </div>
                      </>
                    )}
                  />
                )}

                {results.clients.length > 0 && (
                  <SearchResultSection
                    title="Clients"
                    icon={<FaUsers />}
                    items={results.clients}
                    onItemClick={(item) =>
                      handleResultClick("clients", item._id)
                    }
                    renderItem={(c) => (
                      <>
                        <div className="font-medium">{c.name}</div>
                        <div className="text-sm text-[var(--text-secondary)]">
                          {c.email}
                        </div>
                      </>
                    )}
                  />
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-[var(--border-primary)] bg-[var(--bg-secondary)] text-xs text-[var(--text-tertiary)] flex items-center justify-between">
            <span>Press Ctrl+K to open search anytime</span>
            {totalResults > 0 && <span>{totalResults} results found</span>}
          </div>
        </div>
      </div>
    </>
  );
}

function SearchResultSection({ title, icon, items, onItemClick, renderItem }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 px-2 py-1 text-xs font-semibold text-[var(--text-tertiary)] uppercase">
        {icon}
        {title}
      </div>
      <div className="space-y-1">
        {items.map((item) => (
          <button
            key={item._id}
            onClick={() => onItemClick(item)}
            className="w-full text-left px-3 py-2 rounded hover:bg-[var(--bg-secondary)] transition-colors"
          >
            <div className="text-[var(--text-primary)]">{renderItem(item)}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
