// Placeholders that mirror the real layout instead of a spinner.
export function Skeleton({ className = "" }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />;
}

export function SkeletonKpi() {
  return (
    <div className="card space-y-4 p-5">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-9 w-32" />
      <Skeleton className="h-2 w-full" />
    </div>
  );
}

export function SkeletonRows({ rows = 5, columns = 4 }) {
  return (
    <div className="divide-y" style={{ borderColor: "var(--line-color)" }} aria-busy="true">
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="flex items-center gap-4 px-5 py-4">
          <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
          {Array.from({ length: columns }).map((__, col) => (
            <Skeleton key={col} className={`h-3 ${col === 0 ? "w-40" : "w-24"}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonBlock({ className = "h-64" }) {
  return <Skeleton className={`w-full rounded-card-info ${className}`} />;
}
