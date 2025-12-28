import { useState } from "react";
import useClients from "./hooks/useClients";
import { FiPlus, FiSearch } from "react-icons/fi";

import ClientsTable from "./components/ClientsTable";
import AddClientModal from "./components/AddClientModal";
import DeleteClientModal from "./components/DeleteClientModal";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import LoadingSkeleton from "../../components/ui/LoadingSkeleton";

export default function Clients() {
  const { clients, loading, createClient, deleteClient } = useClients();

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const filtered = clients.filter((c) =>
    `${c.name} ${c.contact?.person} ${c.contact?.phone} ${c.contact?.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">
        Clients
      </h1>

      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <Button onClick={() => setShowAdd(true)} icon={<FiPlus size={18} />}>
          Add Client
        </Button>

        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Search clients..."
            icon={<FiSearch size={18} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton type="table" count={5} />
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
