import { Link, useParams } from "react-router-dom";
import { CalendarDays, Fuel, Settings2, ShieldCheck, Users, ArrowRight } from "lucide-react";
import { useFetch } from "../hooks/useFetch";
import { currency } from "../utils/format";
import { useThemeSettings } from "../context/ThemeContext";

function InfoPill({ icon: Icon, label, value }) {
  return (
    <div className="rounded-[1.5rem] bg-slate-50 px-4 py-4">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon size={16} />
        <span className="text-[11px] uppercase tracking-[0.22em]">{label}</span>
      </div>
      <p className="mt-2 text-base font-semibold text-slate-950">{value}</p>
    </div>
  );
}

export default function CarDetailsPage() {
  const { id } = useParams();
  const { activeAgencyId, activeAgency, buildClientPath } = useThemeSettings();
  const agencyQuery = activeAgencyId ? `?agencyId=${activeAgencyId}` : "";
  const { data: car, loading, error } = useFetch(`/cars/${id}${agencyQuery}`, [id, agencyQuery]);
  const { data: packs = [] } = useFetch("/packs", []);
  const { data: options = [] } = useFetch("/options", []);

  if (loading) return <div className="card p-6">Chargement de la voiture...</div>;
  if (error || !car) return <div className="card p-6">Cette voiture est introuvable pour l'agence selectionnee.</div>;

  return (
    <div className="space-y-8">
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="overflow-hidden rounded-[2.4rem] border border-white/70 bg-white/90 shadow-[0_28px_80px_rgba(15,23,42,0.08)]">
          <img
            src={car.images?.[0]?.url || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80"}
            alt={car.model}
            className="h-[27rem] w-full object-cover"
          />
        </div>

        <div className="space-y-5">
          <div className="rounded-[2.2rem] border border-white/70 bg-white/90 p-6 shadow-[0_24px_65px_rgba(15,23,42,0.08)]">
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs uppercase tracking-[0.26em] text-slate-500">
              {activeAgency?.name || "Agence"}
            </span>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">{car.brand} {car.model}</h1>
            <p className="mt-3 leading-relaxed text-slate-600">
              {car.description || "Un vehicule soigneusement prepare pour des trajets confortables, fluides et fiables au quotidien."}
            </p>

            <div className="mt-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.26em] text-slate-400">Prix journalier</p>
                <p className="mt-2 text-4xl font-semibold text-slate-950">{currency(car.pricePerDay)}</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
                {car.status}
              </span>
            </div>

            <Link className="btn-primary mt-6 w-full gap-2" to={buildClientPath(`/reservation/${car.id}`)}>
              Reserver cette voiture
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <InfoPill icon={CalendarDays} label="Annee" value={car.year} />
            <InfoPill icon={Settings2} label="Boite" value={car.transmission} />
            <InfoPill icon={Fuel} label="Carburant" value={car.fuelType} />
            <InfoPill icon={Users} label="Places" value={car.seats} />
            <InfoPill icon={ShieldCheck} label="Caution" value={currency(car.depositAmount)} />
            <InfoPill icon={ShieldCheck} label="Conditions" value={car.conditions || "Communiquees lors de la reservation"} />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_24px_65px_rgba(15,23,42,0.08)]">
          <h3 className="text-2xl font-semibold text-slate-950">Packs disponibles</h3>
          <div className="mt-5 space-y-3">
            {(Array.isArray(packs) ? packs : []).map((pack) => (
              <div key={pack.id} className="rounded-[1.5rem] border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between gap-4">
                  <strong className="text-slate-950">{pack.name}</strong>
                  <span className="text-right text-sm font-medium text-slate-500">{pack.pricingType} • {pack.pricingValue}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{pack.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_24px_65px_rgba(15,23,42,0.08)]">
          <h3 className="text-2xl font-semibold text-slate-950">Options supplementaires</h3>
          <div className="mt-5 space-y-3">
            {(Array.isArray(options) ? options : []).map((option) => (
              <div key={option.id} className="flex items-center justify-between gap-4 rounded-[1.5rem] border border-slate-100 bg-slate-50/70 p-4">
                <div>
                  <strong className="text-slate-950">{option.name}</strong>
                  <p className="text-sm text-slate-500">{option.description}</p>
                </div>
                <span className="text-sm font-semibold text-slate-900">{currency(option.price)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
