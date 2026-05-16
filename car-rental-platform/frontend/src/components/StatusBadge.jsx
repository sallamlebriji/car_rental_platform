const tones = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-emerald-100 text-emerald-700",
  REFUSED: "bg-rose-100 text-rose-700",
  CANCELLED: "bg-slate-200 text-slate-700",
  COMPLETED: "bg-sky-100 text-sky-700",
  AVAILABLE: "bg-emerald-100 text-emerald-700",
  RENTED: "bg-amber-100 text-amber-700",
  MAINTENANCE: "bg-orange-100 text-orange-700",
  DISABLED: "bg-slate-200 text-slate-700"
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${tones[status] || "bg-slate-100 text-slate-700"}`}>
      {status}
    </span>
  );
}
