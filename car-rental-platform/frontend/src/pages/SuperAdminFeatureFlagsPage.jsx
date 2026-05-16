import { Save, ToggleLeft, Zap } from "lucide-react";
import { useState } from "react";
import api from "../api/client";
import ControlCenterHero from "../components/ControlCenterHero";
import { useFetch } from "../hooks/useFetch";

const featureCatalog = [
  ["multiAgencyMode", "Mode multi-agence", "Autorise la gestion de plusieurs agences dans le reseau."],
  ["clientSelfRegistration", "Inscription client", "Permet aux clients de creer leur compte eux-memes."],
  ["clientApprovalRequired", "Validation client requise", "Force la validation du compte client par une agence."],
  ["onlinePayment", "Paiement en ligne", "Active les flux de paiement distants."],
  ["documentUpload", "Upload des documents", "Permet l'envoi de CIN, passeport et permis."],
  ["advancedContracts", "Contrats avances", "Active les gabarits contractuels enrichis."],
  ["auditLogs", "Audit logs", "Active la couche de traçabilite des operations."],
  ["agencyBranding", "Branding agence", "Permet un branding visuel specifique par agence."]
];

export default function SuperAdminFeatureFlagsPage() {
  const { data: flags, setData } = useFetch("/platform/feature-flags", []);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!flags) return <div className="card p-8">Chargement...</div>;

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    const response = await api.put("/platform/feature-flags", flags);
    setData(response.data);
    setSaved(true);
    setSaving(false);
  }

  const enabledCount = Object.values(flags).filter(Boolean).length;

  return (
    <div className="space-y-8">
      <ControlCenterHero
        badge="Pilotage des capacites"
        title="Feature flags"
        description="Activez ou desactivez les grandes capacites produit du reseau sans toucher au code de l'agence."
        metrics={[
          {
            label: "Flags actifs",
            value: enabledCount,
            hint: "Capacites actuellement ouvertes dans la plateforme.",
            icon: Zap
          },
          {
            label: "Flags total",
            value: featureCatalog.length,
            hint: "Catalogue de bascules produit et operationnelles.",
            icon: ToggleLeft
          }
        ]}
        tone="super"
      />

      <section className="card overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-2xl font-semibold text-slate-900">Catalogue des feature flags</h2>
          <p className="mt-1 text-sm text-slate-500">Le super admin controle ici les capacites transverses du systeme.</p>
        </div>
        <div className="grid gap-4 p-6 md:grid-cols-2">
          {featureCatalog.map(([key, label, hint]) => (
            <label key={key} className="flex items-center justify-between gap-4 rounded-[1.6rem] border border-slate-200 bg-slate-50 px-5 py-4">
              <div>
                <p className="font-medium text-slate-900">{label}</p>
                <p className="text-sm text-slate-500">{hint}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-400">{key}</p>
              </div>
              <input
                type="checkbox"
                checked={Boolean(flags[key])}
                onChange={(event) => setData({ ...flags, [key]: event.target.checked })}
                className="h-5 w-5"
              />
            </label>
          ))}
        </div>
      </section>

      <div className="card p-6">
        <div className="flex flex-wrap items-center gap-3">
          <button className="btn-primary min-w-52 gap-2" onClick={handleSave} disabled={saving}>
            <Save size={18} />
            {saving ? "Enregistrement..." : "Enregistrer les feature flags"}
          </button>
          {saved ? <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">Mise a jour effectuee.</span> : null}
        </div>
      </div>
    </div>
  );
}
