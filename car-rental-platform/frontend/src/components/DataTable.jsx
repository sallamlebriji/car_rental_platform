export default function DataTable({ columns = [], rows = [] }) {
  const safeRows = Array.isArray(rows) ? rows : [];

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-5 py-4 font-medium">{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {safeRows.length > 0 ? (
              safeRows.map((row, index) => (
                <tr key={row.id || index} className="border-t border-slate-100">
                  {columns.map((column) => (
                    <td key={column.key} className="px-5 py-4 align-top text-slate-700">
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr className="border-t border-slate-100">
                <td colSpan={Math.max(columns.length, 1)} className="px-5 py-8 text-center text-slate-500">
                  Aucune donnée à afficher.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
