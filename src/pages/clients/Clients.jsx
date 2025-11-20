import { useState } from "react";
import useClients from "./hooks/useClients";

import ClientsTable from "./components/ClientsTable";
import AddClientModal from "./components/AddClientModal";
import DeleteClientModal from "./components/DeleteClientModal";

export default function Clients() {
  const { clients, loading, createClient, updateClient, deleteClient } =
    useClients();

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const filtered = clients.filter((c) =>
    `${c.name} ${c.email} ${c.phone}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-3xl text-white font-bold mb-6">Clients</h1>

      <div className="flex justify-between mb-4">
        <button
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Client
        </button>
      </div>

      <input
        className="w-full bg-[#1A1A1A] border border-gray-700 text-gray-200 px-3 py-2 rounded mb-4"
        placeholder="Search clients..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <ClientsTable
          clients={filtered}
          onEdit={(client) => {
            setSelected(client);
            setShowEdit(true);
          }}
          onDelete={(client) => {
            setSelected(client);
            setShowDelete(true);
          }}
        />
      )}

      <AddClientModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSubmit={createClient}
      />

      <DeleteClientModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        client={selected}
        onConfirm={deleteClient}
      />

      {/* EditClientModal will be added next */}
    </div>
  );
}
