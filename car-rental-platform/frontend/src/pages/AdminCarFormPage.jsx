import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarRange,
  CarFront,
  CircleDollarSign,
  FileText,
  Fuel,
  ImagePlus,
  MapPinned,
  Palette,
  Save,
  Settings2,
  ShieldCheck,
  Trash2,
  Upload,
  Users
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/client";
import StatusBadge from "../components/StatusBadge";
import { currency } from "../utils/format";

const initialForm = {
  brand: "",
  model: "",
  plateNumber: "",
  year: new Date().getFullYear(),
  color: "",
  seats: 5,
  fuelType: "Essence",
  transmission: "Manuelle",
  mileage: "",
  pricePerDay: 300,
  depositAmount: 3000,
  description: "",
  conditions: "",
  status: "AVAILABLE"
};

const fuelOptions = ["Essence", "Diesel", "Hybride", "Electrique"];
const transmissionOptions = ["Manuelle", "Automatique"];
const statusOptions = [
  { value: "AVAILABLE", label: "Disponible" },
  { value: "RENTED", label: "Louee" },
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "DISABLED", label: "Desactivee" }
];

function Field({ label, icon: Icon, hint, children }) {
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

function PreviewMetric({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/6 p-4">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</p>
      <p className="mt-2 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}

export default function AdminCarFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [form, setForm] = useState(initialForm);
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!isEditMode) return undefined;

    let active = true;
    setLoading(true);

    api.get(`/cars/${id}`)
      .then((response) => {
        if (!active) return;
        const car = response.data;
        setForm({
          brand: car.brand || "",
          model: car.model || "",
          plateNumber: car.plateNumber || "",
          year: car.year || new Date().getFullYear(),
          color: car.color || "",
          seats: car.seats || 5,
          fuelType: car.fuelType || "Essence",
          transmission: car.transmission || "Manuelle",
          mileage: car.mileage || "",
          pricePerDay: Number(car.pricePerDay || 0),
          depositAmount: Number(car.depositAmount || 0),
          description: car.description || "",
          conditions: car.conditions || "",
          status: car.status || "AVAILABLE"
        });
        setExistingImages(Array.isArray(car.images) ? car.images.map((image) => image.url) : []);
      })
      .catch((error) => {
        if (!active) return;
        setFeedback(error.response?.data?.message || "Impossible de charger cette voiture.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, isEditMode]);

  useEffect(() => {
    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newPreviews]);

  const galleryImages = useMemo(
    () => [
      ...existingImages.map((url, index) => ({ id: `existing-${index}`, url, source: "existing" })),
      ...newPreviews.map((url, index) => ({ id: `new-${index}`, url, source: "new" }))
    ],
    [existingImages, newPreviews]
  );

  const coverImage = galleryImages[0]?.url || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80";
  const displayName = [form.brand, form.model].filter(Boolean).join(" ") || "Nouvelle voiture";

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleFilesSelected(event) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const previews = files.map((file) => URL.createObjectURL(file));
    setNewFiles((current) => [...current, ...files]);
    setNewPreviews((current) => [...current, ...previews]);
    event.target.value = "";
  }

  function removeImage(image) {
    if (image.source === "existing") {
      setExistingImages((current) => current.filter((url) => url !== image.url));
      return;
    }

    const previewIndex = newPreviews.findIndex((url) => url === image.url);
    if (previewIndex >= 0) {
      URL.revokeObjectURL(newPreviews[previewIndex]);
      setNewPreviews((current) => current.filter((_, index) => index !== previewIndex));
      setNewFiles((current) => current.filter((_, index) => index !== previewIndex));
    }
  }

  async function uploadPendingFiles() {
    if (!newFiles.length) return [];

    const uploadedUrls = [];
    for (const file of newFiles) {
      const fileForm = new FormData();
      fileForm.append("image", file);
      const response = await api.post("/cars/upload", fileForm, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      uploadedUrls.push(response.data.url);
    }

    return uploadedUrls;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setFeedback("");

    try {
      const uploadedUrls = await uploadPendingFiles();
      const payload = {
        ...form,
        year: Number(form.year),
        seats: Number(form.seats),
        mileage: form.mileage ? Number(form.mileage) : null,
        pricePerDay: Number(form.pricePerDay),
        depositAmount: Number(form.depositAmount),
        images: [...existingImages, ...uploadedUrls]
      };

      if (isEditMode) {
        await api.put(`/cars/${id}`, payload);
        navigate("/admin/cars");
        return;
      }

      await api.post("/cars", payload);
      navigate("/admin/cars");
    } catch (error) {
      setFeedback(error.response?.data?.message || "Impossible d'enregistrer la voiture.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="card p-8">
        <h1 className="text-3xl font-semibold text-slate-900">Chargement de la voiture...</h1>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <span className="inline-flex rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-500">
            Formulaire avance
          </span>
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              {isEditMode ? "Edition voiture" : "Creation voiture"}
            </h1>
            <p className="mt-2 max-w-3xl text-lg leading-relaxed text-slate-500">
              Centralisez les visuels, les informations techniques et les parametres de location dans une fiche complete.
            </p>
          </div>
        </div>

        <Link to="/admin/cars" className="btn-secondary gap-2 self-start lg:self-auto">
          <ArrowLeft size={18} />
          Retour a la flotte
        </Link>
      </section>

      <form className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]" onSubmit={handleSubmit}>
        <div className="space-y-6">
          <section className="card overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-2xl font-semibold text-slate-900">Identite du vehicule</h2>
              <p className="mt-1 text-sm text-slate-500">
                Renseignez les informations visibles par les administrateurs et les clients.
              </p>
            </div>

            <div className="grid gap-5 p-6 md:grid-cols-2">
              <Field label="Marque" icon={CarFront}>
                <input className="input" value={form.brand} onChange={(event) => updateField("brand", event.target.value)} placeholder="Ex: Peugeot" />
              </Field>
              <Field label="Modele" icon={CarFront}>
                <input className="input" value={form.model} onChange={(event) => updateField("model", event.target.value)} placeholder="Ex: 208 GT" />
              </Field>
              <Field label="Matricule" icon={ShieldCheck}>
                <input className="input" value={form.plateNumber} onChange={(event) => updateField("plateNumber", event.target.value)} placeholder="12345-A-1" />
              </Field>
              <Field label="Annee" icon={CalendarRange}>
                <input type="number" className="input" value={form.year} onChange={(event) => updateField("year", event.target.value)} />
              </Field>
              <Field label="Couleur" icon={Palette}>
                <input className="input" value={form.color} onChange={(event) => updateField("color", event.target.value)} placeholder="Ex: Noir metalise" />
              </Field>
              <Field label="Nombre de places" icon={Users}>
                <input type="number" className="input" value={form.seats} onChange={(event) => updateField("seats", event.target.value)} />
              </Field>
            </div>
          </section>

          <section className="card overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-2xl font-semibold text-slate-900">Motorisation et tarification</h2>
              <p className="mt-1 text-sm text-slate-500">
                Parametres utiles a la reservation et au calcul des montants.
              </p>
            </div>

            <div className="grid gap-5 p-6 md:grid-cols-2">
              <Field label="Carburant" icon={Fuel}>
                <select className="input" value={form.fuelType} onChange={(event) => updateField("fuelType", event.target.value)}>
                  {fuelOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </Field>
              <Field label="Boite" icon={Settings2}>
                <select className="input" value={form.transmission} onChange={(event) => updateField("transmission", event.target.value)}>
                  {transmissionOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </Field>
              <Field label="Kilometrage" icon={MapPinned} hint="Laissez vide si le kilometrage n'est pas encore connu.">
                <input type="number" className="input" value={form.mileage} onChange={(event) => updateField("mileage", event.target.value)} placeholder="Ex: 18000" />
              </Field>
              <Field label="Statut" icon={ShieldCheck}>
                <select className="input" value={form.status} onChange={(event) => updateField("status", event.target.value)}>
                  {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </Field>
              <Field label="Prix par jour" icon={CircleDollarSign}>
                <input type="number" className="input" value={form.pricePerDay} onChange={(event) => updateField("pricePerDay", event.target.value)} />
              </Field>
              <Field label="Caution" icon={ShieldCheck}>
                <input type="number" className="input" value={form.depositAmount} onChange={(event) => updateField("depositAmount", event.target.value)} />
              </Field>
            </div>
          </section>

          <section className="card overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-2xl font-semibold text-slate-900">Description et conditions</h2>
              <p className="mt-1 text-sm text-slate-500">
                Enrichissez la fiche avec le texte marketing et les informations contractuelles.
              </p>
            </div>

            <div className="grid gap-5 p-6">
              <Field label="Description" icon={FileText}>
                <textarea
                  className="input min-h-36 resize-y"
                  value={form.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  placeholder="Decrivez le vehicule, ses equipements et son positionnement."
                />
              </Field>
              <Field label="Conditions" icon={ShieldCheck}>
                <textarea
                  className="input min-h-28 resize-y"
                  value={form.conditions}
                  onChange={(event) => updateField("conditions", event.target.value)}
                  placeholder="Ex: age minimum, depot de garantie, kilometrage journalier..."
                />
              </Field>
            </div>
          </section>

          <section className="card overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-2xl font-semibold text-slate-900">Galerie d'images</h2>
              <p className="mt-1 text-sm text-slate-500">
                Televersez plusieurs images. Elles seront stockees sur le backend puis reliees a la voiture en base.
              </p>
            </div>

            <div className="grid gap-5 p-6">
              <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-[1.6rem] border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center transition hover:border-slate-400 hover:bg-slate-100">
                <Upload size={24} className="text-slate-400" />
                <span className="mt-3 text-sm font-medium text-slate-700">
                  Ajouter une ou plusieurs images
                </span>
                <span className="mt-1 text-xs text-slate-400">JPG, PNG, WEBP - 5 MB max par image</span>
                <input
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleFilesSelected}
                />
              </label>

              {galleryImages.length ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {galleryImages.map((image, index) => (
                    <div key={image.id} className="overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white">
                      <img src={image.url} alt={`Vehicule ${index + 1}`} className="h-44 w-full object-cover" />
                      <div className="flex items-center justify-between px-4 py-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {index === 0 ? "Image principale" : `Image ${index + 1}`}
                          </p>
                          <p className="text-xs text-slate-400">
                            {image.source === "existing" ? "Deja enregistree" : "Prete a etre envoyee"}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-rose-200 text-rose-600 transition hover:bg-rose-50"
                          onClick={() => removeImage(image)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-[1.6rem] border border-slate-200 bg-slate-50 px-5 py-6 text-sm text-slate-500">
                  Aucune image selectionnee pour le moment.
                </div>
              )}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="card overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-2xl font-semibold text-slate-900">Apercu fiche voiture</h2>
              <p className="mt-1 text-sm text-slate-500">
                Controlez le rendu global avant sauvegarde.
              </p>
            </div>

            <div className="space-y-6 p-6">
              <div className="overflow-hidden rounded-[2rem] bg-slate-950 text-white">
                <img src={coverImage} alt={displayName} className="h-64 w-full object-cover" />
                <div className="space-y-5 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Vehicule</p>
                      <h3 className="mt-3 text-3xl font-semibold tracking-tight">{displayName}</h3>
                      <p className="mt-2 text-sm text-slate-400">{form.plateNumber || "Matricule a definir"}</p>
                    </div>
                    <StatusBadge status={form.status} />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <PreviewMetric label="Prix / jour" value={currency(form.pricePerDay)} />
                    <PreviewMetric label="Caution" value={currency(form.depositAmount)} />
                    <PreviewMetric label="Configuration" value={`${form.seats} places`} />
                    <PreviewMetric label="Transmission" value={form.transmission} />
                  </div>
                </div>
              </div>

              <div className="rounded-[1.8rem] border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-800">Resume technique</p>
                <div className="mt-4 grid gap-3 text-sm text-slate-600">
                  <p><strong>Carburant:</strong> {form.fuelType}</p>
                  <p><strong>Couleur:</strong> {form.color || "Non renseignee"}</p>
                  <p><strong>Kilometrage:</strong> {form.mileage ? `${form.mileage} km` : "Non renseigne"}</p>
                  <p><strong>Conditions:</strong> {form.conditions || "Aucune condition detaillee pour le moment."}</p>
                </div>
              </div>

              <div className="rounded-[1.8rem] border border-dashed border-slate-200 bg-white p-5">
                <p className="text-sm font-semibold text-slate-800">Validation</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Verifiez les images, le prix, la caution et le statut avant publication dans la flotte.
                </p>
              </div>
            </div>
          </section>

          <section className="card p-6">
            <div className="flex flex-col gap-3">
              <button type="submit" className="btn-primary gap-2" disabled={submitting}>
                <Save size={18} />
                {submitting ? "Enregistrement..." : isEditMode ? "Mettre a jour la voiture" : "Creer la voiture"}
              </button>
              <Link to="/admin/cars" className="btn-secondary gap-2">
                <ArrowLeft size={18} />
                Annuler
              </Link>
            </div>
            {feedback ? <p className="mt-4 text-sm font-medium text-rose-600">{feedback}</p> : null}
          </section>
        </aside>
      </form>
    </div>
  );
}
