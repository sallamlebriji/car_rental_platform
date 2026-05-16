import { useMemo, useState } from "react";
import {
  FileCheck2,
  FileDown,
  FileText,
  Search,
  ShieldCheck
} from "lucide-react";
import api from "../api/client";
import DataTable from "../components/DataTable";
import { useFetch } from "../hooks/useFetch";
import { date } from "../utils/format";

function ContractMetricCard({ icon: Icon, label, value, hint, tone }) {
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

export default function AdminContractsPage() {
  const { data: reservationsData, setData, loading } = useFetch("/reservations", []);
  const reservations = Array.isArray(reservationsData) ? reservationsData : [];
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const filteredReservations = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return reservations;

    return reservations.filter((row) => {
      const haystack = [
        row.reference,
        row.client?.user?.firstName,
        row.client?.user?.lastName,
        row.car?.brand,
        row.car?.model,
        row.contract?.contractNumber
      ].join(" ").toLowerCase();
      return haystack.includes(query);
    });
  }, [reservations, search]);

  const metrics = useMemo(() => {
    const total = reservations.length;
    const generated = reservations.filter((row) => row.contract).length;
    const pending = total - generated;
    const signedReady = reservations.filter((row) => row.status === "CONFIRMED").length;
    return { total, generated, pending, signedReady };
  }, [reservations]);

  async function generate(reservationId) {
    await api.post(`/contracts/generate/${reservationId}`);
    const refreshed = await api.get("/reservations");
    setData(refreshed.data);
    setMessage("Contrat genere avec succes.");
  }

  async function download(contractId, reference) {
    const response = await api.get(`/contracts/${contractId}/download`, { responseType: "blob" });
    const fileUrl = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = `${reference}-contrat.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(fileUrl);
  }

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <span className="inline-flex rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-500">
          Documents contractuels
        </span>
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">Contrats</h1>
          <p className="mt-2 max-w-3xl text-lg leading-relaxed text-slate-500">
            Générez, vérifiez et téléchargez les contrats PDF liés aux réservations de l’agence.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ContractMetricCard icon={FileText} label="Reservations" value={metrics.total} hint="Dossiers pouvant donner lieu à un contrat." tone="from-sky-500 to-cyan-500" />
        <ContractMetricCard icon={FileCheck2} label="Generes" value={metrics.generated} hint="Contrats déjà disponibles en PDF." tone="from-emerald-500 to-teal-500" />
        <ContractMetricCard icon={ShieldCheck} label="A produire" value={metrics.pending} hint="Réservations encore sans contrat généré." tone="from-amber-500 to-orange-500" />
        <ContractMetricCard icon={FileDown} label="Confirmées" value={metrics.signedReady} hint="Dossiers confirmés prêts pour contractualisation." tone="from-fuchsia-500 to-violet-500" />
      </section>

      <section className="card overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Registre des contrats</h2>
              <p className="mt-1 text-sm text-slate-500">
                Recherchez par référence, client, véhicule ou numéro de contrat.
              </p>
            </div>

            <label className="relative xl:min-w-[22rem]">
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="input pl-11" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Ex: RES-0001, Sara, Dacia, CTR-..." />
            </label>
          </div>
        </div>

        {message ? <div className="px-6 py-4 text-sm font-medium text-emerald-700">{message}</div> : null}
        <div className="px-6 py-4 text-sm text-slate-500">
          {loading ? "Chargement des contrats..." : `${filteredReservations.length} dossier(s) affiché(s).`}
        </div>

        <DataTable
          columns={[
            {
              key: "reference",
              label: "Reservation",
              render: (row) => (
                <div>
                  <p className="font-semibold text-slate-900">{row.reference}</p>
                  <p className="text-sm text-slate-500">{date(row.createdAt)}</p>
                </div>
              )
            },
            {
              key: "client",
              label: "Client",
              render: (row) => (
                <div>
                  <p className="font-semibold text-slate-900">{row.client?.user?.firstName} {row.client?.user?.lastName}</p>
                  <p className="text-sm text-slate-500">{row.car?.brand} {row.car?.model}</p>
                </div>
              )
            },
            {
              key: "contract",
              label: "Contrat",
              render: (row) => (
                <div>
                  <p className="font-semibold text-slate-900">{row.contract?.contractNumber || "Non genere"}</p>
                  <p className="text-sm text-slate-500">{row.contract ? "Pret au telechargement" : "Generation requise"}</p>
                </div>
              )
            },
            {
              key: "actions",
              label: "Actions",
              render: (row) => (
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="btn-primary !px-3 !py-2" onClick={() => generate(row.id)}>
                    Generer PDF
                  </button>
                  {row.contract ? (
                    <button type="button" className="btn-secondary !px-3 !py-2" onClick={() => download(row.contract.id, row.reference)}>
                      Telecharger
                    </button>
                  ) : null}
                </div>
              )
            }
          ]}
          rows={filteredReservations}
        />
      </section>
    </div>
  );
}
