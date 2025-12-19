import { useState } from "react";
import useMaintenance from "./hooks/useMaintenance";
import { FiPlus, FiSearch } from "react-icons/fi";

import MaintenanceTable from "./components/MaintenanceTable";
import AddMaintenanceModal from "./components/AddMaintenanceModal";
import EditMaintenanceModal from "./components/EditMaintenanceModal";
import DeleteMaintenanceModal from "./components/DeleteMaintenanceModal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import LoadingSkeleton from "../../components/ui/LoadingSkeleton";
import Card from "../../components/ui/Card";

export default function Maintenance() {
    const {
        logs,
        loading,
        createMaintenance,
        updateMaintenance,
        deleteMaintenance,
    } = useMaintenance();

    const [search, setSearch] = useState("");
    const [selectedLog, setSelectedLog] = useState(null);

    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const filtered = logs.filter((log) =>
        `${log.vehicleId?.vehicleNo} ${log.serviceType} ${log.description} ${log.vendor?.name}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    const handleEdit = (log) => {
        setSelectedLog(log);
        setShowEdit(true);
    };

    const handleDelete = (log) => {
        setSelectedLog(log);
        setShowDelete(true);
    };

    const handleDeleteConfirm = async (id) => {
        await deleteMaintenance(id);
        setShowDelete(false);
        setSelectedLog(null);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">
                Maintenance
            </h1>

            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <Button onClick={() => setShowAdd(true)} icon={<FiPlus size={18} />}>
                    Add Maintenance Log
                </Button>

                <div className="relative flex-1 max-w-md">
                    <Input
                        placeholder="Search maintenance logs..."
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
                    <MaintenanceTable
                        logs={filtered}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}
            </Card>

            <AddMaintenanceModal
                isOpen={showAdd}
                onClose={() => setShowAdd(false)}
                onSubmit={createMaintenance}
            />

            <EditMaintenanceModal
                log={showEdit ? selectedLog : null}
                onClose={() => {
                    setShowEdit(false);
                    setSelectedLog(null);
                }}
                onSubmit={updateMaintenance}
            />

            <DeleteMaintenanceModal
                log={showDelete ? selectedLog : null}
                onClose={() => {
                    setShowDelete(false);
                    setSelectedLog(null);
                }}
                onConfirm={handleDeleteConfirm}
            />
        </div>
    );
}
