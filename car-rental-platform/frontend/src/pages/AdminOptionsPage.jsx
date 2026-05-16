import { useMemo, useState } from "react";
import {
  Baby,
  CarTaxiFront,
  CircleDollarSign,
  MapPinned,
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

function OptionMetricCard({ icon: Icon, label, value, hint, tone }) {
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

export default function AdminOptionsPage() {
  const { data: optionsData, setData, loading } = useFetch("/options", []);
  const options = Array.isArray(optionsData) ? optionsData : [];
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingOptionId, setEditingOptionId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    pricingType: "FIXED",
    price: 0,
    isActive: true
  });

  const metrics = useMemo(() => {
    const total = options.length;
    const active = options.filter((option) => option.isActive).length;
    const daily = options.filter((option) => option.pricingType === "DAILY").length;
    const fixed = options.filter((option) => option.pricingType === "FIXED").length;
    return { total, active, daily, fixed };
  }, [options]);

  function resetForm() {
    setEditingOptionId(null);
    setForm({
      name: "",
      description: "",
      pricingType: "FIXED",
      price: 0,
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
        price: Number(form.price)
      };

      if (editingOptionId) {
        const response = await api.put(`/options/${editingOptionId}`, payload);
        setData(options.map((item) => (item.id === editingOptionId ? response.data : item)));
        setFeedback("Option mise a jour avec succes.");
      } else {
        const response = await api.post("/options", payload);
        setData([response.data, ...options]);
        setFeedback("Option ajoutee avec succes.");
      }

      resetForm();
    } catch (error) {
      setFeedback(error.response?.data?.message || "Impossible d'enregistrer cette option.");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleOption(option) {
    const response = await api.put(`/options/${option.id}`, {
      name: option.name,
      description: option.description,
      pricingType: option.pricingType,
      price: Number(option.price),
      isActive: !option.isActive
    });
    setData(options.map((item) => (item.id === option.id ? response.data : item)));
  }

  async function removeOption(optionId) {
    await api.delete(`/options/${optionId}`);
    setData(options.filter((option) => option.id !== optionId));
  }

  function startEditing(option) {
    setEditingOptionId(option.id);
    setForm({
      name: option.name || "",
      description: option.description || "",
      pricingType: option.pricingType || "FIXED",
      price: Number(option.price || 0),
      isActive: Boolean(option.isActive)
    });
    setFeedback("");
  }

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <span className="inline-flex rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-500">
          Services additionnels
        </span>
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">Options supplementaires</h1>
          <p className="mt-2 max-w-3xl text-lg leading-relaxed text-slate-500">
            Gérez les suppléments proposés à la réservation: chauffeur, livraison, siège bébé, GPS ou autres services.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <OptionMetricCard icon={Sparkles} label="Options" value={metrics.total} hint="Nombre total de services additionnels configurés." tone="from-sky-500 to-cyan-500" />
        <OptionMetricCard icon={ShieldCheck} label="Actives" value={metrics.active} hint="Options visibles et activables sur une réservation." tone="from-emerald-500 to-teal-500" />
        <OptionMetricCard icon={CircleDollarSign} label="Fixes" value={metrics.fixed} hint="Options facturées une seule fois par réservation." tone="from-amber-500 to-orange-500" />
        <OptionMetricCard icon={MapPinned} label="Par jour" value={metrics.daily} hint="Services facturés quotidiennement pendant la location." tone="from-fuchsia-500 to-violet-500" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <form className="card overflow-hidden" onSubmit={handleSubmit}>
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">{editingOptionId ? "Modifier l'option" : "Nouvelle option"}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {editingOptionId ? "Ajustez cette option puis enregistrez les changements." : "Ajoutez un service additionnel avec sa règle de facturation."}
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500">
                {editingOptionId ? <PencilLine size={14} /> : <Plus size={14} />}
                {editingOptionId ? "Mode edition" : "Ajout rapide"}
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Nom de l'option" icon={Sparkles}>
                <input className="input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ex: GPS premium" />
              </Field>
              <Field label="Type de facturation" icon={CircleDollarSign}>
                <select className="input" value={form.pricingType} onChange={(event) => setForm({ ...form, pricingType: event.target.value })}>
                  <option value="FIXED">Montant fixe</option>
                  <option value="DAILY">Par jour</option>
                </select>
              </Field>
              <Field label="Prix" icon={CircleDollarSign}>
                <input type="number" className="input" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />
              </Field>
              <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="text-sm font-medium text-slate-700">Option active</span>
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) => setForm({ ...form, isActive: event.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-teal-600"
                />
              </label>
            </div>

            <Field label="Description" icon={Sparkles}>
              <textarea className="input min-h-28 resize-y" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Ex: navigation embarquee, siege enfant homologué, livraison aeroport..." />
            </Field>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <CarTaxiFront size={16} />
                  <span className="text-sm font-medium">Livraison</span>
                </div>
                <p className="mt-3 text-sm text-slate-500">Ideal pour les options de remise aeroport ou domicile.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <Baby size={16} />
                  <span className="text-sm font-medium">Famille</span>
                </div>
                <p className="mt-3 text-sm text-slate-500">Sieges bebe, rehausseurs et accessoires de confort.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <ShieldCheck size={16} />
                  <span className="text-sm font-medium">Protection</span>
                </div>
                <p className="mt-3 text-sm text-slate-500">Extensions d'assurance ou couvertures supplementaires.</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 pt-5">
              <button className="btn-primary gap-2" disabled={submitting}>
                {editingOptionId ? <PencilLine size={18} /> : <Plus size={18} />}
                {submitting ? "Enregistrement..." : editingOptionId ? "Enregistrer les modifications" : "Ajouter l'option"}
              </button>
              {editingOptionId ? (
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
            <h2 className="text-2xl font-semibold text-slate-900">Catalogue d’options</h2>
            <p className="mt-1 text-sm text-slate-500">
              Vue complète des suppléments proposés aux clients lors de la réservation.
            </p>
          </div>

          <div className="px-6 py-4 text-sm text-slate-500">
            {loading ? "Chargement des options..." : `${options.length} option(s) affichée(s).`}
          </div>

          <DataTable
            columns={[
              {
                key: "name",
                label: "Option",
                render: (row) => (
                  <div>
                    <p className="font-semibold text-slate-900">{row.name}</p>
                    <p className="text-sm text-slate-500">{row.description || "Description non renseignée"}</p>
                  </div>
                )
              },
              {
                key: "pricingType",
                label: "Facturation",
                render: (row) => (
                  <div>
                    <p className="font-semibold text-slate-900">{currency(row.price)}</p>
                    <p className="text-sm text-slate-500">{row.pricingType === "DAILY" ? "Par jour" : "Fixe"}</p>
                  </div>
                )
              },
              {
                key: "usage",
                label: "Usage",
                render: (row) => (
                  <div className="text-sm text-slate-600">
                    {row.pricingType === "DAILY" ? "S'applique sur chaque jour de location." : "Applique une seule fois sur le dossier."}
                  </div>
                )
              },
              {
                key: "status",
                label: "Statut",
                render: (row) => (
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${row.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"}`}>
                    {row.isActive ? "Active" : "Inactive"}
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
                      onClick={() => toggleOption(row)}
                    >
                      <ShieldCheck size={16} />
                      {row.isActive ? "Desactiver" : "Activer"}
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                      onClick={() => removeOption(row.id)}
                    >
                      <Trash2 size={16} />
                      Supprimer
                    </button>
                  </div>
                )
              }
            ]}
            rows={options}
          />
        </section>
      </section>
    </div>
  );
}
