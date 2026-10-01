export default function StatCard({ label, value, hint }) {
  return (
    <div className="card p-5">
      <p className="eyebrow">{label}</p>
      <h3 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{value}</h3>
      {hint ? <p className="mt-2 text-sm leading-relaxed text-slate-500">{hint}</p> : null}
    </div>
  );
}
