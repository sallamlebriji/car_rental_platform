import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, Lock } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { CAR_FALLBACK_IMAGE } from "../components/CarCard";
import EmptyState from "../components/ui/EmptyState";
import { Item, Reveal, Stagger } from "../components/ui/Reveal";
import { useFetch } from "../hooks/useFetch";
import { currency, date } from "../utils/format";
import { useThemeSettings } from "../context/ThemeContext";

const tabs = [
  ["all", "Toutes"],
  ["upcoming", "A venir"],
  ["PENDING", "En attente"],
  ["past", "Terminees"]
];

export default function MyReservationsPage() {
  const { buildClientPath } = useThemeSettings();
  const { data: reservations = [], error, loading } = useFetch("/reservations", []);
  const [tab, setTab] = useState("all");
  const rows = Array.isArray(reservations) ? reservations : [];

  const filtered = useMemo(() => {
    const now = new Date();
    return rows.filter((row) => {
      if (tab === "upcoming") return ["PENDING", "CONFIRMED"].includes(row.status) && new Date(row.endDate) >= now;
      if (tab === "PENDING") return row.status === "PENDING";
      if (tab === "past") return ["COMPLETED", "CANCELLED", "REFUSED"].includes(row.status) || new Date(row.endDate) < now;
      return true;
    });
  }, [rows, tab]);

  if (error) {
    return (
      <div className="mx-auto max-w-lg rounded-card-primary border border-slate-900/[0.06] bg-white p-10 text-center shadow-soft">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
          <Lock size={20} />
        </span>
        <h1 className="mt-5 font-display text-2xl font-bold text-slate-900">Espace reserve</h1>
        <p className="mt-2 text-slate-500">Connectez-vous pour consulter vos reservations.</p>
        <Link className="btn-primary mt-6" to={buildClientPath("/login")}>
          Acceder a l'espace client
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Espace client</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-slate-900">Mes reservations</h1>
          <p className="mt-2 text-slate-500">Suivez vos demandes et leur statut en temps reel.</p>
        </div>
        <Link to={buildClientPath("/cars")} className="btn-primary shrink-0 gap-2">
          Nouvelle reservation <ArrowRight size={16} />
        </Link>
      </Reveal>

      <div className="flex gap-1 overflow-x-auto rounded-full border border-slate-900/[0.06] bg-white p-1 sm:w-fit">
        {tabs.map(([key, label]) => {
          const count = key === "all" ? rows.length : null;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-calm ease-calm ${tab === key ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-900"}`}
            >
              {label}{count !== null ? <span className="ml-1.5 opacity-60">{count}</span> : null}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center gap-5 rounded-card-secondary border border-slate-900/[0.06] bg-white p-4">
              <div className="skeleton h-20 w-28 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-1/3" />
                <div className="skeleton h-3 w-1/4" />
              </div>
              <div className="skeleton h-6 w-20" />
            </div>
          ))}
        </div>
      ) : filtered.length ? (
        <Stagger key={tab} className="space-y-3">
          {filtered.map((row) => (
            <Item
              key={row.id}
              className="card-interactive flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5"
            >
              <img
                src={row.car?.images?.[0]?.url || CAR_FALLBACK_IMAGE}
                alt=""
                className="h-40 w-full shrink-0 rounded-xl object-cover sm:h-20 sm:w-28"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="font-display text-lg font-bold text-slate-900">{row.car?.brand} {row.car?.model}</p>
                  <span className="text-xs font-medium text-slate-400">{row.reference}</span>
                </div>
                <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                  <CalendarDays size={14} />
                  {date(row.startDate)} → {date(row.endDate)}
                </p>
              </div>
              <div className="flex items-center justify-between gap-5 sm:justify-end">
                <p className="font-display text-lg font-bold tabular-nums text-slate-900">{currency(row.totalPrice)}</p>
                <StatusBadge status={row.status} />
              </div>
            </Item>
          ))}
        </Stagger>
      ) : (
        <div className="rounded-card-primary border border-slate-900/[0.06] bg-white">
          <EmptyState
            title={tab === "all" ? "Aucune reservation pour le moment" : "Rien dans cette categorie"}
            description={tab === "all" ? "Parcourez le parc et envoyez votre premiere demande en quelques minutes." : "Essayez un autre onglet."}
            actionLabel={tab === "all" ? "Decouvrir les vehicules" : undefined}
            actionTo={tab === "all" ? buildClientPath("/cars") : undefined}
          />
        </div>
      )}
    </div>
  );
}
