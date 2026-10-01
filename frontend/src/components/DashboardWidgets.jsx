import { motion } from "framer-motion";
import { currency } from "../utils/format";
import { DURATION, EASE } from "../motion";
import CountUp from "./ui/CountUp";

// value: number -> counts up on first view (use `format` for display); string -> shown as is.
export function DashboardKpi({ label, value, format, tone, hint, progress = 0, icon: Icon }) {
  return (
    <div className="card-interactive group relative overflow-hidden p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="eyebrow">{label}</p>
          <h3 className="mt-3 break-words font-display text-3xl font-semibold tracking-tight text-slate-900">
            {typeof value === "number" ? <CountUp value={value} format={format} /> : value}
          </h3>
        </div>
        {Icon ? (
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${tone} text-white shadow-sm`}>
            <Icon size={18} strokeWidth={2.2} />
          </div>
        ) : null}
      </div>
      <div className="mt-5 space-y-2">
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${tone}`}
            initial={{ width: 0 }}
            whileInView={{ width: `${Math.max(progress, 6)}%` }}
            viewport={{ once: true }}
            transition={{ duration: DURATION.counter, ease: EASE }}
          />
        </div>
        {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
      </div>
    </div>
  );
}

export function RevenueBars({ values = [], height = "h-64" }) {
  const max = Math.max(...values.map((item) => item.total), 1);

  return (
    <motion.div
      className={`flex ${height} items-end gap-3`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
    >
      {values.map((item) => (
        <div key={item.label} className="group flex h-full flex-1 flex-col items-center justify-end gap-3" title={currency(item.total)}>
          <div className="relative flex w-full flex-1 items-end">
            <motion.div
              className="w-full origin-bottom rounded-t-xl"
              style={{
                height: `${Math.max((item.total / max) * 100, 6)}%`,
                background: "linear-gradient(180deg, color-mix(in srgb, var(--primary-color) 85%, white), color-mix(in srgb, var(--primary-color) 40%, white))"
              }}
              variants={{
                hidden: { scaleY: 0, opacity: 0.4 },
                show: { scaleY: 1, opacity: 1, transition: { duration: DURATION.headline, ease: EASE } }
              }}
            />
          </div>
          <div className="text-center">
            <p className="text-xs font-semibold text-slate-700">{item.label}</p>
            <p className="text-[0.68rem] text-slate-500">{currency(item.total)}</p>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

export function StatusDonut({ items = [], centerLabel = "Total", centerValue }) {
  const computedTotal = centerValue ?? items.reduce((sum, item) => sum + item.value, 0);
  const total = computedTotal || 1;
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  let cumulative = 0;

  const segments = items.map((item) => {
    const share = item.value / total;
    const segment = { ...item, share, offset: cumulative };
    cumulative += share;
    return segment;
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[170px_1fr] lg:items-center">
      <div className="relative mx-auto h-40 w-40">
        <svg viewBox="0 0 120 120" className="h-40 w-40 -rotate-90">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="var(--surface-sunken)" strokeWidth="12" />
          {segments.map((segment, index) => (
            <motion.circle
              key={segment.label}
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth="12"
              strokeLinecap="butt"
              strokeDasharray={`${Math.max(segment.share * circumference - 2, 0)} ${circumference}`}
              strokeDashoffset={-segment.offset * circumference}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: segment.value > 0 ? 1 : 0 }}
              viewport={{ once: true }}
              transition={{ duration: DURATION.headline, ease: EASE, delay: index * 0.1 }}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="eyebrow !tracking-[0.12em]">{centerLabel}</span>
          <strong className="font-display text-3xl text-slate-900">{computedTotal}</strong>
        </div>
      </div>

      <div className="grid gap-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-xl px-3 py-2 transition-colors duration-calm ease-calm hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm font-medium text-slate-700">{item.label}</span>
            </div>
            <span className="text-sm font-semibold tabular-nums text-slate-900">{item.value}</span>
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
      {items.map((item, index) => (
        <div key={item.label} className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-800">{item.label}</p>
              {item.subLabel ? <p className="text-xs text-slate-500">{item.subLabel}</p> : null}
            </div>
            <span className="text-sm font-semibold tabular-nums text-slate-900">{formatter(item.value)}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, color-mix(in srgb, var(--primary-color) 60%, white), var(--primary-color))" }}
              initial={{ width: 0 }}
              whileInView={{ width: `${Math.max((item.value / max) * 100, 5)}%` }}
              viewport={{ once: true }}
              transition={{ duration: DURATION.headline, ease: EASE, delay: index * 0.08 }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
