import { useMemo, useState } from "react";
import {
  BadgePercent,
  CalendarRange,
  CircleDollarSign,
  PencilLine,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2
} from "lucide-react";
import api from "../api/client";
import DataTable from "../components/DataTable";
import { useFetch } from "../hooks/useFetch";
import { currency } from "../utils/format";

function PackMetricCard({ icon: Icon, label, value, hint, tone }) {
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

function Field({ label, icon: Icon, children }) {
  return (
    <label className="space-y-2.5">
      <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
        {Icon ? <Icon size={16} className="text-slate-400" /> : null}
        {label}
      </span>
      {children}
    </label>
  );
}

function formatPackValue(pack) {
  if (pack.pricingType === "PERCENTAGE") return `${Number(pack.pricingValue)} %`;
  if (pack.pricingType === "DAILY") return `${currency(pack.pricingValue)} / jour`;
  return currency(pack.pricingValue);
}

export default function AdminPacksPage() {
  const { data: packsData, setData, loading } = useFetch("/packs", []);
  const packs = Array.isArray(packsData) ? packsData : [];
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingPackId, setEditingPackId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    pricingType: "FIXED",
    pricingValue: 0,
    includedKm: "",
    hasInsurance: false,
    includesDriver: false,
    includesDelivery: false,
    conditions: "",
    isActive: true
  });

  const metrics = useMemo(() => {
    const total = packs.length;
    const active = packs.filter((pack) => pack.isActive).length;
    const percentagePacks = packs.filter((pack) => pack.pricingType === "PERCENTAGE").length;
    const dailyPacks = packs.filter((pack) => pack.pricingType === "DAILY").length;
    return { total, active, percentagePacks, dailyPacks };
  }, [packs]);

  function resetForm() {
    setEditingPackId(null);
    setForm({
      name: "",
      description: "",
      pricingType: "FIXED",
      pricingValue: 0,
      includedKm: "",
      hasInsurance: false,
      includesDriver: false,
      includesDelivery: false,
      conditions: "",
      isActive: true
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setFeedback("");

    try {
      const payload = {
        ...form,
        pricingValue: Number(form.pricingValue),
        includedKm: form.includedKm ? Number(form.includedKm) : null
      };

      if (editingPackId) {
        const response = await api.put(`/packs/${editingPackId}`, payload);
        setData(packs.map((item) => (item.id === editingPackId ? response.data : item)));
        setFeedback("Pack mis a jour avec succes.");
      } else {
        const response = await api.post("/packs", payload);
        setData([response.data, ...packs]);
        setFeedback("Pack ajoute avec succes.");
      }

      resetForm();
    } catch (error) {
      setFeedback(error.response?.data?.message || "Impossible d'enregistrer ce pack.");
    } finally {
      setSubmitting(false);
    }
  }

  async function togglePack(pack) {
    const response = await api.put(`/packs/${pack.id}`, {
      name: pack.name,
      description: pack.description,
      pricingType: pack.pricingType,
      pricingValue: Number(pack.pricingValue),
      includedKm: pack.includedKm,
      hasInsurance: pack.hasInsurance,
      includesDriver: pack.includesDriver,
      includesDelivery: pack.includesDelivery,
      conditions: pack.conditions,
      isActive: !pack.isActive
    });
    setData(packs.map((item) => (item.id === pack.id ? response.data : item)));
  }

  async function removePack(packId) {
    await api.delete(`/packs/${packId}`);
    setData(packs.filter((pack) => pack.id !== packId));
  }

  function startEditing(pack) {
    setEditingPackId(pack.id);
    setForm({
      name: pack.name || "",
      description: pack.description || "",
      pricingType: pack.pricingType || "FIXED",
      pricingValue: Number(pack.pricingValue || 0),
      includedKm: pack.includedKm ?? "",
      hasInsurance: Boolean(pack.hasInsurance),
      includesDriver: Boolean(pack.includesDriver),
      includesDelivery: Boolean(pack.includesDelivery),
      conditions: pack.conditions || "",
      isActive: Boolean(pack.isActive)
    });
    setFeedback("");
  }

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <span className="inline-flex rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-500">
          Strategie packs
        </span>
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">Gestion des packs</h1>
          <p className="mt-2 max-w-3xl text-lg leading-relaxed text-slate-500">
            Construisez vos offres commerciales, gérez les avantages inclus et pilotez la tarification des réservations.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <PackMetricCard icon={Sparkles} label="Packs" value={metrics.total} hint="Nombre total d'offres commerciales configurées." tone="from-sky-500 to-cyan-500" />
        <PackMetricCard icon={ShieldCheck} label="Actifs" value={metrics.active} hint="Packs actuellement disponibles lors de la réservation." tone="from-emerald-500 to-teal-500" />
        <PackMetricCard icon={BadgePercent} label="Pourcentage" value={metrics.percentagePacks} hint="Offres basées sur une remise ou majoration en %." tone="from-amber-500 to-orange-500" />
        <PackMetricCard icon={CalendarRange} label="Par jour" value={metrics.dailyPacks} hint="Formules dont le supplément s'applique quotidiennement." tone="from-fuchsia-500 to-violet-500" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <form className="card overflow-hidden" onSubmit={handleSubmit}>
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">{editingPackId ? "Modifier le pack" : "Nouveau pack"}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {editingPackId ? "Ajustez cette offre puis enregistrez les changements." : "Créez une offre prête à être utilisée sur les réservations."}
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500">
                {editingPackId ? <PencilLine size={14} /> : <Plus size={14} />}
                {editingPackId ? "Mode edition" : "Creation rapide"}
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Nom du pack" icon={Sparkles}>
                <input className="input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ex: Pack Premium" />
              </Field>
              <Field label="Type de tarification" icon={BadgePercent}>
                <select className="input" value={form.pricingType} onChange={(event) => setForm({ ...form, pricingType: event.target.value })}>
                  <option value="FIXED">Montant fixe</option>
                  <option value="PERCENTAGE">Pourcentage</option>
                  <option value="DAILY">Supplement par jour</option>
                </select>
              </Field>
              <Field label="Valeur tarifaire" icon={CircleDollarSign}>
                <input type="number" className="input" value={form.pricingValue} onChange={(event) => setForm({ ...form, pricingValue: event.target.value })} />
              </Field>
              <Field label="Kilometrage inclus" icon={CalendarRange}>
                <input type="number" className="input" value={form.includedKm} onChange={(event) => setForm({ ...form, includedKm: event.target.value })} placeholder="Ex: 250" />
              </Field>
            </div>

            <Field label="Description" icon={Sparkles}>
              <textarea className="input min-h-28 resize-y" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Positionnement de l'offre, cible client et bénéfices." />
            </Field>

            <Field label="Conditions" icon={ShieldCheck}>
              <textarea className="input min-h-24 resize-y" value={form.conditions} onChange={(event) => setForm({ ...form, conditions: event.target.value })} placeholder="Conditions du pack, exclusions et remarques." />
            </Field>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["hasInsurance", "Assurance incluse"],
                ["includesDriver", "Chauffeur inclus"],
                ["includesDelivery", "Livraison incluse"],
                ["isActive", "Pack actif"]
              ].map(([key, label]) => (
                <label key={key} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <span className="text-sm font-medium text-slate-700">{label}</span>
                  <input
                    type="checkbox"
                    checked={form[key]}
                    onChange={(event) => setForm({ ...form, [key]: event.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-teal-600"
                  />
                </label>
              ))}
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 pt-5">
              <button className="btn-primary gap-2" disabled={submitting}>
                {editingPackId ? <PencilLine size={18} /> : <Plus size={18} />}
                {submitting ? "Enregistrement..." : editingPackId ? "Enregistrer les modifications" : "Ajouter le pack"}
              </button>
              {editingPackId ? (
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Annuler la modification
                </button>
              ) : null}
              {feedback ? <p className="text-sm font-medium text-slate-700">{feedback}</p> : null}
            </div>
          </div>
        </form>

        <section className="card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="text-2xl font-semibold text-slate-900">Catalogue actuel</h2>
            <p className="mt-1 text-sm text-slate-500">
              Vue d’ensemble des offres disponibles pour les agents et pour le tunnel de réservation.
            </p>
          </div>

          <div className="px-6 py-4 text-sm text-slate-500">
            {loading ? "Chargement des packs..." : `${packs.length} pack(s) affiché(s).`}
          </div>

          <DataTable
            columns={[
              {
                key: "name",
                label: "Pack",
                render: (row) => (
                  <div>
                    <p className="font-semibold text-slate-900">{row.name}</p>
                    <p className="text-sm text-slate-500">{row.description || "Description non renseignée"}</p>
                  </div>
                )
              },
              {
                key: "pricing",
                label: "Tarification",
                render: (row) => (
                  <div>
                    <p className="font-semibold text-slate-900">{formatPackValue(row)}</p>
                    <p className="text-sm text-slate-500">{row.pricingType}</p>
                  </div>
                )
              },
              {
                key: "benefits",
                label: "Avantages",
                render: (row) => (
                  <div className="space-y-1 text-sm text-slate-600">
                    <p>{row.includedKm ? `${row.includedKm} km inclus` : "Kilometrage non defini"}</p>
                    <p>{row.hasInsurance ? "Assurance incluse" : "Sans assurance"}</p>
                    <p>{row.includesDriver ? "Chauffeur inclus" : "Sans chauffeur"}</p>
                  </div>
                )
              },
              {
                key: "status",
                label: "Statut",
                render: (row) => (
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${row.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"}`}>
                    {row.isActive ? "Actif" : "Inactif"}
                  </span>
                )
              },
              {
                key: "actions",
                label: "Actions",
                render: (row) => (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-xl border border-sky-200 px-3 py-2 text-sm font-medium text-sky-700 transition hover:bg-sky-50"
                      onClick={() => startEditing(row)}
                    >
                      <PencilLine size={16} />
                      Modifier
                    </button>
                    <button
                      type="button"
                      className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition ${row.isActive ? "border-amber-200 text-amber-700 hover:bg-amber-50" : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"}`}
                      onClick={() => togglePack(row)}
                    >
                      <ShieldCheck size={16} />
                      {row.isActive ? "Desactiver" : "Activer"}
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                      onClick={() => removePack(row.id)}
                    >
                      <Trash2 size={16} />
                      Supprimer
                    </button>
                  </div>
                )
              }
            ]}
            rows={packs}
          />
        </section>
      </section>
    </div>
  );
}
