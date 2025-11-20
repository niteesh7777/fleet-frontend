import { useState } from "react";
import useDrivers from "./hooks/useDrivers";

import DriversTable from "./components/DriversTable";
import AddDriverModal from "./components/AddDriverModal";
import EditDriverModal from "./components/EditDriverModal";
import DeleteDriverModal from "./components/DeleteDriverModal";

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
      <h1 className="text-3xl font-bold text-white mb-6">Drivers</h1>

      <div className="flex justify-between mb-4">
        <button
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          + Add Driver
        </button>
      </div>

      <input
        type="text"
        placeholder="Search drivers..."
        className="w-full mb-4 bg-[#1A1A1A] border border-gray-700 text-gray-200 px-3 py-2 rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p className="text-gray-400">Loading...</p>
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
