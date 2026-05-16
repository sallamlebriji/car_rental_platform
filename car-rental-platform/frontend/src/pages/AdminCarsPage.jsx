import { useMemo, useState } from "react";
import {
  ArrowRight,
  CarFront,
  CircleDollarSign,
  Gauge,
  Plus,
  ShieldCheck,
  Trash2,
  PencilLine,
  Fuel,
  ImagePlus,
  Settings2,
  Upload
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/client";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { useFetch } from "../hooks/useFetch";
import { currency } from "../utils/format";

const initialForm = {
  brand: "",
  model: "",
  plateNumber: "",
  year: 2024,
  seats: 5,
  fuelType: "Essence",
  transmission: "Manuelle",
  pricePerDay: 300,
  depositAmount: 3000,
  status: "AVAILABLE",
  primaryImageUrl: "",
  images: []
};

const statusOptions = [
  { value: "AVAILABLE", label: "Disponible" },
  { value: "RENTED", label: "Louee" },
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "DISABLED", label: "Desactivee" }
];

const fuelOptions = ["Essence", "Diesel", "Hybride", "Electrique"];
const transmissionOptions = ["Manuelle", "Automatique"];

function FleetStatCard({ icon: Icon, label, value, hint, tone }) {
  return (
    <div className="overflow-hidden rounded-[1.8rem] border border-slate-200 bg-white/90 shadow-soft backdrop-blur">
      <div className={`h-1.5 bg-gradient-to-r ${tone}`} />
      <div className="space-y-4 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <h3 className="mt-3 break-words text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">{value}</h3>
          </div>
          <div className={`flex h-14 w-14 shrink-0 items-center justify-center self-start rounded-2xl bg-gradient-to-br ${tone} text-white shadow-sm`}>
            <Icon size={24} strokeWidth={2.2} />
          </div>
        </div>
        <p className="text-sm leading-relaxed text-slate-500">{hint}</p>
      </div>
    </div>
  );
}

function FormField({ label, icon: Icon, children, hint }) {
  return (
    <label className="space-y-2.5">
      <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
        {Icon ? <Icon size={16} className="text-slate-400" /> : null}
        {label}
      </span>
      {children}
      {hint ? <span className="block text-xs text-slate-400">{hint}</span> : null}
    </label>
  );
}

export default function AdminCarsPage() {
  const { data: carsData, setData, loading } = useFetch("/cars", []);
  const cars = Array.isArray(carsData) ? carsData : [];

  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [localPreview, setLocalPreview] = useState("");

  const fleetMetrics = useMemo(() => {
    const totalCars = cars.length;
    const availableCars = cars.filter((car) => car.status === "AVAILABLE").length;
    const rentedCars = cars.filter((car) => car.status === "RENTED").length;
    const avgPrice = totalCars ? Math.round(cars.reduce((sum, car) => sum + Number(car.pricePerDay || 0), 0) / totalCars) : 0;

    return { totalCars, availableCars, rentedCars, avgPrice };
  }, [cars]);

  async function createCar(event) {
    event.preventDefault();
    setSubmitting(true);
    setFeedback("");

    try {
      const payload = {
        ...form,
        year: Number(form.year),
        seats: Number(form.seats),
        pricePerDay: Number(form.pricePerDay),
        depositAmount: Number(form.depositAmount)
      };

      if (imageFile) {
        const fileForm = new FormData();
        fileForm.append("image", imageFile);
        const uploadResponse = await api.post("/cars/upload", fileForm, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        payload.images = [uploadResponse.data.url];
      } else {
        payload.images = form.primaryImageUrl ? [form.primaryImageUrl] : [];
      }

      delete payload.primaryImageUrl;

      const response = await api.post("/cars", payload);
      setData([response.data, ...cars]);
      setForm(initialForm);
      setImageFile(null);
      setLocalPreview("");
      setFeedback("Voiture ajoutee avec succes.");
    } catch (error) {
      setFeedback(error.response?.data?.message || "Impossible d'ajouter la voiture.");
    } finally {
      setSubmitting(false);
    }
  }

  async function removeCar(carId) {
    try {
      await api.delete(`/cars/${carId}`);
      setData(cars.filter((car) => car.id !== carId));
    } catch (error) {
      setFeedback(error.response?.data?.message || "Suppression impossible pour le moment.");
    }
  }

  const previewTitle = [form.brand, form.model].filter(Boolean).join(" ");
  const previewStatus = statusOptions.find((item) => item.value === form.status)?.label || form.status;
  const previewImage = localPreview || form.primaryImageUrl || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <span className="inline-flex rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-500">
            Parc automobile
          </span>
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">Gestion des voitures</h1>
            <p className="mt-2 max-w-3xl text-lg leading-relaxed text-slate-500">
              Structurez votre flotte, ajoutez un vehicule rapidement et gardez une lecture immediate des disponibilites.
            </p>
          </div>
        </div>

        <Link to="/admin/cars/create" className="btn-secondary gap-2 self-start lg:self-auto">
          <ArrowRight size={18} />
          Formulaire dedie
        </Link>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <FleetStatCard
          icon={CarFront}
          label="Voitures"
          value={fleetMetrics.totalCars}
          hint="Nombre total de vehicules actuellement references."
          tone="from-sky-500 to-cyan-500"
        />
        <FleetStatCard
          icon={ShieldCheck}
          label="Disponibles"
          value={fleetMetrics.availableCars}
          hint="Vehicules prets a etre reserves immediatement."
          tone="from-emerald-500 to-teal-500"
        />
        <FleetStatCard
          icon={Gauge}
          label="Louees"
          value={fleetMetrics.rentedCars}
          hint="Vehicules deja engages sur une reservation en cours."
          tone="from-amber-500 to-orange-500"
        />
        <FleetStatCard
          icon={CircleDollarSign}
          label="Prix moyen"
          value={currency(fleetMetrics.avgPrice)}
          hint="Lecture rapide du positionnement tarifaire du parc."
          tone="from-fuchsia-500 to-violet-500"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <form className="card overflow-hidden" onSubmit={createCar}>
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Ajout rapide</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Creez un vehicule avec les informations essentielles sans quitter la liste.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500">
                <Plus size={14} />
                Formulaire express
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-6">
            <div className="grid gap-4 md:grid-cols-3">
              <FormField label="Marque" icon={CarFront}>
                <input
                  className="input"
                  value={form.brand}
                  onChange={(event) => setForm({ ...form, brand: event.target.value })}
                  placeholder="Ex: Renault"
                />
              </FormField>

              <FormField label="Modele" icon={CarFront}>
                <input
                  className="input"
                  value={form.model}
                  onChange={(event) => setForm({ ...form, model: event.target.value })}
                  placeholder="Ex: Clio 5"
                />
              </FormField>

              <FormField label="Matricule" icon={ShieldCheck}>
                <input
                  className="input"
                  value={form.plateNumber}
                  onChange={(event) => setForm({ ...form, plateNumber: event.target.value })}
                  placeholder="12345-A-1"
                />
              </FormField>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
              <FormField label="Image principale" icon={ImagePlus} hint="Selectionnez un fichier image. Il sera envoye au backend puis enregistre en base.">
                <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-[1.4rem] border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center transition hover:border-slate-400 hover:bg-slate-100">
                  <Upload size={22} className="text-slate-400" />
                  <span className="mt-3 text-sm font-medium text-slate-700">
                    {imageFile ? imageFile.name : "Cliquer pour choisir une image"}
                  </span>
                  <span className="mt-1 text-xs text-slate-400">JPG, PNG ou WEBP - max 5 MB</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0] || null;
                      setImageFile(file);
                      if (file) {
                        setLocalPreview(URL.createObjectURL(file));
                        setForm({ ...form, primaryImageUrl: "" });
                      } else {
                        setLocalPreview("");
                      }
                    }}
                  />
                </label>
              </FormField>

              <FormField label="Ou URL distante" icon={CarFront} hint="Option de secours si vous ne souhaitez pas televerser un fichier local.">
                <input
                  className="input"
                  value={form.primaryImageUrl}
                  onChange={(event) => {
                    setForm({ ...form, primaryImageUrl: event.target.value });
                    setImageFile(null);
                    setLocalPreview("");
                  }}
                  placeholder="https://..."
                />
              </FormField>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <FormField label="Annee" icon={Gauge}>
                <input
                  type="number"
                  className="input"
                  value={form.year}
                  onChange={(event) => setForm({ ...form, year: event.target.value })}
                />
              </FormField>

              <FormField label="Places" icon={CarFront}>
                <input
                  type="number"
                  className="input"
                  value={form.seats}
                  onChange={(event) => setForm({ ...form, seats: event.target.value })}
                />
              </FormField>

              <FormField label="Prix / jour" icon={CircleDollarSign} hint="Montant facture par jour de location.">
                <input
                  type="number"
                  className="input"
                  value={form.pricePerDay}
                  onChange={(event) => setForm({ ...form, pricePerDay: event.target.value })}
                />
              </FormField>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <FormField label="Caution" icon={ShieldCheck} hint="Depot de garantie demande au client.">
                <input
                  type="number"
                  className="input"
                  value={form.depositAmount}
                  onChange={(event) => setForm({ ...form, depositAmount: event.target.value })}
                />
              </FormField>

              <FormField label="Carburant" icon={Fuel}>
                <select
                  className="input"
                  value={form.fuelType}
                  onChange={(event) => setForm({ ...form, fuelType: event.target.value })}
                >
                  {fuelOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Boite" icon={Settings2}>
                <select
                  className="input"
                  value={form.transmission}
                  onChange={(event) => setForm({ ...form, transmission: event.target.value })}
                >
                  {transmissionOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Statut" icon={ShieldCheck}>
                <select
                  className="input"
                  value={form.status}
                  onChange={(event) => setForm({ ...form, status: event.target.value })}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-500">
                {feedback ? <span className="font-medium text-slate-700">{feedback}</span> : "Renseignez les champs cles puis validez l'ajout."}
              </div>
              <button className="btn-primary min-w-52 gap-2" disabled={submitting}>
                <Plus size={18} />
                {submitting ? "Ajout en cours..." : "Ajouter la voiture"}
              </button>
            </div>
          </div>
        </form>

        <aside className="card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="text-2xl font-semibold text-slate-900">Apercu rapide</h2>
            <p className="mt-1 text-sm text-slate-500">
              Controle visuel du vehicule avant creation dans le parc.
            </p>
          </div>

          <div className="space-y-6 p-6">
            <div className="rounded-[2rem] bg-slate-950 p-6 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Nouveau vehicule</p>
                  <h3 className="mt-3 text-3xl font-semibold tracking-tight">
                    {previewTitle || "Marque / Modele"}
                  </h3>
                  <p className="mt-2 text-sm text-slate-400">
                    {form.plateNumber || "Matricule a definir"}
                  </p>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-white">
                  <CarFront size={30} strokeWidth={2.1} />
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-[1.6rem] border border-white/10">
                <img src={previewImage} alt={previewTitle || "Voiture"} className="h-52 w-full object-cover" />
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/6 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Prix</p>
                  <p className="mt-2 text-2xl font-semibold">{currency(form.pricePerDay)}</p>
                </div>
                <div className="rounded-2xl bg-white/6 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Caution</p>
                  <p className="mt-2 text-2xl font-semibold">{currency(form.depositAmount)}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Motorisation</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{form.fuelType}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Transmission</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{form.transmission}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Configuration</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">
                  {form.seats} places - {form.year}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Statut</p>
                <div className="mt-2">
                  <StatusBadge status={form.status} />
                  <p className="mt-2 text-sm text-slate-500">{previewStatus}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-800">Etape suivante</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Utilisez le formulaire dedie pour enrichir les images, la description, la couleur, le kilometrage et les details avances.
              </p>
            </div>
          </div>
        </aside>
      </section>

      <section className="card overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Parc actuel</h2>
              <p className="mt-1 text-sm text-slate-500">
                Liste complete des voitures, avec lecture immediate des statuts et actions rapides.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500">
              {loading ? "Chargement..." : `${cars.length} vehicules`}
            </div>
          </div>
        </div>

        <DataTable
          columns={[
            {
              key: "name",
              label: "Voiture",
              render: (row) => (
                <div className="flex items-center gap-3">
                  <div className="h-14 w-20 overflow-hidden rounded-2xl bg-slate-100">
                    {row.images?.[0]?.url ? (
                      <img src={row.images[0].url} alt={`${row.brand} ${row.model}`} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-500">
                        <CarFront size={20} />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{row.brand} {row.model}</p>
                    <p className="text-sm text-slate-500">{row.fuelType} - {row.transmission}</p>
                  </div>
                </div>
              )
            },
            {
              key: "plateNumber",
              label: "Matricule",
              render: (row) => (
                <div>
                  <p className="font-medium text-slate-900">{row.plateNumber}</p>
                  <p className="text-sm text-slate-500">{row.seats} places - {row.year}</p>
                </div>
              )
            },
            {
              key: "pricePerDay",
              label: "Prix / jour",
              render: (row) => (
                <div>
                  <p className="font-semibold text-slate-900">{currency(row.pricePerDay)}</p>
                  <p className="text-sm text-slate-500">Caution {currency(row.depositAmount)}</p>
                </div>
              )
            },
            { key: "status", label: "Statut", render: (row) => <StatusBadge status={row.status} /> },
            {
              key: "actions",
              label: "Actions",
              render: (row) => (
                <div className="flex flex-wrap gap-2">
                  <Link to={`/admin/cars/edit/${row.id}`} className="btn-secondary gap-2 px-3 py-2 text-sm">
                    <PencilLine size={16} />
                    Modifier
                  </Link>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                    onClick={() => removeCar(row.id)}
                  >
                    <Trash2 size={16} />
                    Supprimer
                  </button>
                </div>
              )
            }
          ]}
          rows={cars}
        />
      </section>
    </div>
  );
}
