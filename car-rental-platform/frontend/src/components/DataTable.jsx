import EmptyState from "./ui/EmptyState";
import { SkeletonRows } from "./ui/Skeleton";

// Same API as before (columns / rows / render). Optional: loading, emptyTitle, emptyDescription.
export default function DataTable({
  columns = [],
  rows = [],
  loading = false,
  emptyTitle = "Aucune donnee a afficher",
  emptyDescription,
  bare = false
}) {
  const safeRows = Array.isArray(rows) ? rows : [];

  return (
    <div className={bare ? "overflow-hidden" : "overflow-hidden rounded-card-secondary border bg-white shadow-soft"} style={bare ? undefined : { borderColor: "var(--line-color)" }}>
      <div className="overflow-x-auto">
        <table className="data-table min-w-full text-sm">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--line-color)" }}>
            {loading && safeRows.length === 0 ? (
              <tr>
                <td colSpan={Math.max(columns.length, 1)} className="!p-0">
                  <SkeletonRows columns={Math.min(Math.max(columns.length - 1, 2), 4)} />
                </td>
              </tr>
            ) : safeRows.length > 0 ? (
              safeRows.map((row, index) => (
                <tr key={row.id || index}>
                  {columns.map((column) => (
                    <td key={column.key}>
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={Math.max(columns.length, 1)} className="!p-0">
                  <EmptyState compact title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
