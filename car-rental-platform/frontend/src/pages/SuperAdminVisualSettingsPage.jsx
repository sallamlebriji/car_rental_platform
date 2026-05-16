import { useEffect, useMemo, useState } from "react";
import { Eye, Image as ImageIcon, Palette, Save, Sparkles, Building2, FileUp, LoaderCircle, Trash2 } from "lucide-react";
import api from "../api/client";
import AgencyScopeSelector from "../components/AgencyScopeSelector";
import ControlCenterHero from "../components/ControlCenterHero";
import { useFetch } from "../hooks/useFetch";
import { useSearchParams } from "react-router-dom";

function Field({ label, hint, children }) {
  return (
    <label className="space-y-2.5">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      {children}
      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
    </label>
  );
}

function MetricCard({ label, value, hint }) {
  return (
    <div className="rounded-[1.6rem] border border-slate-200 bg-white/80 p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{hint}</p>
    </div>
  );
}

function UploadImageField({ label, hint, value, uploading, onUpload, onClear }) {
  return (
    <div className="space-y-3 rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-4">
      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-800">{label}</p>
        {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
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

export default function SuperAdminVisualSettingsPage() {
  const [searchParams] = useSearchParams();
  const { data: agenciesData } = useFetch("/agencies", []);
  const agencies = Array.isArray(agenciesData) ? agenciesData : [];
  const [selectedAgencyId, setSelectedAgencyId] = useState("");
  const { data: visual, setData } = useFetch(
    selectedAgencyId ? `/settings/visual?agencyId=${selectedAgencyId}` : "/settings/visual",
    [selectedAgencyId]
  );
  const { data: agencySettings, setData: setAgencySettings } = useFetch(
    selectedAgencyId ? `/settings/agency?agencyId=${selectedAgencyId}` : "/settings/agency",
    [selectedAgencyId]
  );
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState("");

  useEffect(() => {
    const agencyIdFromQuery = searchParams.get("agencyId");
    if (agencyIdFromQuery && agencyIdFromQuery !== selectedAgencyId) {
      setSelectedAgencyId(agencyIdFromQuery);
      return;
    }

    if (!selectedAgencyId && agencies.length) {
      setSelectedAgencyId(agencies[0].id);
    }
  }, [agencies, searchParams, selectedAgencyId]);

  const selectedAgency = useMemo(
    () => agencies.find((agency) => agency.id === selectedAgencyId),
    [agencies, selectedAgencyId]
  );

  const preview = useMemo(() => {
    if (!visual) return null;
    return {
      primaryColor: visual.primaryColor || "#0f766e",
      secondaryColor: visual.secondaryColor || "#f59e0b",
      coverImageUrl: visual.coverImageUrl || "",
      homepageText: visual.homepageText || "Decouvrez une flotte moderne, flexible et prete a etre reservee.",
      primaryButtonText: visual.primaryButtonText || "Reserver maintenant"
    };
  }, [visual]);

  if (!selectedAgencyId || !visual || !preview || !agencySettings) {
    return <div className="card p-8">Chargement...</div>;
  }

  async function uploadImage(target, file) {
    if (!file) return;
    setUploadingField(target);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await api.post("/settings/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (target === "coverImageUrl") {
        setData({ ...visual, coverImageUrl: response.data.url });
      } else {
        setAgencySettings({ ...agencySettings, [target]: response.data.url });
      }
    } finally {
      setUploadingField("");
    }
  }

  function clearImage(target) {
    if (target === "coverImageUrl") {
      setData({ ...visual, coverImageUrl: "" });
      return;
    }
    setAgencySettings({ ...agencySettings, [target]: "" });
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);

    const [visualResponse, agencyResponse] = await Promise.all([
      api.put(`/settings/visual?agencyId=${selectedAgencyId}`, visual),
      api.put(`/settings/agency?agencyId=${selectedAgencyId}`, agencySettings)
    ]);

    setData(visualResponse.data);
    setAgencySettings(agencyResponse.data);
    setSaved(true);
    setSaving(false);
  }

  const heroMetrics = [
    {
      label: "Agence cible",
      value: selectedAgency?.name || "Agence",
      hint: "Scope actif pour les reglages visuels.",
      icon: Building2
    },
    {
      label: "Couleur primaire",
      value: preview.primaryColor.toUpperCase(),
      hint: "Accent principal applique au theme client.",
      icon: Palette
    },
    {
      label: "Etat du hero",
      value: preview.coverImageUrl ? "Image active" : "Sans image",
      hint: "Presence d'un visuel de couverture cote client.",
      icon: ImageIcon
    }
  ];

  return (
    <div className="space-y-8">
      <ControlCenterHero
        badge="Direction artistique"
        title="Parametres visuels"
        description="Pilotez par agence le branding public, la vitrine client, les textes du hero et les elements de presentation du site."
        metrics={heroMetrics}
        tone="super"
      />

      <AgencyScopeSelector
        agencies={agencies}
        value={selectedAgencyId}
        onChange={setSelectedAgencyId}
        helper="Le super admin peut changer d'agence cible pour gerer son identite et sa vitrine client."
      />

      <section className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <div className="space-y-6">
          <div className="card overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">
                  <Building2 size={18} />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Identite agence</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Parametres visibles autour de la marque de l'agence sur le site client.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 p-6 md:grid-cols-2">
              <Field label="Nom agence">
                <input className="input" value={agencySettings.agencyName || ""} onChange={(e) => setAgencySettings({ ...agencySettings, agencyName: e.target.value })} />
              </Field>
              <Field label="Slogan">
                <input className="input" value={agencySettings.slogan || ""} onChange={(e) => setAgencySettings({ ...agencySettings, slogan: e.target.value })} />
              </Field>
              <div className="md:col-span-2 grid gap-5 md:grid-cols-2">
                <UploadImageField
                  label="Logo agence"
                  hint="Logo affiche sur le site client et dans certains documents."
                  value={agencySettings.logoUrl || ""}
                  uploading={uploadingField === "logoUrl"}
                  onUpload={(event) => uploadImage("logoUrl", event.target.files?.[0])}
                  onClear={() => clearImage("logoUrl")}
                />
                <UploadImageField
                  label="Favicon"
                  hint="Petit icone navigateur pour la vitrine client."
                  value={agencySettings.faviconUrl || ""}
                  uploading={uploadingField === "faviconUrl"}
                  onUpload={(event) => uploadImage("faviconUrl", event.target.files?.[0])}
                  onClear={() => clearImage("faviconUrl")}
                />
              </div>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">
                  <Palette size={18} />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Palette et branding client</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Definissez les couleurs et l'ambiance du site cote client pour l'agence selectionnee.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 p-6 md:grid-cols-2">
              <Field label="Couleur principale" hint="Utilisee pour les boutons et accents principaux.">
                <div className="flex gap-3">
                  <input type="color" className="h-12 w-16 rounded-2xl border border-slate-200 bg-white" value={visual.primaryColor || "#0f766e"} onChange={(e) => setData({ ...visual, primaryColor: e.target.value })} />
                  <input className="input" value={visual.primaryColor || ""} onChange={(e) => setData({ ...visual, primaryColor: e.target.value })} placeholder="#0f766e" />
                </div>
              </Field>

              <Field label="Couleur secondaire" hint="Utilisee pour les badges, contrastes et details.">
                <div className="flex gap-3">
                  <input type="color" className="h-12 w-16 rounded-2xl border border-slate-200 bg-white" value={visual.secondaryColor || "#f59e0b"} onChange={(e) => setData({ ...visual, secondaryColor: e.target.value })} />
                  <input className="input" value={visual.secondaryColor || ""} onChange={(e) => setData({ ...visual, secondaryColor: e.target.value })} placeholder="#f59e0b" />
                </div>
              </Field>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">
                  <ImageIcon size={18} />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Vitrine client</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Controlez l'image de couverture, le message hero et l'appel a l'action du site client.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 p-6">
              <UploadImageField
                label="Image de couverture"
                hint="Visuel principal du hero de la page d'accueil client."
                value={visual.coverImageUrl || ""}
                uploading={uploadingField === "coverImageUrl"}
                onUpload={(event) => uploadImage("coverImageUrl", event.target.files?.[0])}
                onClear={() => clearImage("coverImageUrl")}
              />

              <Field label="Texte d'accueil" hint="Phrase principale affichee dans le hero du site client.">
                <textarea className="input min-h-32 resize-y" rows="5" value={visual.homepageText || ""} onChange={(e) => setData({ ...visual, homepageText: e.target.value })} placeholder="Flotte premium, reservation rapide et service de confiance." />
              </Field>

              <Field label="Texte du bouton principal" hint="Libelle du bouton principal sur la page d'accueil client.">
                <input className="input" value={visual.primaryButtonText || ""} onChange={(e) => setData({ ...visual, primaryButtonText: e.target.value })} placeholder="Reserver maintenant" />
              </Field>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">
                  <Eye size={18} />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Apercu live cote client</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Lecture immediate de la vitrine publique telle que le client la verra pour l'agence selectionnee.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 p-6">
              <div
                className="relative overflow-hidden rounded-[2rem] p-6 text-white"
                style={{ background: `linear-gradient(135deg, ${preview.primaryColor} 0%, ${preview.secondaryColor} 100%)` }}
              >
                {preview.coverImageUrl ? <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: `url(${preview.coverImageUrl})` }} /> : null}
                <div className="absolute inset-0 bg-slate-950/45" />
                <div className="relative space-y-5">
                  <span className="inline-flex rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-100">
                    Site client
                  </span>
                  <div className="flex items-center gap-3">
                    {agencySettings.logoUrl ? (
                      <img src={agencySettings.logoUrl} alt={agencySettings.agencyName || "Logo agence"} className="h-14 w-14 rounded-2xl bg-white/90 object-cover p-2" />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-lg font-semibold">
                        {(agencySettings.agencyName || selectedAgency?.name || "AG").slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="text-3xl font-semibold tracking-tight md:text-4xl">{agencySettings.agencyName || selectedAgency?.name || "Atlas Drive"}</h3>
                      <p className="text-sm text-slate-200">{agencySettings.slogan || "Agence moderne et flexible"}</p>
                    </div>
                  </div>
                  <p className="max-w-xl text-base leading-relaxed text-slate-100">{preview.homepageText}</p>
                  <button type="button" className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-sm">
                    <Sparkles size={16} />
                    {preview.primaryButtonText}
                  </button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <MetricCard label="Couleur dominante" value={preview.primaryColor} hint="Base visuelle des CTA et accents." />
                <MetricCard label="Couleur secondaire" value={preview.secondaryColor} hint="Couleur de contraste et d'accompagnement." />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex flex-wrap items-center gap-3">
              <button className="btn-primary min-w-52 gap-2" onClick={handleSave} disabled={saving || uploadingField !== ""}>
                <Save size={18} />
                {saving ? "Enregistrement..." : "Enregistrer le visuel de l'agence"}
              </button>
              {saved ? <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">Mise a jour effectuee.</span> : null}
            </div>
            <p className="mt-3 text-sm text-slate-500">
              Le super admin applique ici un branding specifique a l'agence selectionnee, visible cote client.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
