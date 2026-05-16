import { Link } from "react-router-dom";
import { CarFront, Fuel, Users, Settings2 } from "lucide-react";
import { useThemeSettings } from "../context/ThemeContext";
import { currency } from "../utils/format";

export default function CarCard({ car }) {
  const { buildClientPath } = useThemeSettings();
  const image = car.images?.[0]?.url || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80";
  const detailsPath = buildClientPath(`/cars/${car.id}`);

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-[0_24px_65px_rgba(15,23,42,0.09)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_34px_90px_rgba(15,23,42,0.14)]">
      <div className="relative overflow-hidden">
        <img src={image} alt={`${car.brand} ${car.model}`} className="h-64 w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-transparent" />
        <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/92 px-3 py-2 text-xs font-semibold text-slate-900 shadow-soft">
          <CarFront size={14} />
          {car.type?.name || "Vehicule"}
        </div>
        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
          <div className="text-white">
            <h3 className="text-2xl font-semibold tracking-tight">{car.brand} {car.model}</h3>
            <p className="mt-1 text-sm text-white/75">{car.year} • {car.color || "Couleur premium"}</p>
          </div>
          <span className="rounded-full border border-emerald-200/60 bg-emerald-400/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white">
            {car.status}
          </span>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-slate-50 px-3 py-3">
            <div className="flex items-center gap-2 text-slate-500">
              <Fuel size={14} />
              <span className="text-[11px] uppercase tracking-[0.22em]">Carburant</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-900">{car.fuelType}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-3 py-3">
            <div className="flex items-center gap-2 text-slate-500">
              <Settings2 size={14} />
              <span className="text-[11px] uppercase tracking-[0.22em]">Boite</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-900">{car.transmission}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-3 py-3">
            <div className="flex items-center gap-2 text-slate-500">
              <Users size={14} />
              <span className="text-[11px] uppercase tracking-[0.22em]">Places</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-900">{car.seats}</p>
          </div>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Tarif journalier</p>
            <strong className="mt-1 block text-3xl font-semibold text-slate-950">{currency(car.pricePerDay)}</strong>
          </div>
          <span className="text-sm text-slate-500">/ jour</span>
        </div>

        <Link className="btn-primary w-full" to={detailsPath}>Voir le vehicule</Link>
      </div>
    </article>
  );
}
