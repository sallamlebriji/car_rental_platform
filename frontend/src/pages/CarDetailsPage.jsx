import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CalendarDays, Check, Fuel, Settings2, ShieldCheck, Users } from "lucide-react";
import { useFetch } from "../hooks/useFetch";
import { currency } from "../utils/format";
import { optionLabel, packLabel } from "../utils/pricingEstimate";
import { useThemeSettings } from "../context/ThemeContext";
import { CAR_FALLBACK_IMAGE } from "../components/CarCard";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/ui/EmptyState";
import { Item, Reveal, Stagger } from "../components/ui/Reveal";
import { DURATION, EASE } from "../motion";

function Spec({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-900/[0.06] bg-white p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
        <Icon size={18} />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="truncate font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function DetailsSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr]">
      <div className="skeleton aspect-[16/10] rounded-card-primary" />
      <div className="space-y-4">
        <div className="skeleton h-4 w-24" />
        <div className="skeleton h-10 w-3/4" />
        <div className="skeleton h-24 w-full" />
        <div className="skeleton h-40 w-full rounded-card-primary" />
      </div>
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
  const [activeImage, setActiveImage] = useState(0);

  if (loading) return <DetailsSkeleton />;
  if (error || !car) {
    return (
      <div className="rounded-card-primary border border-slate-900/[0.06] bg-white">
        <EmptyState
          title="Vehicule introuvable"
          description="Cette voiture n'est pas disponible pour l'agence selectionnee."
          actionLabel="Retour au catalogue"
          actionTo={buildClientPath("/cars")}
        />
      </div>
    );
  }

  const images = car.images?.length ? car.images.map((image) => image.url) : [CAR_FALLBACK_IMAGE];
  const packRows = Array.isArray(packs) ? packs : [];
  const optionRows = Array.isArray(options) ? options : [];
  const reservationPath = buildClientPath(`/reservation/${car.id}`);

  return (
    <div className="space-y-16">
      <Link to={buildClientPath("/cars")} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">
        <ArrowLeft size={16} /> Retour au catalogue
      </Link>

      <section className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-start">
        {/* Gallery */}
        <Reveal className="space-y-3">
          <div className="relative aspect-[16/10] overflow-hidden rounded-card-primary bg-slate-100 shadow-lift">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.img
                key={images[activeImage]}
                src={images[activeImage]}
                alt={`${car.brand} ${car.model}`}
                className="absolute inset-0 h-full w-full object-cover"
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DURATION.reveal, ease: EASE }}
              />
            </AnimatePresence>
            <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 backdrop-blur">
              {car.type?.name || "Vehicule"}
            </div>
          </div>
          {images.length > 1 ? (
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
              {images.map((url, index) => (
                <button
                  key={url}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`Photo ${index + 1}`}
                  className={`aspect-[4/3] overflow-hidden rounded-xl ring-2 transition-all duration-calm ease-calm ${index === activeImage ? "ring-[var(--primary-color)]" : "opacity-60 ring-transparent hover:opacity-100"}`}
                >
                  <img src={url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </Reveal>

        {/* Booking card */}
        <Reveal delay={0.1} className="lg:sticky lg:top-28">
          <p className="eyebrow">{activeAgency?.name || "Agence"}</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">{car.brand} {car.model}</h1>
          <p className="mt-2 text-slate-500">{[car.year, car.color].filter(Boolean).join(" · ")}</p>
          <p className="mt-5 leading-relaxed text-slate-600">
            {car.description || "Un vehicule soigneusement prepare pour des trajets confortables, fluides et fiables au quotidien."}
          </p>

          <div className="mt-8 rounded-card-primary border border-slate-900/[0.06] bg-white p-6 shadow-soft">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs text-slate-500">Tarif journalier</p>
                <p className="mt-1 font-display text-4xl font-bold tracking-tight text-slate-900">{currency(car.pricePerDay)}</p>
              </div>
              <StatusBadge status={car.status} />
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-slate-900/[0.06] pt-4 text-sm">
              <span className="flex items-center gap-2 text-slate-500"><ShieldCheck size={15} /> Caution</span>
              <span className="font-semibold text-slate-900">{currency(car.depositAmount)}</span>
            </div>
            <Link className="btn-primary mt-6 w-full gap-2 !py-3.5 !text-[0.95rem]" to={reservationPath}>
              Reserver cette voiture
              <ArrowRight size={17} />
            </Link>
            <p className="mt-3 text-center text-xs text-slate-400">Confirmation par l'agence apres envoi de la demande.</p>
          </div>
        </Reveal>
      </section>

      {/* Specs */}
      <section className="space-y-6">
        <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">Caracteristiques</h2>
        <Stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Item><Spec icon={CalendarDays} label="Annee" value={car.year} /></Item>
          <Item><Spec icon={Settings2} label="Boite" value={car.transmission} /></Item>
          <Item><Spec icon={Fuel} label="Carburant" value={car.fuelType} /></Item>
          <Item><Spec icon={Users} label="Places" value={car.seats} /></Item>
        </Stagger>
        {car.conditions ? (
          <div className="card-info p-5 text-sm leading-relaxed text-slate-600">
            <p className="mb-1 font-semibold text-slate-900">Conditions</p>
            {car.conditions}
          </div>
        ) : null}
      </section>

      {/* Packs & options */}
      {packRows.length || optionRows.length ? (
        <section className="grid gap-10 lg:grid-cols-2">
          {packRows.length ? (
            <div className="space-y-5">
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">Packs</h2>
                <p className="mt-1 text-sm text-slate-500">A choisir au moment de la reservation.</p>
              </div>
              <Stagger className="space-y-3">
                {packRows.map((pack) => (
                  <Item key={pack.id} className="card-interactive p-5">
                    <div className="flex items-start justify-between gap-4">
                      <p className="font-semibold text-slate-900">{pack.name}</p>
                      <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{packLabel(pack)}</span>
                    </div>
                    {pack.description ? <p className="mt-2 text-sm leading-relaxed text-slate-500">{pack.description}</p> : null}
                  </Item>
                ))}
              </Stagger>
            </div>
          ) : null}

          {optionRows.length ? (
            <div className="space-y-5">
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">Options</h2>
                <p className="mt-1 text-sm text-slate-500">Pour un trajet plus confortable.</p>
              </div>
              <Stagger className="divide-y divide-slate-900/[0.06] overflow-hidden rounded-card-secondary border border-slate-900/[0.06] bg-white">
                {optionRows.map((option) => (
                  <Item key={option.id} className="flex items-center justify-between gap-4 p-4">
                    <div className="flex min-w-0 items-start gap-3">
                      <Check size={16} className="mt-0.5 shrink-0" style={{ color: "var(--primary-color)" }} />
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900">{option.name}</p>
                        {option.description ? <p className="text-sm text-slate-500">{option.description}</p> : null}
                      </div>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-slate-900">{optionLabel(option)}</span>
                  </Item>
                ))}
              </Stagger>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
