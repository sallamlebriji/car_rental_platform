import { useMemo, useState } from "react";
import { ArrowDownUp, Search, X } from "lucide-react";
import CarCard from "../components/CarCard";
import EmptyState from "../components/ui/EmptyState";
import { Item, Reveal, Stagger } from "../components/ui/Reveal";
import { useFetch } from "../hooks/useFetch";
import { useThemeSettings } from "../context/ThemeContext";

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors duration-calm ease-calm ${
        active ? "border-transparent text-white" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
      }`}
      style={active ? { background: "var(--primary-color)" } : undefined}
    >
      {children}
    </button>
  );
}

const uniq = (values) => [...new Set(values.filter(Boolean))];

export default function CarsPage() {
  const { activeAgencyId, activeAgency } = useThemeSettings();
  const agencyQuery = activeAgencyId ? `?agencyId=${activeAgencyId}` : "";
  const { data: cars = [], loading } = useFetch(`/cars${agencyQuery}`, [agencyQuery]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [fuel, setFuel] = useState("");
  const [gearbox, setGearbox] = useState("");
  const [sort, setSort] = useState("");

  const rows = Array.isArray(cars) ? cars : [];
  const types = uniq(rows.map((car) => car.type?.name));
  const fuels = uniq(rows.map((car) => car.fuelType));
  const gearboxes = uniq(rows.map((car) => car.transmission));

  const filtered = useMemo(() => {
    const list = rows.filter((car) =>
      `${car.brand} ${car.model} ${car.fuelType} ${car.transmission} ${car.type?.name || ""}`.toLowerCase().includes(search.toLowerCase())
      && (!type || car.type?.name === type)
      && (!fuel || car.fuelType === fuel)
      && (!gearbox || car.transmission === gearbox)
    );
    if (sort === "asc") return [...list].sort((a, b) => Number(a.pricePerDay) - Number(b.pricePerDay));
    if (sort === "desc") return [...list].sort((a, b) => Number(b.pricePerDay) - Number(a.pricePerDay));
    return list;
  }, [rows, search, type, fuel, gearbox, sort]);

  const hasFilters = Boolean(search || type || fuel || gearbox);
  function resetFilters() {
    setSearch("");
    setType("");
    setFuel("");
    setGearbox("");
  }

  return (
    <div className="space-y-10">
      <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="eyebrow">Catalogue · {activeAgency?.name || "Agence"}</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">Nos voitures</h1>
          <p className="mt-3 text-slate-500">Comparez les modeles disponibles et trouvez celui qui correspond a votre trajet.</p>
        </div>
        <label className="relative block w-full lg:w-[380px]">
          <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input !rounded-full !py-3 !pl-11 !pr-10"
            placeholder="Marque, modele, carburant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search ? (
            <button type="button" onClick={() => setSearch("")} aria-label="Effacer" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-700">
              <X size={15} />
            </button>
          ) : null}
        </label>
      </Reveal>

      <Reveal delay={0.08} className="sticky top-[72px] z-sidebar -mx-4 border-y border-slate-900/[0.06] bg-[#f7f7f5]/90 px-4 py-3 backdrop-blur-xl lg:-mx-8 lg:px-8">
        <div className="flex items-center gap-3 overflow-x-auto pb-0.5">
          <Chip active={!type} onClick={() => setType("")}>Toutes</Chip>
          {types.map((value) => (
            <Chip key={value} active={type === value} onClick={() => setType(type === value ? "" : value)}>{value}</Chip>
          ))}
          {fuels.length > 1 ? <span className="mx-1 h-5 w-px shrink-0 bg-slate-200" /> : null}
          {fuels.length > 1 ? fuels.map((value) => (
            <Chip key={value} active={fuel === value} onClick={() => setFuel(fuel === value ? "" : value)}>{value}</Chip>
          )) : null}
          {gearboxes.length > 1 ? <span className="mx-1 h-5 w-px shrink-0 bg-slate-200" /> : null}
          {gearboxes.length > 1 ? gearboxes.map((value) => (
            <Chip key={value} active={gearbox === value} onClick={() => setGearbox(gearbox === value ? "" : value)}>{value}</Chip>
          )) : null}

          <div className="ml-auto flex shrink-0 items-center gap-3 pl-3">
            <span className="hidden text-sm text-slate-500 sm:inline">{filtered.length} vehicule{filtered.length > 1 ? "s" : ""}</span>
            <label className="relative">
              <ArrowDownUp size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                aria-label="Trier"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none rounded-full border border-slate-200 bg-white py-1.5 pl-8 pr-4 text-sm font-medium text-slate-700 outline-none hover:border-slate-300"
              >
                <option value="">Pertinence</option>
                <option value="asc">Prix croissant</option>
                <option value="desc">Prix decroissant</option>
              </select>
            </label>
          </div>
        </div>
      </Reveal>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="overflow-hidden rounded-card-primary border border-slate-900/[0.06] bg-white">
              <div className="skeleton aspect-[16/10] !rounded-none" />
              <div className="space-y-3 p-5">
                <div className="skeleton h-5 w-2/3" />
                <div className="skeleton h-3 w-1/3" />
                <div className="skeleton mt-6 h-6 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length ? (
        <Stagger key={`${type}-${fuel}-${gearbox}-${sort}`} className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((car) => (
            <Item key={car.id} className="h-full">
              <CarCard car={car} />
            </Item>
          ))}
        </Stagger>
      ) : (
        <div className="rounded-card-primary border border-slate-900/[0.06] bg-white">
          <EmptyState
            title={hasFilters ? "Aucun vehicule ne correspond" : "Aucun vehicule publie"}
            description={hasFilters ? "Essayez d'elargir votre recherche ou de retirer un filtre." : "Le parc de cette agence sera bientot disponible."}
            actionLabel={hasFilters ? "Reinitialiser les filtres" : undefined}
            onAction={hasFilters ? resetFilters : undefined}
          />
        </div>
      )}
    </div>
  );
}
