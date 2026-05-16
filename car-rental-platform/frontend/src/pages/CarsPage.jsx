import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import CarCard from "../components/CarCard";
import { useFetch } from "../hooks/useFetch";
import { useThemeSettings } from "../context/ThemeContext";

export default function CarsPage() {
  const { activeAgencyId, activeAgency } = useThemeSettings();
  const agencyQuery = activeAgencyId ? `?agencyId=${activeAgencyId}` : "";
  const { data: cars = [], loading } = useFetch(`/cars${agencyQuery}`, [agencyQuery]);
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      (Array.isArray(cars) ? cars : []).filter((car) =>
        `${car.brand} ${car.model} ${car.fuelType} ${car.transmission} ${car.type?.name || ""}`.toLowerCase().includes(search.toLowerCase())
      ),
    [cars, search]
  );

  return (
    <div className="space-y-8">
      <section className="rounded-[2.2rem] border border-white/70 bg-white/88 p-6 shadow-[0_24px_65px_rgba(15,23,42,0.08)] backdrop-blur md:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-500">
              Catalogue agence
            </span>
            <h1 className="mt-4 text-3xl font-semibold text-slate-950 md:text-4xl">Voitures disponibles</h1>
            <p className="mt-2 max-w-2xl text-slate-500">
              Parc de {activeAgency?.name || "l'agence selectionnee"}, avec une lecture plus claire des categories, tarifs et caracteristiques.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-[minmax(280px,380px)_auto] sm:items-center">
            <label className="relative block">
              <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="input pl-11"
                placeholder="Rechercher une marque, un modele, un carburant..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">
              <SlidersHorizontal size={16} />
              {filtered.length} vehicule(s)
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="h-[28rem] rounded-[2rem] bg-white/80 shadow-soft animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((car) => <CarCard key={car.id} car={car} />)}
        </div>
      )}
    </div>
  );
}
