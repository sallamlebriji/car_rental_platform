import { useEffect, useMemo, useState } from "react";
import { Eye, FileText, FileUp, LoaderCircle, ShieldCheck, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/client";
import { useFetch } from "../hooks/useFetch";
import { useThemeSettings } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import FormField from "../components/FormField";
import { currency } from "../utils/format";

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
    <div className="rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-800">{label}</p>
          <p className="mt-1 text-xs text-slate-500">{hint}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
          {uploading ? <LoaderCircle size={18} className="animate-spin" /> : <FileText size={18} />}
        </div>
      </div>

      {hasDocument ? (
        <div className="mt-4 space-y-4">
          {isImageDocument(document) ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <img src={document.url} alt={document.originalName || label} className="h-40 w-full object-cover" />
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-600 shadow-soft">
                <FileText size={18} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">{document.originalName || "Document importe"}</p>
                <p className="text-xs text-slate-500">{document.mimeType === "application/pdf" ? "PDF" : "Document"}</p>
              </div>
            </div>
          )}

          <div className="rounded-2xl bg-slate-50 px-4 py-3">
            <p className="truncate text-sm font-semibold text-slate-800">{document.originalName || "Document importe"}</p>
            <p className="mt-1 text-xs text-slate-500">Le fichier est deja importe et sera transmis avec la reservation.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a className="btn-secondary gap-2" href={document.url} target="_blank" rel="noreferrer">
              <Eye size={16} />
              Ouvrir
            </a>
            <label className="btn-secondary cursor-pointer gap-2">
              <FileUp size={16} />
              {uploading ? "Remplacement..." : "Remplacer"}
              <input className="hidden" type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" disabled={uploading} onChange={onChange} />
            </label>
            <button type="button" className="btn-secondary gap-2 border-rose-200 text-rose-700" onClick={onClear} disabled={uploading}>
              <Trash2 size={16} />
              Supprimer
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100">
            <FileUp size={16} />
            {uploading ? "Import en cours..." : "Importer un document"}
            <input className="hidden" type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" disabled={uploading} onChange={onChange} />
          </label>
          <p className="mt-3 text-xs text-slate-400">Aucun fichier importe pour le moment.</p>
        </div>
      )}
    </div>
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

  if (loadingCar) {
    return <div className="card p-6">Chargement du vehicule...</div>;
  }

  if (!car) {
    return <div className="card p-6">Cette voiture n'est pas disponible dans l'agence selectionnee.</div>;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-6">
        <div className="card overflow-hidden">
          <img
            src={car.images?.[0]?.url || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80"}
            alt={`${car.brand} ${car.model}`}
            className="h-72 w-full object-cover"
          />
          <div className="space-y-3 p-6">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{agency?.agencyName || "Agence selectionnee"}</p>
            <h1 className="text-3xl font-semibold">Reserver {car.brand} {car.model}</h1>
            <p className="text-slate-500">Prix de base {currency(car.pricePerDay)} / jour, caution {currency(car.depositAmount)}.</p>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-semibold">Rappel avant validation</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li>• Duree minimale: {reservationSettings?.minimumRentalDays || 1} jour(s)</li>
            <li>• Duree maximale: {reservationSettings?.maximumRentalDays || 30} jour(s)</li>
            <li>• Frais de reservation: {currency(reservationSettings?.bookingFees || 0)}</li>
            <li>• Avance demandee: {Number(reservationSettings?.requiredAdvancePercent || 0)}%</li>
            <li>• Upload de documents: {reservationSettings?.allowDocumentUpload ? "autorise" : "desactive"}</li>
          </ul>
          {selectedPack || selectedOptions.length ? (
            <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              {selectedPack ? <p><strong>Pack:</strong> {selectedPack.name}</p> : null}
              {selectedOptions.length ? <p><strong>Options:</strong> {selectedOptions.map((option) => option.name).join(", ")}</p> : null}
            </div>
          ) : null}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card grid gap-5 p-6 md:grid-cols-2">
        <FormField label="Date debut">
          <input className="input" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
        </FormField>
        <FormField label="Date fin">
          <input className="input" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
        </FormField>
        <FormField label="Pack">
          <select className="input" value={form.packId} onChange={(e) => setForm({ ...form, packId: e.target.value })}>
            <option value="">Aucun pack</option>
            {(Array.isArray(packs) ? packs : []).map((pack) => <option key={pack.id} value={pack.id}>{pack.name}</option>)}
          </select>
        </FormField>
        <div className="md:col-span-2">
          <p className="mb-2 text-sm font-medium text-slate-700">Options</p>
          <div className="grid gap-3 md:grid-cols-2">
            {(Array.isArray(options) ? options : []).map((option) => (
              <label key={option.id} className="flex items-center gap-3 rounded-2xl border border-slate-100 p-4">
                <input type="checkbox" checked={form.optionIds.includes(option.id)} onChange={() => toggleOption(option.id)} />
                <span>{option.name}</span>
              </label>
            ))}
          </div>
        </div>
        {[
          ["Nom", "lastName"],
          ["Prenom", "firstName"],
          ["Email", "email"],
          ["Telephone", "phone"],
          ["Ville", "city"],
          ["Adresse", "address"],
          ["CIN / Passeport", "cinOrPassport"],
          ["Permis", "driverLicense"]
        ].map(([label, key]) => (
          <FormField key={key} label={label}>
            <input className="input" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
          </FormField>
        ))}

        {reservationSettings?.allowDocumentUpload ? (
          <div className="grid gap-4 md:col-span-2 md:grid-cols-2">
            <UploadCard
              label="Document d'identite"
              hint="Importez votre CIN, passeport ou scan photo."
              document={documents.identityDocUrl}
              uploading={uploadingField === "identityDocUrl"}
              onChange={(event) => uploadDocument("identityDocUrl", event.target.files?.[0])}
              onClear={() => clearDocument("identityDocUrl")}
            />
            <UploadCard
              label="Permis de conduire"
              hint="Formats acceptes: JPG, PNG, WEBP ou PDF."
              document={documents.licenseDocUrl}
              uploading={uploadingField === "licenseDocUrl"}
              onChange={(event) => uploadDocument("licenseDocUrl", event.target.files?.[0])}
              onClear={() => clearDocument("licenseDocUrl")}
            />
          </div>
        ) : (
          <div className="rounded-[1.6rem] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 md:col-span-2">
            <div className="flex items-start gap-3">
              <ShieldCheck size={18} className="mt-0.5" />
              <p>L'agence a desactive l'import direct des documents. Vous pourrez les transmettre apres validation ou a la remise du vehicule.</p>
            </div>
          </div>
        )}

        {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 md:col-span-2">{error}</p> : null}
        <button disabled={submitting || uploadingField !== ""} className="btn-primary md:col-span-2">
          {submitting ? "Envoi..." : "Confirmer la reservation"}
        </button>
      </form>
    </div>
  );
}
