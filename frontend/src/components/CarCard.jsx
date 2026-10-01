import { Link } from "react-router-dom";
import { ArrowUpRight, Fuel, Settings2, Users } from "lucide-react";
import { useThemeSettings } from "../context/ThemeContext";
import { currency } from "../utils/format";
import TiltCard from "./ui/TiltCard";

export const CAR_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80";

const statusLabels = {
  AVAILABLE: ["Disponible", "bg-emerald-500"],
  RENTED: ["En location", "bg-amber-500"],
  MAINTENANCE: ["Maintenance", "bg-orange-500"],
  DISABLED: ["Indisponible", "bg-slate-400"]
};

export default function CarCard({ car }) {
  const { buildClientPath } = useThemeSettings();
  const image = car.images?.[0]?.url || CAR_FALLBACK_IMAGE;
  const detailsPath = buildClientPath(`/cars/${car.id}`);
  const [statusLabel, statusDot] = statusLabels[car.status] || [car.status, "bg-slate-400"];

  return (
    <TiltCard maxX={3} maxY={4} className="h-full rounded-card-primary">
      <Link
        to={detailsPath}
        className="group flex h-full flex-col overflow-hidden rounded-card-primary border border-slate-900/[0.06] bg-white shadow-soft transition-shadow duration-calm ease-calm hover:shadow-lift"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
          <img
            src={image}
            alt={`${car.brand} ${car.model}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-calm group-hover:scale-[1.04]"
          />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
            <span className="rounded-full bg-white/90 px-3 py-1 text-[0.7rem] font-semibold text-slate-800 backdrop-blur">
              {car.type?.name || "Vehicule"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[0.7rem] font-semibold text-slate-800 backdrop-blur">
              <span className={`h-1.5 w-1.5 rounded-full ${statusDot}`} />
              {statusLabel}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate font-display text-xl font-bold tracking-tight text-slate-900">{car.brand} {car.model}</h3>
              <p className="mt-0.5 text-sm text-slate-500">{[car.year, car.color].filter(Boolean).join(" · ")}</p>
            </div>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-all duration-calm ease-calm group-hover:border-transparent group-hover:bg-[var(--primary-color)] group-hover:text-white">
              <ArrowUpRight size={16} />
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1.5"><Fuel size={15} className="text-slate-400" />{car.fuelType}</span>
            <span className="inline-flex items-center gap-1.5"><Settings2 size={15} className="text-slate-400" />{car.transmission}</span>
            <span className="inline-flex items-center gap-1.5"><Users size={15} className="text-slate-400" />{car.seats} places</span>
          </div>

          <div className="mt-auto flex items-end justify-between border-t border-slate-900/[0.06] pt-4" style={{ marginTop: "1.25rem" }}>
            <p className="text-xs text-slate-500">A partir de</p>
            <p className="font-display text-2xl font-bold tracking-tight text-slate-900">
              {currency(car.pricePerDay)}
              <span className="ml-1 text-sm font-medium text-slate-400">/ jour</span>
            </p>
          </div>
        </div>
      </Link>
    </TiltCard>
  );
}
