import { useState } from "react";
import useDrivers from "./hooks/useDrivers";
import { FiPlus, FiSearch } from "react-icons/fi";

import DriversTable from "./components/DriversTable";
import AddDriverModal from "./components/AddDriverModal";
import EditDriverModal from "./components/EditDriverModal";
import DeleteDriverModal from "./components/DeleteDriverModal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import LoadingSkeleton from "../../components/ui/LoadingSkeleton";

export default function Drivers() {
  const { drivers, loading, createDriver, updateDriver, deleteDriver } =
    useDrivers();

  const [search, setSearch] = useState("");
  const [selectedDriver, setSelectedDriver] = useState(null);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const filtered = drivers.filter((d) => {
    const s = search.toLowerCase();
    return (
      d.user?.name.toLowerCase().includes(s) ||
      d.user?.email.toLowerCase().includes(s) ||
      d.licenseNo.toLowerCase().includes(s) ||
      d.contact.phone.includes(s)
    );
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">Drivers</h1>

      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <Button
          onClick={() => setShowAdd(true)}
          icon={<FiPlus size={18} />}
        >
          Add Driver
        </Button>

        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Search drivers..."
            icon={<FiSearch size={18} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton type="table" count={5} />
      ) : (
        <DriversTable
          drivers={filtered}
          onEdit={(d) => {
            setSelectedDriver(d);
            setShowEdit(true);
          }}
          onDelete={(d) => {
            setSelectedDriver(d);
            setShowDelete(true);
          }}
        />
      )}

      <AddDriverModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSubmit={async (form) => {
          await createDriver(form);
          setShowAdd(false);
        }}
      />

      <EditDriverModal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        driver={selectedDriver}
        onSubmit={async (id, form) => {
          await updateDriver(id, form);
          setShowEdit(false);
        }}
      />

      <DeleteDriverModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        driver={selectedDriver}
        onConfirm={async (id) => {
          await deleteDriver(id);
          setShowDelete(false);
        }}
      />
    </div>
  );
}
