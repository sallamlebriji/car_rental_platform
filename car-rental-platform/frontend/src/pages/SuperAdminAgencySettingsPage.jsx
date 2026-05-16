import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, Building2, CarFront, Copy, ExternalLink, FileUp, Globe2, Image as ImageIcon, LoaderCircle, Mail, MapPinned, PencilLine, Phone, Power, ScanSearch, Settings2, Trash2 } from "lucide-react";
import api from "../api/client";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { useFetch } from "../hooks/useFetch";

const emptyForm = {
  name: "",
  slug: "",
  code: "",
  description: "",
  address: "",
  city: "",
  country: "Maroc",
  phone: "",
  email: "",
  website: "",
  whatsapp: "",
  logoUrl: "",
  coverImageUrl: "",
  isActive: true
};

function UploadImageField({ label, hint, value, uploading, onUpload, onClear }) {
  return (
    <div className="space-y-3 rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-4">
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <p className="text-xs text-slate-500">{hint}</p>
      </div>

      {value ? (
        <div className="overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white">
          <img src={value} alt={label} className="h-40 w-full object-cover" />
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center rounded-[1.25rem] border border-dashed border-slate-300 bg-white text-sm text-slate-400">
          Aucun visuel importe
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <label className="btn-secondary cursor-pointer gap-2">
          {uploading ? <LoaderCircle size={16} className="animate-spin" /> : <FileUp size={16} />}
          {value ? (uploading ? "Remplacement..." : "Remplacer") : (uploading ? "Import..." : "Importer")}
          <input className="hidden" type="file" accept=".jpg,.jpeg,.png,.webp" disabled={uploading} onChange={onUpload} />
        </label>
        {value ? (
          <button type="button" className="btn-secondary gap-2 border-rose-200 text-rose-700" onClick={onClear} disabled={uploading}>
            <Trash2 size={16} />
            Supprimer
          </button>
        ) : null}
      </div>

      {value ? <p className="truncate text-xs text-slate-500">{value}</p> : null}
    </div>
  );
}

export default function SuperAdminAgencySettingsPage() {
  const { data: agenciesData, setData } = useFetch("/agencies", []);
  const agencies = Array.isArray(agenciesData) ? agenciesData : [];
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [uploadingField, setUploadingField] = useState("");

  useEffect(() => {
    if (selectedAgency) {
      setForm({
        name: selectedAgency.name || "",
        slug: selectedAgency.slug || "",
        code: selectedAgency.code || "",
        description: selectedAgency.description || "",
        address: selectedAgency.address || "",
        city: selectedAgency.city || "",
        country: selectedAgency.country || "Maroc",
        phone: selectedAgency.phone || "",
        email: selectedAgency.email || "",
        website: selectedAgency.website || "",
        whatsapp: selectedAgency.whatsapp || "",
        logoUrl: selectedAgency.logoUrl || "",
        coverImageUrl: selectedAgency.coverImageUrl || "",
        isActive: selectedAgency.isActive ?? true
      });
    } else {
      setForm(emptyForm);
    }
  }, [selectedAgency]);

  useEffect(() => {
    if (selectedAgency) return;
    if (!form.name) return;

    const suggestedSlug = form.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setForm((current) => (
      current.slug ? current : { ...current, slug: suggestedSlug }
    ));
  }, [form.name, form.slug, selectedAgency]);

  async function uploadImage(target, file) {
    if (!file) return;
    setUploadingField(target);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await api.post("/settings/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setForm((current) => ({ ...current, [target]: response.data.url }));
    } catch (error) {
      setMessage(error.response?.data?.message || "Impossible d'importer l'image.");
    } finally {
      setUploadingField("");
    }
  }

  function clearImage(target) {
    setForm((current) => ({ ...current, [target]: "" }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const response = selectedAgency
      ? await api.put(`/agencies/${selectedAgency.id}`, form)
      : await api.post("/agencies", form);

    if (selectedAgency) {
      setData(agencies.map((agency) => (agency.id === selectedAgency.id ? { ...agency, ...response.data } : agency)));
      setSelectedAgency({ ...selectedAgency, ...response.data });
      setMessage("Agence mise a jour.");
    } else {
      setData([response.data, ...agencies]);
      setSelectedAgency(response.data);
      setMessage("Nouvelle agence creee.");
    }
  }

  async function disableAgency(agency) {
    await api.delete(`/agencies/${agency.id}`);
    setData(agencies.map((item) => (item.id === agency.id ? { ...item, isActive: false } : item)));
    if (selectedAgency?.id === agency.id) {
      setSelectedAgency({ ...agency, isActive: false });
    }
    setMessage("Agence desactivee.");
  }

  const statCards = [
    {
      label: "Agences actives",
      value: agencies.filter((agency) => agency.isActive).length,
      tone: "from-emerald-500 to-teal-500",
      icon: BadgeCheck
    },
    {
      label: "Villes couvertes",
      value: new Set(agencies.map((agency) => agency.city).filter(Boolean)).size,
      tone: "from-sky-500 to-cyan-500",
      icon: MapPinned
    },
    {
      label: "Parc total",
      value: agencies.reduce((sum, agency) => sum + (agency._count?.cars || 0), 0),
      tone: "from-amber-500 to-orange-500",
      icon: CarFront
    }
  ];

  const previewName = form.name || "Nouvelle agence";
  const previewLocation = [form.city, form.country].filter(Boolean).join(", ") || "Ville et pays";
  const previewInitials = previewName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "AG";
  const portalBaseUrl = form.slug ? `${window.location.origin}/agency/${form.slug}` : "";

  async function copyLink(value) {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setMessage("Lien copie dans le presse-papiers.");
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-6 text-white shadow-soft lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.24),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(251,146,60,0.22),transparent_30%)]" />
        <div className="relative grid gap-6 xl:grid-cols-[1.35fr_0.95fr] xl:items-start">
          <div className="space-y-5">
            <span className="inline-flex rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-300">
              Reseau multi-agence
            </span>
            <div>
              <h1 className="text-4xl font-semibold md:text-5xl">Gestion des agences</h1>
              <p className="mt-3 max-w-2xl text-base text-slate-300 md:text-lg">
                Le super admin peut creer plusieurs agences, suivre leur activite et construire un reseau visuellement coherent.
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {statCards.map((card) => (
              <div key={card.label} className={`rounded-[1.6rem] bg-gradient-to-br ${card.tone} p-[1px]`}>
                <div className="rounded-[1.55rem] bg-slate-950/80 px-5 py-5 backdrop-blur">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm text-slate-300">{card.label}</p>
                      <h2 className="mt-2 break-words text-3xl font-semibold text-white md:text-4xl">{card.value}</h2>
                    </div>
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center self-start rounded-2xl bg-white/10">
                      <card.icon size={22} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(420px,0.95fr)] 2xl:grid-cols-[minmax(0,1.55fr)_minmax(460px,0.9fr)]">
        <section className="space-y-6">
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Agences existantes</h2>
                <p className="mt-1 text-sm text-slate-500">Pilotez le statut, la flotte et les reservations de chaque agence.</p>
              </div>
              <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
                {agencies.length} agence{agencies.length > 1 ? "s" : ""}
              </div>
            </div>
            <DataTable
              columns={[
                {
                  key: "name",
                  label: "Agence",
                  render: (row) => (
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 font-semibold text-slate-700">
                        {(row.name || "AG").split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{row.name}</p>
                        <p className="text-xs text-slate-500">{row.code || row.slug}</p>
                      </div>
                    </div>
                  )
                },
                { key: "city", label: "Ville" },
                { key: "email", label: "Email" },
                { key: "status", label: "Statut", render: (row) => <StatusBadge status={row.isActive ? "AVAILABLE" : "DISABLED"} /> },
                { key: "fleet", label: "Voitures", render: (row) => row._count?.cars || 0 },
                { key: "bookings", label: "Reservations", render: (row) => row._count?.reservations || 0 },
                {
                  key: "actions",
                  label: "Actions",
                  render: (row) => (
                    <div className="flex gap-2">
                      <button className="btn-secondary !px-3 !py-2" onClick={() => setSelectedAgency(row)}>
                        <span className="inline-flex items-center gap-2">
                          <PencilLine size={16} />
                          Gerer
                        </span>
                      </button>
                      <button className="btn-secondary !px-3 !py-2" onClick={() => disableAgency(row)}>
                        <span className="inline-flex items-center gap-2">
                          <Power size={16} />
                          Desactiver
                        </span>
                      </button>
                    </div>
                  )
                }
              ]}
              rows={agencies}
            />
          </div>
        </section>

        <section className="space-y-6">
          <div className="sticky top-6 space-y-6">
            <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white shadow-soft">
              <div className="space-y-5 p-6">
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                    Apercu live
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                    {form.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="rounded-[1.6rem] bg-white/5 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-semibold">{previewName}</h3>
                      <p className="mt-1 text-sm text-slate-300">{previewLocation}</p>
                    </div>
                    {form.logoUrl ? (
                      <img src={form.logoUrl} alt={previewName} className="h-14 w-14 rounded-2xl bg-white/90 object-cover p-2" />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-lg font-semibold">
                        {previewInitials}
                      </div>
                    )}
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white/5 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Slug</p>
                      <p className="mt-2 text-sm font-medium text-white">{form.slug || "slug-agence"}</p>
                    </div>
                    <div className="rounded-2xl bg-white/5 px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Code</p>
                      <p className="mt-2 text-sm font-medium text-white">{form.code || "AUTO"}</p>
                    </div>
                    <div className="rounded-2xl bg-white/5 px-4 py-3 sm:col-span-2">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Contact</p>
                      <p className="mt-2 text-sm font-medium text-white">{form.email || "email@agence.ma"}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-white/5 px-4 py-3">
                      <div className="flex items-center gap-2 text-slate-300">
                        <MapPinned size={15} />
                        <span className="text-xs uppercase tracking-[0.18em]">Ville</span>
                      </div>
                      <p className="mt-2 text-sm font-medium text-white">{form.city || "A definir"}</p>
                    </div>
                    <div className="rounded-2xl bg-white/5 px-4 py-3">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Phone size={15} />
                        <span className="text-xs uppercase tracking-[0.18em]">Tel</span>
                      </div>
                      <p className="mt-2 text-sm font-medium text-white">{form.phone || "Non renseigne"}</p>
                    </div>
                    <div className="rounded-2xl bg-white/5 px-4 py-3">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Globe2 size={15} />
                        <span className="text-xs uppercase tracking-[0.18em]">Web</span>
                      </div>
                      <p className="mt-2 text-sm font-medium text-white">{form.website || "Non renseigne"}</p>
                    </div>
                  </div>
                  {portalBaseUrl ? (
                    <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">URLs dediees de l'agence</p>
                      <div className="mt-3 grid gap-3">
                        {[
                          ["Portail client", portalBaseUrl],
                          ["Connexion client", `${portalBaseUrl}/login`],
                          ["Connexion agence", `${portalBaseUrl}/admin/login`]
                        ].map(([label, value]) => (
                          <div key={label} className="flex flex-col gap-3 rounded-2xl bg-white/5 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-white">{label}</p>
                              <p className="truncate text-xs text-slate-300">{value}</p>
                            </div>
                            <div className="flex gap-2">
                              <button type="button" className="rounded-xl bg-white/10 p-2 text-white transition hover:bg-white/15" onClick={() => copyLink(value)}>
                                <Copy size={15} />
                              </button>
                              <a href={value} target="_blank" rel="noreferrer" className="rounded-xl bg-white/10 p-2 text-white transition hover:bg-white/15">
                                <ExternalLink size={15} />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {selectedAgency ? (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <Link className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/15" to={`/super-admin/visual-settings?agencyId=${selectedAgency.id}`}>
                        Configurer le visuel client
                      </Link>
                      <Link className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/15" to={`/super-admin/reservation-settings?agencyId=${selectedAgency.id}`}>
                        Regles de reservation
                      </Link>
                      <Link className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/15" to={`/super-admin/notification-settings?agencyId=${selectedAgency.id}`}>
                        Notifications agence
                      </Link>
                      <Link className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/15" to={`/super-admin/document-settings?agencyId=${selectedAgency.id}`}>
                        Documents et contrats
                      </Link>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="card overflow-hidden">
              <div className="border-b border-slate-100 px-6 py-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-900">
                      {selectedAgency ? "Modifier l'agence" : "Ajouter une agence"}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Creez une nouvelle entite avec ses informations de contact et son identite.
                    </p>
                  </div>
                  {selectedAgency ? (
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => {
                        setSelectedAgency(null);
                        setMessage("");
                      }}
                    >
                      Nouvelle
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="space-y-8 p-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                        <Building2 size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Identite</p>
                        <p className="text-sm text-slate-500">Nom, code interne et informations de positionnement.</p>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      {[
                        ["Nom de l'agence", "name", "Atlas Drive Rabat"],
                        ["Slug public", "slug", "atlas-drive-rabat"],
                        ["Code interne", "code", "ATL-RBT"],
                        ["Ville", "city", "Rabat"],
                        ["Pays", "country", "Maroc"],
                        ["Description", "description", "Agence premium a fort trafic"]
                      ].map(([label, key, placeholder]) => (
                        <label key={key} className={`space-y-2 ${key === "description" ? "md:col-span-2" : ""}`}>
                          <span className="text-sm font-medium text-slate-700">{label}</span>
                          <input
                            className="input"
                            placeholder={placeholder}
                            value={form[key]}
                            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                        <Mail size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Coordonnees</p>
                        <p className="text-sm text-slate-500">Adresse, email, telephone et canaux de contact.</p>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      {[
                        ["Adresse", "address", "Boulevard Mohammed V"],
                        ["Telephone", "phone", "+212600000000"],
                        ["Email", "email", "contact@agence.ma"],
                        ["WhatsApp", "whatsapp", "+212611111111"],
                        ["Site web", "website", "https://agence.ma"]
                      ].map(([label, key, placeholder]) => (
                        <label key={key} className={`space-y-2 ${key === "address" ? "md:col-span-2" : ""}`}>
                          <span className="text-sm font-medium text-slate-700">{label}</span>
                          <input
                            className="input"
                            placeholder={placeholder}
                            value={form[key]}
                            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                          />
                        </label>
                      ))}
                    </div>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <UploadImageField
                        label="Logo agence"
                        hint="Logo affiche sur les cartes, la vitrine client et certains documents."
                        value={form.logoUrl || ""}
                        uploading={uploadingField === "logoUrl"}
                        onUpload={(event) => uploadImage("logoUrl", event.target.files?.[0])}
                        onClear={() => clearImage("logoUrl")}
                      />
                      <UploadImageField
                        label="Image de couverture"
                        hint="Visuel principal utilise dans les apercus et la vitrine client."
                        value={form.coverImageUrl || ""}
                        uploading={uploadingField === "coverImageUrl"}
                        onUpload={(event) => uploadImage("coverImageUrl", event.target.files?.[0])}
                        onClear={() => clearImage("coverImageUrl")}
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-slate-700">
                      <Settings2 size={18} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Pilotage agence et site client</p>
                      <p className="mt-1 text-sm text-slate-500">
                        Le super admin peut definir ici l'identite de l'agence, puis ouvrir les reglages visuels, reservation, notifications et documents propres a cette agence.
                      </p>
                    </div>
                  </div>
                </div>

                <label className="flex items-center justify-between rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-4">
                  <div>
                    <p className="font-medium text-slate-900">Agence active</p>
                    <p className="text-sm text-slate-500">Une agence inactive reste visible mais n'est plus exploitable.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="h-5 w-5 rounded"
                  />
                </label>

                <div className="flex flex-wrap items-center gap-3">
                  <button className="btn-primary min-w-52" disabled={uploadingField !== ""}>
                    {selectedAgency ? "Enregistrer les changements" : "Creer l'agence"}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setSelectedAgency(null);
                      setForm(emptyForm);
                      setMessage("");
                    }}
                  >
                    Reinitialiser
                  </button>
                  <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
                    <span className="inline-flex items-center gap-2">
                      <ScanSearch size={15} />
                      Verification visuelle active
                    </span>
                  </div>
                </div>

                {message ? (
                  <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    {message}
                  </p>
                ) : null}
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
