// Standard section container: header (title / description / action) + body.
// variant: default | info | warning | success
const variants = {
  default: "card",
  info: "card-info",
  warning: "card-warning",
  success: "card-success"
};

export default function Panel({ title, description, action, children, variant = "default", padded = true, className = "" }) {
  return (
    <section className={`${variants[variant] || "card"} overflow-hidden ${className}`}>
      {title || action ? (
        <header className="flex items-start justify-between gap-4 px-6 pt-5">
          <div className="min-w-0">
            {title ? <h2 className="text-lg font-semibold text-slate-900">{title}</h2> : null}
            {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </header>
      ) : null}
      <div className={padded ? "p-6" : title || action ? "mt-4" : ""}>{children}</div>
    </section>
  );
}

export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 md:text-[2rem]">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}
