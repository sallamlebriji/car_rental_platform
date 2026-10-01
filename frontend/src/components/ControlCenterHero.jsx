import { motion } from "framer-motion";
import { Item, Stagger } from "./ui/Reveal";

export function HeroMetric({ label, value, hint, icon: Icon }) {
  return (
    <div className="rounded-2xl bg-white/[0.05] p-4 ring-1 ring-inset ring-white/[0.07] transition-colors duration-calm ease-calm hover:bg-white/[0.08]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400">{label}</p>
          <h3 className="mt-2 break-words font-display text-2xl font-semibold tracking-tight text-white">{value}</h3>
          {hint ? <p className="mt-2 text-xs leading-relaxed text-slate-500">{hint}</p> : null}
        </div>
        {Icon ? (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
            <Icon size={16} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

// Calm page hero for settings / control pages. `tone` kept for API compatibility.
export default function ControlCenterHero({ badge, title, description, metrics = [] }) {
  return (
    <section className="card-primary">
      <div
        className="anim-breathe pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full"
        style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--primary-color) 38%, transparent), transparent 70%)" }}
      />
      <Stagger className={`relative grid gap-6 p-6 md:p-8 ${metrics.length ? "xl:grid-cols-[1.1fr_0.9fr]" : ""} xl:items-center`} stagger={0.1}>
        <div className="space-y-4">
          {badge ? (
            <Item as="span" className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-300">
              {badge}
            </Item>
          ) : null}
          <Item>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">{title}</h1>
            {description ? <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400 md:text-base">{description}</p> : null}
          </Item>
        </div>

        {metrics.length ? (
          <Item className="grid gap-3 sm:grid-cols-2">
            {metrics.map((metric) => (
              <HeroMetric key={metric.label} {...metric} />
            ))}
          </Item>
        ) : null}
      </Stagger>
    </section>
  );
}
