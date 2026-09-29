// Soft tinted badge with a status dot. The displayed label is unchanged.
const tones = {
  PENDING: "bg-amber-50 text-amber-700 ring-amber-600/15",
  CONFIRMED: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  REFUSED: "bg-rose-50 text-rose-700 ring-rose-600/15",
  CANCELLED: "bg-slate-100 text-slate-600 ring-slate-500/15",
  COMPLETED: "bg-sky-50 text-sky-700 ring-sky-600/15",
  AVAILABLE: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  RENTED: "bg-amber-50 text-amber-700 ring-amber-600/15",
  MAINTENANCE: "bg-orange-50 text-orange-700 ring-orange-600/15",
  DISABLED: "bg-slate-100 text-slate-600 ring-slate-500/15",
  PAID: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  PARTIALLY_PAID: "bg-amber-50 text-amber-700 ring-amber-600/15",
  REFUNDED: "bg-sky-50 text-sky-700 ring-sky-600/15"
};

const live = new Set(["PENDING", "RENTED", "PARTIALLY_PAID"]);

export default function StatusBadge({ status }) {
  const tone = tones[status] || "bg-slate-100 text-slate-600 ring-slate-500/15";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold tracking-wide ring-1 ring-inset ${tone}`}>
      <span className={`h-1.5 w-1.5 rounded-full bg-current ${live.has(status) ? "anim-pulse-dot" : ""}`} />
      {status}
    </span>
  );
}
