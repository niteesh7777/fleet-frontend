import { useEffect, useState } from "react";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import LoadingSkeleton from "../../../components/ui/LoadingSkeleton";
import api from "../../../api/axiosClient";
import toast from "react-hot-toast";

export default function RoleManagement() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRole, setEditingRole] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    permissions: [],
  });

  // Available permissions
  const availablePermissions = [
    "read_users",
    "write_users",
    "delete_users",
    "read_vehicles",
    "write_vehicles",
    "delete_vehicles",
    "read_trips",
    "write_trips",
    "delete_trips",
    "read_routes",
    "write_routes",
    "delete_routes",
    "read_maintenance",
    "write_maintenance",
    "delete_maintenance",
    "read_clients",
    "write_clients",
    "delete_clients",
    "read_analytics",
    "admin_access",
  ];

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await api.get("/roles");
      setRoles(response.data.data || []);
    } catch {
      console.error("Failed to fetch roles");
      toast.error("Failed to load roles");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (role) => {
    setEditingRole(role._id);
    setEditForm({
      name: role.name,
      permissions: role.permissions || [],
    });
  };

  const handleCancelEdit = () => {
    setEditingRole(null);
    setEditForm({ name: "", permissions: [] });
  };

  const handleSave = async () => {
    try {
      await api.put(`/roles/${editingRole}`, editForm);
      toast.success("Role updated successfully");
      setEditingRole(null);
      setEditForm({ name: "", permissions: [] });
      fetchRoles();
    } catch {
      toast.error("Failed to update role");
    }
  };

  const togglePermission = (permission) => {
    setEditForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  if (loading) {
    return (
      <Card>
        <LoadingSkeleton type="table" />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">
          Role Management
        </h2>
        <p className="text-[var(--text-secondary)]">
          Configure roles and their permissions.
        </p>
      </div>

      {/* Roles List */}
      <div className="space-y-4">
        {roles.map((role) => (
          <Card key={role._id}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-[var(--text-primary)]">
                  {role.name}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  {role.permissions?.length || 0} permissions assigned
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleEdit(role)}
                disabled={editingRole === role._id}
              >
                <FaEdit />
              </Button>
            </div>

            {editingRole === role._id ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
                    Role Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] rounded-lg py-2 px-3"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
                    Permissions
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availablePermissions.map((permission) => (
                      <label
                        key={permission}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={editForm.permissions.includes(permission)}
                          onChange={() => togglePermission(permission)}
                          className="rounded border-[var(--border-primary)] text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-[var(--text-secondary)]">
                          {permission
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                    <FaTimes className="mr-1" />
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    <FaSave className="mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Permissions:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {role.permissions?.length > 0 ? (
                    role.permissions.map((permission) => (
                      <span
                        key={permission}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {permission
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-[var(--text-secondary)]">
                      No permissions assigned
                    </span>
                  )}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {roles.length === 0 && (
        <Card>
          <div className="text-center py-8">
            <p className="text-[var(--text-secondary)]">No roles found.</p>
          </div>
        </Card>
      )}
    </div>
  );
}
