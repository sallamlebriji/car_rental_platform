import { useState } from "react";
import api from "../api/client";
import { useFetch } from "../hooks/useFetch";

const numericFields = [
  {
    key: "minimumRentalDays",
    label: "Duree minimale",
    hint: "Nombre minimum de jours autorises pour une location.",
    suffix: "jour(s)"
  },
  {
    key: "maximumRentalDays",
    label: "Duree maximale",
    hint: "Nombre maximum de jours qu'un client peut reserver.",
    suffix: "jour(s)"
  },
  {
    key: "bookingFees",
    label: "Frais de reservation",
    hint: "Montant fixe ajoute a chaque reservation.",
    suffix: "MAD"
  },
  {
    key: "requiredAdvancePercent",
    label: "Avance obligatoire",
    hint: "Pourcentage du total demande en avance.",
    suffix: "%"
  },
  {
    key: "defaultDepositAmount",
    label: "Caution par defaut",
    hint: "Montant de caution propose par defaut pour les agences.",
    suffix: "MAD"
  }
];

export default function SuperAdminReservationSettingsPage() {
  const { data: reservation, setData } = useFetch("/settings/reservation", []);
  const [saved, setSaved] = useState(false);

  if (!reservation) return <div>Chargement...</div>;

  async function handleSave() {
    const response = await api.put("/settings/reservation", reservation);
    setData(response.data);
    setSaved(true);
  }

  return (
    <div className="space-y-8">
      <section className="card overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-5">
          <h1 className="text-3xl font-semibold text-slate-900">Parametres de reservation</h1>
          <p className="mt-2 max-w-3xl text-slate-500">
            Ces valeurs definissent les regles appliquees aux reservations client dans l'ensemble de l'application.
          </p>
        </div>

        <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-5">
          {numericFields.map((field) => (
            <div key={field.key} className="rounded-[1.6rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">{field.label}</p>
              <div className="mt-4 flex items-end justify-between gap-3">
                <span className="text-4xl font-semibold text-slate-900">{reservation[field.key] || 0}</span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {field.suffix}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-500">{field.hint}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="text-2xl font-semibold text-slate-900">Valeurs numeriques</h2>
            <p className="mt-1 text-sm text-slate-500">Chaque champ est maintenant nomme clairement avec son unite.</p>
          </div>

          <div className="grid gap-5 p-6 md:grid-cols-2">
            {numericFields.map((field) => (
              <label key={field.key} className={`space-y-2 ${field.key === "defaultDepositAmount" ? "md:col-span-2" : ""}`}>
                <span className="text-sm font-medium text-slate-700">{field.label}</span>
                <div className="relative">
                  <input
                    type="number"
                    className="input pr-20"
                    value={reservation[field.key] || ""}
                    onChange={(e) => setData({ ...reservation, [field.key]: Number(e.target.value) })}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                    {field.suffix}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{field.hint}</p>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-2xl font-semibold text-slate-900">Politiques et conditions</h2>
              <p className="mt-1 text-sm text-slate-500">Texte visible pour l'agence et pour le client selon le contexte.</p>
            </div>

            <div className="space-y-5 p-6">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Politique d'annulation</span>
                <textarea
                  className="input min-h-40"
                  rows="5"
                  value={reservation.cancellationPolicy || ""}
                  onChange={(e) => setData({ ...reservation, cancellationPolicy: e.target.value })}
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Conditions generales</span>
                <textarea
                  className="input min-h-40"
                  rows="5"
                  value={reservation.generalTerms || ""}
                  onChange={(e) => setData({ ...reservation, generalTerms: e.target.value })}
                />
              </label>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex flex-wrap items-center gap-3">
              <button className="btn-primary min-w-52" onClick={handleSave}>
                Enregistrer les parametres
              </button>
              {saved ? <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">Mis a jour.</span> : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
