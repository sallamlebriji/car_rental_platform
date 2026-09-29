import { useThemeSettings } from "../../context/ThemeContext";
import { Item, Stagger } from "../ui/Reveal";

const DEFAULT_COVER = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80";

// Split layout for client / agency authentication pages: visual panel + form.
export default function AuthShell({ eyebrow, title, description, aside, children, wide = false }) {
  const { visual, activeAgency, agency } = useThemeSettings();
  const cover = visual?.coverImageUrl || activeAgency?.coverImageUrl || DEFAULT_COVER;
  const brandName = agency?.agencyName || activeAgency?.name || "Agence";

  return (
    <div className={`mx-auto grid overflow-hidden rounded-[2rem] border border-slate-900/[0.06] bg-white shadow-lift ${wide ? "max-w-6xl lg:grid-cols-[0.8fr_1.2fr]" : "max-w-5xl lg:grid-cols-2"}`}>
      <div className="relative isolate hidden min-h-[560px] flex-col justify-between overflow-hidden bg-ink-950 p-10 text-white lg:flex">
        <img src={cover} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(7,11,20,0.35),rgba(7,11,20,0.92))]" />
        <div
          className="absolute inset-0 -z-10"
          style={{ background: "radial-gradient(30rem 20rem at 0% 100%, color-mix(in srgb, var(--primary-color) 35%, transparent), transparent 70%)" }}
        />
        <p className="font-display text-lg font-bold">{brandName}</p>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">{eyebrow}</p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-[1.1] tracking-tight">{title}</h1>
          {description ? <p className="mt-4 max-w-sm leading-relaxed text-white/70">{description}</p> : null}
          {aside ? <div className="mt-8">{aside}</div> : null}
        </div>
      </div>

      <Stagger className="p-6 sm:p-10 lg:p-12" stagger={0.08}>
        <Item className="lg:hidden">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
        </Item>
        <Item>{children}</Item>
      </Stagger>
    </div>
  );
}
