export function HeroMetric({ label, value, hint, icon: Icon }) {
  return (
    <div className="rounded-[1.8rem] bg-white/6 p-5 backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-300">{label}</p>
          <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">{value}</h3>
          {hint ? <p className="mt-3 text-sm leading-relaxed text-slate-400">{hint}</p> : null}
        </div>
        {Icon ? (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
            <Icon size={22} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function ControlCenterHero({
  badge,
  title,
  description,
  metrics = [],
  tone = "super"
}) {
  const background =
    tone === "admin"
      ? "bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.14),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.08),transparent_28%)]"
      : "bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.22),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.18),transparent_30%)]";

  return (
    <section className="relative overflow-hidden rounded-[2.2rem] bg-slate-950 px-7 py-8 text-white shadow-soft">
      <div className={`absolute inset-0 ${background}`} />
      <div className={`relative grid gap-6 ${metrics.length ? "xl:grid-cols-[1.1fr_0.9fr]" : ""} xl:items-start`}>
        <div className="space-y-5">
          {badge ? (
            <span className="inline-flex rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-300">
              {badge}
            </span>
          ) : null}
          <div>
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{title}</h1>
            {description ? <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-300 md:text-lg">{description}</p> : null}
          </div>
        </div>

        {metrics.length ? (
          <div className={`grid gap-4 ${metrics.length > 2 ? "sm:grid-cols-2 xl:grid-cols-2" : "sm:grid-cols-2"}`}>
            {metrics.map((metric) => (
              <HeroMetric key={metric.label} {...metric} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
