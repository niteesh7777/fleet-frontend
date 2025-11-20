export default function TripsTable({ trips, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-800">
      <table className="w-full text-left text-gray-300">
        <thead className="bg-[#1A1A1A]">
          <tr>
            <th className="px-4 py-3 border-b">#</th>
            <th className="px-4 py-3 border-b">Client</th>
            <th className="px-4 py-3 border-b">Driver</th>
            <th className="px-4 py-3 border-b">Vehicle</th>
            <th className="px-4 py-3 border-b">Route</th>
            <th className="px-4 py-3 border-b">Amount</th>
            <th className="px-4 py-3 border-b">Status</th>
            <th className="px-4 py-3 border-b">Actions</th>
          </tr>
        </thead>

        <tbody>
          {trips.length === 0 ? (
            <tr>
              <td colSpan="8" className="py-4 text-center text-gray-500">
                No trips found.
              </td>
            </tr>
          ) : (
            trips.map((t, i) => (
              <tr key={t._id} className="hover:bg-[#222] transition">
                <td className="px-4 py-3 border-b">{i + 1}</td>
                <td className="px-4 py-3 border-b">{t.client?.name}</td>
                <td className="px-4 py-3 border-b">{t.driver?.user?.name}</td>
                <td className="px-4 py-3 border-b">{t.vehicle?.vehicleNo}</td>
                <td className="px-4 py-3 border-b">
                  {t.startLocation} → {t.endLocation}
                </td>
                <td className="px-4 py-3 border-b">₹{t.totalAmount}</td>

                <td className="px-4 py-3 border-b">
                  <span className="px-2 py-1 bg-blue-700 rounded text-sm">
                    {t.status}
                  </span>
                </td>

                <td className="px-4 py-3 border-b">
                  <button
                    className="text-blue-400 mr-3"
                    onClick={() => onEdit(t)}
                  >
                    Edit
                  </button>

                  <button className="text-red-400" onClick={() => onDelete(t)}>
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
