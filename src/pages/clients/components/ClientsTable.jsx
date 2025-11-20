export default function ClientsTable({ clients, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-800">
      <table className="w-full text-left text-gray-300">
        <thead className="bg-[#1A1A1A]">
          <tr>
            <th className="px-4 py-3 border-b">#</th>
            <th className="px-4 py-3 border-b">Name</th>
            <th className="px-4 py-3 border-b">Email</th>
            <th className="px-4 py-3 border-b">Phone</th>
            <th className="px-4 py-3 border-b">City</th>
            <th className="px-4 py-3 border-b">GST</th>
            <th className="px-4 py-3 border-b">Actions</th>
          </tr>
        </thead>

        <tbody>
          {clients.length === 0 ? (
            <tr>
              <td colSpan="7" className="py-4 text-center text-gray-500">
                No clients found.
              </td>
            </tr>
          ) : (
            clients.map((c, i) => (
              <tr key={c._id} className="hover:bg-[#222] transition">
                <td className="px-4 py-3 border-b">{i + 1}</td>
                <td className="px-4 py-3 border-b">{c.name}</td>
                <td className="px-4 py-3 border-b">{c.email}</td>
                <td className="px-4 py-3 border-b">{c.phone}</td>
                <td className="px-4 py-3 border-b">{c.address?.city}</td>
                <td className="px-4 py-3 border-b">{c.gstNumber}</td>

                <td className="px-4 py-3 border-b">
                  <button
                    className="text-blue-400 mr-3"
                    onClick={() => onEdit(c)}
                  >
                    Edit
                  </button>

                  <button className="text-red-400" onClick={() => onDelete(c)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
