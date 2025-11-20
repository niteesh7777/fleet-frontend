export default function DriversTable({ drivers, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-800">
      <table className="w-full text-left text-gray-300">
        <thead className="bg-[#1A1A1A]">
          <tr>
            <th className="px-4 py-3 border-b border-gray-800">#</th>
            <th className="px-4 py-3 border-b border-gray-800">Name</th>
            <th className="px-4 py-3 border-b border-gray-800">Email</th>
            <th className="px-4 py-3 border-b border-gray-800">Phone</th>
            <th className="px-4 py-3 border-b border-gray-800">License No</th>
            <th className="px-4 py-3 border-b border-gray-800">Exp</th>
            <th className="px-4 py-3 border-b border-gray-800">Status</th>
            <th className="px-4 py-3 border-b border-gray-800">Actions</th>
          </tr>
        </thead>

        <tbody>
          {drivers.length === 0 ? (
            <tr>
              <td colSpan="8" className="py-4 text-center text-gray-500">
                No drivers found.
              </td>
            </tr>
          ) : (
            drivers.map((d, i) => (
              <tr key={d._id} className="hover:bg-[#222] transition">
                <td className="px-4 py-3 border-b border-gray-800">{i + 1}</td>
                <td className="px-4 py-3 border-b border-gray-800">
                  {d.user?.name}
                </td>
                <td className="px-4 py-3 border-b border-gray-800">
                  {d.user?.email}
                </td>
                <td className="px-4 py-3 border-b border-gray-800">
                  {d.contact.phone}
                </td>
                <td className="px-4 py-3 border-b border-gray-800">
                  {d.licenseNo}
                </td>
                <td className="px-4 py-3 border-b border-gray-800">
                  {d.experienceYears}
                </td>

                <td className="px-4 py-3 border-b border-gray-800">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      d.status === "active"
                        ? "bg-green-700"
                        : d.status === "on-trip"
                        ? "bg-yellow-600"
                        : "bg-gray-600"
                    }`}
                  >
                    {d.status}
                  </span>
                </td>

                <td className="px-4 py-3 border-b border-gray-800">
                  <button
                    className="text-blue-400 hover:text-blue-500 mr-3"
                    onClick={() => onEdit(d)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-400 hover:text-red-500"
                    onClick={() => onDelete(d)}
                  >
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
