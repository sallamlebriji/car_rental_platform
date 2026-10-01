const palette = ["#0f766e", "#2563eb", "#7c3aed", "#db2777", "#ea580c", "#0891b2", "#4f46e5", "#65a30d"];

function pick(seed = "") {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) % 997;
  return palette[hash % palette.length];
}

export function initials(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase() || "?";
}

export default function Avatar({ name, size = 36 }) {
  const color = pick(name);
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: `linear-gradient(135deg, ${color}, color-mix(in srgb, ${color} 70%, black))`
      }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}

// Avatar + primary line + secondary line, for table cells.
export function PersonCell({ name, subtitle }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar name={name} />
      <div className="min-w-0">
        <p className="truncate font-medium text-slate-900">{name}</p>
        {subtitle ? <p className="truncate text-xs text-slate-500">{subtitle}</p> : null}
      </div>
    </div>
  );
}
