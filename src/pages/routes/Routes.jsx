import { useState, useMemo } from "react";
import useRoutesApi from "../../hooks/useRoutesApi";
import { FiPlus, FiSearch, FiRefreshCw } from "react-icons/fi";

import RoutesTable from "./components/RoutesTable";
import RouteMapModal from "../../components/RouteMapModal";
import EditRouteModal from "./components/EditRouteModal";
import DeleteRouteModal from "./components/DeleteRouteModal";
import RouteFilters from "./components/RouteFilters";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import LoadingSkeleton from "../../components/ui/LoadingSkeleton";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

export default function Routes() {
  const {
    routes,
    loading,
    createRoute,
    updateRoute,
    deleteRoute,
    searchRoutes,
    filterRoutes,
    refreshRoutes,
    getRouteStats,
  } = useRoutesApi();

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [selectedRoute, setSelectedRoute] = useState(null);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // Apply search and filters
  const filteredRoutes = useMemo(() => {
    let result = routes;

    // Apply search
    if (search.trim()) {
      const searchTerm = search.toLowerCase().trim();
      result = result.filter(
        (route) =>
          route.name?.toLowerCase().includes(searchTerm) ||
          route.source?.name?.toLowerCase().includes(searchTerm) ||
          route.destination?.name?.toLowerCase().includes(searchTerm) ||
          route.waypoints?.some((wp) =>
            wp.name?.toLowerCase().includes(searchTerm)
          )
      );
    }

    // Apply filters
    if (Object.keys(filters).length > 0) {
      result = result.filter((route) => {
        if (
          filters.isActive !== undefined &&
          route.isActive !== filters.isActive
        ) {
          return false;
        }

        if (filters.minDistance && route.distanceKm < filters.minDistance) {
          return false;
        }

        if (filters.maxDistance && route.distanceKm > filters.maxDistance) {
          return false;
        }

        if (filters.vehicleTypes?.length > 0) {
          const hasMatchingVehicle = route.preferredVehicleTypes?.some((type) =>
            filters.vehicleTypes.includes(type)
          );
          if (!hasMatchingVehicle) return false;
        }

        return true;
      });
    }

    return result;
  }, [routes, search, filters]);

  const stats = useMemo(() => getRouteStats(), [getRouteStats]);

  const handleEdit = (route) => {
    setSelectedRoute(route);
    setShowEdit(true);
  };

  const handleDelete = (route) => {
    setSelectedRoute(route);
    setShowDelete(true);
  };

  const handleDeleteConfirm = async (id) => {
    await deleteRoute(id);
    setShowDelete(false);
    setSelectedRoute(null);
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
            Routes
          </h1>
          <div className="flex gap-4">
            <Badge variant="primary">Total: {stats.total}</Badge>
            <Badge variant="success">Active: {stats.active}</Badge>
            <Badge variant="secondary">Inactive: {stats.inactive}</Badge>
          </div>
        </div>

        <Button
          variant="ghost"
          icon={<FiRefreshCw size={18} />}
          onClick={refreshRoutes}
          disabled={loading}
        >
          Refresh
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
        <div className="flex gap-3">
          <Button onClick={() => setShowAdd(true)} icon={<FiPlus size={18} />}>
            Add Route
          </Button>
          <RouteFilters currentFilters={filters} onFilterChange={setFilters} />
        </div>

        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Search routes by name, source, destination..."
            icon={<FiSearch size={18} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Card>
        {loading ? (
          <LoadingSkeleton count={5} />
        ) : (
          <>
            <div className="p-4 border-b border-[var(--border-primary)]">
              <p className="text-sm text-[var(--text-secondary)]">
                Showing {filteredRoutes.length} of {stats.total} routes
                {stats.totalDistance > 0 && (
                  <span className="ml-4">
                    Total Network: {stats.totalDistance.toLocaleString()} km
                  </span>
                )}
              </p>
            </div>
            <RoutesTable
              routes={filteredRoutes}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </>
        )}
      </Card>

      <RouteMapModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onSubmit={createRoute}
      />

      <EditRouteModal
        route={showEdit ? selectedRoute : null}
        onClose={() => {
          setShowEdit(false);
          setSelectedRoute(null);
        }}
        onSubmit={updateRoute}
      />

      <DeleteRouteModal
        route={showDelete ? selectedRoute : null}
        onClose={() => {
          setShowDelete(false);
          setSelectedRoute(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
