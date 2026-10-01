import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Eye, FileText, FileUp, LoaderCircle, Lock, ShieldCheck, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/client";
import { useFetch } from "../hooks/useFetch";
import { useThemeSettings } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import FormField from "../components/FormField";
import { currency } from "../utils/format";
import { estimateReservation, optionLabel, packLabel } from "../utils/pricingEstimate";
import { CAR_FALLBACK_IMAGE } from "../components/CarCard";
import EmptyState from "../components/ui/EmptyState";
import { Reveal } from "../components/ui/Reveal";

const initialForm = {
  startDate: "",
  endDate: "",
  packId: "",
  optionIds: [],
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  city: "",
  address: "",
  cinOrPassport: "",
  driverLicense: "",
  identityDocUrl: "",
  licenseDocUrl: ""
};

const initialDocuments = {
  identityDocUrl: null,
  licenseDocUrl: null
};

function isImageDocument(document) {
  return Boolean(document?.mimeType?.startsWith("image/"));
}

function getMimeTypeFromUrl(url) {
  const normalized = url.toLowerCase();
  if (normalized.endsWith(".pdf")) return "application/pdf";
  if (normalized.endsWith(".png")) return "image/png";
  if (normalized.endsWith(".webp")) return "image/webp";
  if (normalized.endsWith(".jpg") || normalized.endsWith(".jpeg")) return "image/jpeg";
  return "application/octet-stream";
}

function buildDocumentFromUrl(url) {
  if (!url) return null;
  const originalName = decodeURIComponent(url.split("/").pop() || "document");
  return {
    url,
    originalName,
    mimeType: getMimeTypeFromUrl(url)
  };
}

function UploadCard({ label, document, onChange, onClear, uploading, hint }) {
  const hasDocument = Boolean(document?.url);

  return (
    <div className="rounded-2xl border border-slate-900/[0.08] bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{label}</p>
          <p className="mt-0.5 text-xs text-slate-500">{hint}</p>
        </div>
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${hasDocument ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"}`}>
          {uploading ? <LoaderCircle size={16} className="animate-spin" /> : hasDocument ? <Check size={16} /> : <FileText size={16} />}
        </span>
      </div>

      {hasDocument ? (
        <div className="mt-4 space-y-3">
          {isImageDocument(document) ? (
            <div className="overflow-hidden rounded-xl border border-slate-900/[0.06] bg-slate-50">
              <img src={document.url} alt={document.originalName || label} className="h-36 w-full object-cover" />
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3.5 py-3">
              <FileText size={18} className="shrink-0 text-slate-500" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-800">{document.originalName || "Document importe"}</p>
                <p className="text-xs text-slate-500">{document.mimeType === "application/pdf" ? "PDF" : "Document"} · pret a etre transmis</p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <a className="btn-secondary gap-1.5 !px-3 !py-2 !text-xs" href={document.url} target="_blank" rel="noreferrer">
              <Eye size={14} />
              Ouvrir
            </a>
            <label className="btn-secondary cursor-pointer gap-1.5 !px-3 !py-2 !text-xs">
              <FileUp size={14} />
              {uploading ? "Remplacement..." : "Remplacer"}
              <input className="hidden" type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" disabled={uploading} onChange={onChange} />
            </label>
            <button type="button" className="btn-secondary gap-1.5 !px-3 !py-2 !text-xs !text-rose-600" onClick={onClear} disabled={uploading}>
              <Trash2 size={14} />
              Supprimer
            </button>
          </div>
        </div>
      ) : (
        <label className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-4 py-6 text-center transition-colors duration-calm ease-calm hover:border-[var(--primary-color)] hover:bg-white">
          <FileUp size={18} className="text-slate-400" />
          <span className="text-sm font-medium text-slate-700">{uploading ? "Import en cours..." : "Importer un fichier"}</span>
          <span className="text-xs text-slate-400">JPG, PNG, WEBP ou PDF</span>
          <input className="hidden" type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" disabled={uploading} onChange={onChange} />
        </label>
      )}
    </div>
  );
}

function Section({ number, title, description, children }) {
  return (
    <section className="rounded-card-primary border border-slate-900/[0.06] bg-white p-6 shadow-soft md:p-8">
      <div className="flex items-start gap-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold text-white" style={{ background: "var(--primary-color)" }}>
          {number}
        </span>
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight text-slate-900">{title}</h2>
          {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function ChoiceCard({ selected, onClick, title, subtitle, price, type = "radio" }) {
  return (
    <button
      type="button"
      role={type}
      aria-checked={selected}
      onClick={onClick}
      className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-calm ease-calm ${
        selected
          ? "border-[var(--primary-color)] bg-[color-mix(in_srgb,var(--primary-color)_5%,white)] shadow-[0_0_0_3px_color-mix(in_srgb,var(--primary-color)_14%,transparent)]"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-2 transition-colors duration-calm ease-calm ${type === "radio" ? "rounded-full" : "rounded-md"} ${
          selected ? "border-[var(--primary-color)] bg-[var(--primary-color)] text-white" : "border-slate-300"
        }`}
      >
        {selected ? <Check size={12} strokeWidth={3} /> : null}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-3">
          <span className="font-semibold text-slate-900">{title}</span>
          {price ? <span className="shrink-0 text-sm font-semibold text-slate-700">{price}</span> : null}
        </span>
        {subtitle ? <span className="mt-1 block text-sm text-slate-500">{subtitle}</span> : null}
      </span>
    </button>
  );
}

export default function ReservationPage() {
  const { carId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeAgencyId, agency, buildClientPath } = useThemeSettings();
  const agencyQuery = activeAgencyId ? `?agencyId=${activeAgencyId}` : "";
  const { data: car, loading: loadingCar } = useFetch(`/cars/${carId}${agencyQuery}`, [carId, agencyQuery]);
  const { data: packs = [] } = useFetch("/packs", []);
  const { data: options = [] } = useFetch("/options", []);
  const { data: reservationSettings } = useFetch(`/settings/reservation${agencyQuery}`, [agencyQuery]);
  const [form, setForm] = useState(initialForm);
  const [documents, setDocuments] = useState(initialDocuments);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [uploadingField, setUploadingField] = useState("");

  useEffect(() => {
    if (!user || user.type !== "CLIENT") return;

    setForm((current) => ({
      ...current,
      firstName: current.firstName || user.firstName || "",
      lastName: current.lastName || user.lastName || "",
      email: current.email || user.email || "",
      phone: current.phone || user.phone || "",
      city: current.city || user.client?.city || "",
      address: current.address || user.client?.address || "",
      cinOrPassport: current.cinOrPassport || user.client?.cinOrPassport || "",
      driverLicense: current.driverLicense || user.client?.driverLicense || "",
      identityDocUrl: current.identityDocUrl || user.client?.identityDocUrl || "",
      licenseDocUrl: current.licenseDocUrl || user.client?.licenseDocUrl || ""
    }));

    setDocuments((current) => ({
      identityDocUrl: current.identityDocUrl || buildDocumentFromUrl(user.client?.identityDocUrl),
      licenseDocUrl: current.licenseDocUrl || buildDocumentFromUrl(user.client?.licenseDocUrl)
    }));
  }, [user]);

  const selectedPack = useMemo(
    () => (Array.isArray(packs) ? packs : []).find((pack) => pack.id === form.packId),
    [form.packId, packs]
  );
  const selectedOptions = useMemo(
    () => (Array.isArray(options) ? options : []).filter((option) => form.optionIds.includes(option.id)),
    [form.optionIds, options]
  );

  async function uploadDocument(fieldName, file) {
    if (!file || !activeAgencyId) return;
    setUploadingField(fieldName);
    setError("");

    try {
      const fileForm = new FormData();
      fileForm.append("document", file);
      fileForm.append("agencyId", activeAgencyId);
      const response = await api.post("/reservations/upload-document", fileForm, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setForm((current) => ({
        ...current,
        [fieldName]: response.data.url
      }));
      setDocuments((current) => ({
        ...current,
        [fieldName]: response.data
      }));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Impossible d'importer le document.");
    } finally {
      setUploadingField("");
    }
  }

  function clearDocument(fieldName) {
    setForm((current) => ({
      ...current,
      [fieldName]: ""
    }));
    setDocuments((current) => ({
      ...current,
      [fieldName]: null
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await api.post("/reservations", { ...form, carId, agencyId: activeAgencyId });
      navigate(buildClientPath("/reservation-success"), { state: response.data });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Impossible de confirmer la reservation.");
    } finally {
      setSubmitting(false);
    }
  }

  function toggleOption(optionId) {
    setForm((current) => ({
      ...current,
      optionIds: current.optionIds.includes(optionId)
        ? current.optionIds.filter((id) => id !== optionId)
        : [...current.optionIds, optionId]
    }));
  }

  const estimate = car
    ? estimateReservation({
        pricePerDay: car.pricePerDay,
        startDate: form.startDate,
        endDate: form.endDate,
        pack: selectedPack,
        options: selectedOptions,
        settings: reservationSettings
      })
    : null;

  if (loadingCar) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="skeleton h-10 w-2/3" />
          <div className="skeleton h-64 rounded-card-primary" />
          <div className="skeleton h-64 rounded-card-primary" />
        </div>
        <div className="skeleton h-[28rem] rounded-card-primary" />
      </div>
    );
  }

  if (!car) {
    return (
      <div className="rounded-card-primary border border-slate-900/[0.06] bg-white">
        <EmptyState
          title="Vehicule indisponible"
          description="Cette voiture n'est pas disponible dans l'agence selectionnee."
          actionLabel="Voir les autres vehicules"
          actionTo={buildClientPath("/cars")}
        />
      </div>
    );
  }

  const packRows = Array.isArray(packs) ? packs : [];
  const optionRows = Array.isArray(options) ? options : [];
  const hasExtras = packRows.length > 0 || optionRows.length > 0;

  return (
    <div className="space-y-8">
      <Reveal>
        <Link to={buildClientPath(`/cars/${car.id}`)} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">
          <ArrowLeft size={16} /> Retour au vehicule
        </Link>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Finaliser votre reservation</h1>
        <p className="mt-2 text-slate-500">{agency?.agencyName || "Agence selectionnee"} · Quelques informations et c'est envoye.</p>
      </Reveal>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
        <div className="space-y-6">
          <Section number="1" title="Dates de location" description={`Entre ${reservationSettings?.minimumRentalDays || 1} et ${reservationSettings?.maximumRentalDays || 30} jour(s).`}>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Date de depart">
                <input className="input" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
              </FormField>
              <FormField label="Date de retour">
                <input className="input" type="date" min={form.startDate || undefined} value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
              </FormField>
            </div>
          </Section>

          {hasExtras ? (
            <Section number="2" title="Pack et options" description="Personnalisez votre location.">
              {packRows.length ? (
                <div role="radiogroup" aria-label="Pack" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <ChoiceCard selected={!form.packId} onClick={() => setForm({ ...form, packId: "" })} title="Sans pack" subtitle="Location simple" />
                  {packRows.map((pack) => (
                    <ChoiceCard
                      key={pack.id}
                      selected={form.packId === pack.id}
                      onClick={() => setForm({ ...form, packId: pack.id })}
                      title={pack.name}
                      subtitle={pack.description}
                      price={packLabel(pack)}
                    />
                  ))}
                </div>
              ) : null}
              {optionRows.length ? (
                <div className={packRows.length ? "mt-6" : ""}>
                  <p className="mb-3 text-[0.8rem] font-medium text-slate-600">Options</p>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    {optionRows.map((option) => (
                      <ChoiceCard
                        key={option.id}
                        type="checkbox"
                        selected={form.optionIds.includes(option.id)}
                        onClick={() => toggleOption(option.id)}
                        title={option.name}
                        subtitle={option.description}
                        price={optionLabel(option)}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </Section>
          ) : null}

          <Section number={hasExtras ? "3" : "2"} title="Vos informations" description="Elles figureront sur votre contrat de location.">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["Prenom", "firstName"],
                ["Nom", "lastName"],
                ["Email", "email"],
                ["Telephone", "phone"],
                ["Ville", "city"],
                ["Adresse", "address"],
                ["CIN / Passeport", "cinOrPassport"],
                ["Numero de permis", "driverLicense"]
              ].map(([label, key]) => (
                <FormField key={key} label={label}>
                  <input
                    className="input"
                    type={key === "email" ? "email" : key === "phone" ? "tel" : "text"}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  />
                </FormField>
              ))}
            </div>
          </Section>

          <Section number={hasExtras ? "4" : "3"} title="Documents" description="Accelerez la validation en joignant vos pieces.">
            {reservationSettings?.allowDocumentUpload ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <UploadCard
                  label="Piece d'identite"
                  hint="CIN, passeport ou scan photo."
                  document={documents.identityDocUrl}
                  uploading={uploadingField === "identityDocUrl"}
                  onChange={(event) => uploadDocument("identityDocUrl", event.target.files?.[0])}
                  onClear={() => clearDocument("identityDocUrl")}
                />
                <UploadCard
                  label="Permis de conduire"
                  hint="Recto du permis en cours de validite."
                  document={documents.licenseDocUrl}
                  uploading={uploadingField === "licenseDocUrl"}
                  onChange={(event) => uploadDocument("licenseDocUrl", event.target.files?.[0])}
                  onClear={() => clearDocument("licenseDocUrl")}
                />
              </div>
            ) : (
              <div className="card-warning flex items-start gap-3 p-4 text-sm text-amber-800">
                <ShieldCheck size={18} className="mt-0.5 shrink-0" />
                <p>L'agence a desactive l'import direct des documents. Vous pourrez les transmettre apres validation ou a la remise du vehicule.</p>
              </div>
            )}
          </Section>
        </div>

        <aside className="lg:sticky lg:top-28">
          <div className="overflow-hidden rounded-card-primary border border-slate-900/[0.06] bg-white shadow-lift">
            <div className="relative aspect-[16/9] bg-slate-100">
              <img src={car.images?.[0]?.url || CAR_FALLBACK_IMAGE} alt={`${car.brand} ${car.model}`} className="h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4 pt-12 text-white">
                <p className="font-display text-xl font-bold">{car.brand} {car.model}</p>
                <p className="text-sm text-white/75">{currency(car.pricePerDay)} / jour · caution {currency(car.depositAmount)}</p>
              </div>
            </div>

            <div className="space-y-3 p-6 text-sm">
              {estimate ? (
                <>
                  <div className="flex justify-between text-slate-600">
                    <span>Location · {estimate.totalDays} jour{estimate.totalDays > 1 ? "s" : ""}</span>
                    <span className="font-medium text-slate-900">{currency(estimate.basePrice)}</span>
                  </div>
                  {selectedPack ? (
                    <div className="flex justify-between text-slate-600">
                      <span>Pack {selectedPack.name}</span>
                      <span className="font-medium text-slate-900">{currency(estimate.packPrice)}</span>
                    </div>
                  ) : null}
                  {selectedOptions.length ? (
                    <div className="flex justify-between text-slate-600">
                      <span>Options ({selectedOptions.length})</span>
                      <span className="font-medium text-slate-900">{currency(estimate.optionsPrice)}</span>
                    </div>
                  ) : null}
                  {estimate.bookingFees ? (
                    <div className="flex justify-between text-slate-600">
                      <span>Frais de reservation</span>
                      <span className="font-medium text-slate-900">{currency(estimate.bookingFees)}</span>
                    </div>
                  ) : null}
                  <div className="flex items-end justify-between border-t border-slate-900/[0.06] pt-4">
                    <span className="font-semibold text-slate-900">Total estime</span>
                    <span className="font-display text-2xl font-bold tracking-tight text-slate-900">{currency(estimate.totalPrice)}</span>
                  </div>
                  {estimate.advanceAmount ? (
                    <div className="flex justify-between rounded-xl bg-slate-50 px-3 py-2.5 text-slate-600">
                      <span>Avance ({Number(reservationSettings?.requiredAdvancePercent || 0)}%)</span>
                      <span className="font-semibold text-slate-900">{currency(estimate.advanceAmount)}</span>
                    </div>
                  ) : null}
                </>
              ) : (
                <p className="rounded-xl bg-slate-50 px-4 py-4 text-center text-slate-500">Choisissez vos dates pour voir l'estimation.</p>
              )}

              {error ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-rose-700">{error}</p> : null}

              <button disabled={submitting || uploadingField !== ""} className="btn-primary mt-2 w-full !py-3.5 !text-[0.95rem] disabled:opacity-60">
                {submitting ? "Envoi..." : "Confirmer la reservation"}
              </button>
              <p className="flex items-center justify-center gap-1.5 text-center text-xs text-slate-400">
                <Lock size={12} /> Montant definitif confirme par l'agence.
              </p>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
