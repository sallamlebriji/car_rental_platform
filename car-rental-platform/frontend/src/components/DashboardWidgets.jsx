import { currency } from "../utils/format";

export function DashboardKpi({ label, value, tone, hint, progress = 0, icon: Icon }) {
  return (
    <div className="overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white shadow-soft">
      <div className={`h-1.5 bg-gradient-to-r ${tone}`} />
      <div className="space-y-4 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <h3 className="mt-3 break-words text-3xl font-semibold text-slate-900 md:text-4xl">{value}</h3>
          </div>
          <div className={`flex h-14 w-14 shrink-0 items-center justify-center self-start rounded-2xl bg-gradient-to-br ${tone} text-white/90 shadow-sm`}>
            {Icon ? <Icon size={24} strokeWidth={2.2} /> : null}
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div className={`h-full rounded-full bg-gradient-to-r ${tone}`} style={{ width: `${Math.max(progress, 8)}%` }} />
          </div>
          <p className="text-xs text-slate-500">{hint}</p>
        </div>
      </div>
    </div>
  );
}

export function RevenueBars({ values = [] }) {
  const max = Math.max(...values.map((item) => item.total), 1);

  return (
    <div className="flex h-72 items-end gap-3">
      {values.map((item) => (
        <div key={item.label} className="flex flex-1 flex-col items-center gap-3">
          <div className="w-full rounded-t-[1.4rem] bg-gradient-to-t from-teal-600 via-cyan-500 to-sky-400" style={{ height: `${Math.max((item.total / max) * 100, 8)}%` }} />
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-700">{item.label}</p>
            <p className="text-xs text-slate-500">{currency(item.total)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function StatusDonut({ items = [], centerLabel = "Total", centerValue }) {
  const computedTotal = centerValue ?? items.reduce((sum, item) => sum + item.value, 0);
  const total = computedTotal || 1;
  let cumulative = 0;
  const segments = items.map((item) => {
    const start = cumulative / total;
    cumulative += item.value;
    const end = cumulative / total;
    return { ...item, start, end };
  });

  function polarToCartesian(cx, cy, r, angle) {
    const radians = ((angle - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(radians), y: cy + r * Math.sin(radians) };
  }

  function describeArc(start, end) {
    const startPoint = polarToCartesian(60, 60, 46, end * 360);
    const endPoint = polarToCartesian(60, 60, 46, start * 360);
    const largeArcFlag = end - start > 0.5 ? 1 : 0;
    return `M ${startPoint.x} ${startPoint.y} A 46 46 0 ${largeArcFlag} 0 ${endPoint.x} ${endPoint.y}`;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[180px_1fr] lg:items-center">
      <div className="relative mx-auto h-40 w-40">
        <svg viewBox="0 0 120 120" className="h-40 w-40 -rotate-90">
          <circle cx="60" cy="60" r="46" fill="none" stroke="#e2e8f0" strokeWidth="18" />
          {segments.map((segment) => (
            <path
              key={segment.label}
              d={describeArc(segment.start, segment.end)}
              fill="none"
              stroke={segment.color}
              strokeWidth="18"
              strokeLinecap="round"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-sm text-slate-500">{centerLabel}</span>
          <strong className="text-3xl text-slate-900">{total}</strong>
        </div>
      </div>

      <div className="grid gap-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="h-3.5 w-3.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="font-medium text-slate-700">{item.label}</span>
            </div>
            <span className="text-sm font-semibold text-slate-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HorizontalMetricBars({ items = [], formatter = (value) => value }) {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.label} className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-slate-800">{item.label}</p>
              {item.subLabel ? <p className="text-xs text-slate-500">{item.subLabel}</p> : null}
            </div>
            <span className="text-sm font-semibold text-slate-900">{formatter(item.value)}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500"
              style={{ width: `${Math.max((item.value / max) * 100, 6)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
