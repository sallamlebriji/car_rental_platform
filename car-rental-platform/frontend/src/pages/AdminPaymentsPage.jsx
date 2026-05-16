import { useMemo, useState } from "react";
import {
  BadgeDollarSign,
  CircleDollarSign,
  CreditCard,
  Search,
  Wallet
} from "lucide-react";
import DataTable from "../components/DataTable";
import { useFetch } from "../hooks/useFetch";
import { currency, date } from "../utils/format";

function PaymentMetricCard({ icon: Icon, label, value, hint, tone }) {
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

function paymentTone(status) {
  if (status === "PAID") return "bg-emerald-100 text-emerald-700";
  if (status === "PARTIALLY_PAID") return "bg-amber-100 text-amber-700";
  if (status === "REFUNDED") return "bg-sky-100 text-sky-700";
  return "bg-slate-200 text-slate-700";
}

export default function AdminPaymentsPage() {
  const { data: reservationsData, loading } = useFetch("/reservations", []);
  const reservations = Array.isArray(reservationsData) ? reservationsData : [];
  const [search, setSearch] = useState("");

  const rows = useMemo(
    () => reservations.flatMap((reservation) => (reservation.payments || []).map((payment) => ({ ...payment, reservation }))),
    [reservations]
  );

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;

    return rows.filter((row) => {
      const haystack = [
        row.reservation?.reference,
        row.reservation?.client?.user?.firstName,
        row.reservation?.client?.user?.lastName,
        row.method,
        row.status
      ].join(" ").toLowerCase();
      return haystack.includes(query);
    });
  }, [rows, search]);

  const metrics = useMemo(() => {
    const total = rows.reduce((sum, row) => sum + Number(row.amountTotal || 0), 0);
    const paid = rows.reduce((sum, row) => sum + Number(row.amountPaid || 0), 0);
    const remaining = rows.reduce((sum, row) => sum + Number(row.remaining || 0), 0);
    const paidCount = rows.filter((row) => row.status === "PAID").length;
    return { total, paid, remaining, paidCount };
  }, [rows]);

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <span className="inline-flex rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-500">
          Suivi financier
        </span>
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">Paiements</h1>
          <p className="mt-2 max-w-3xl text-lg leading-relaxed text-slate-500">
            Suivez les avances, les soldes restants et l’état des paiements sur toutes les réservations de l’agence.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <PaymentMetricCard icon={CircleDollarSign} label="Montant total" value={currency(metrics.total)} hint="Somme cumulée de tous les dossiers chargés." tone="from-sky-500 to-cyan-500" />
        <PaymentMetricCard icon={Wallet} label="Déjà payé" value={currency(metrics.paid)} hint="Montant réellement encaissé à date." tone="from-emerald-500 to-teal-500" />
        <PaymentMetricCard icon={BadgeDollarSign} label="Reste à payer" value={currency(metrics.remaining)} hint="Solde restant sur les réservations non totalement réglées." tone="from-amber-500 to-orange-500" />
        <PaymentMetricCard icon={CreditCard} label="Dossiers soldés" value={metrics.paidCount} hint="Paiements dont le statut est marqué payé." tone="from-fuchsia-500 to-violet-500" />
      </section>

      <section className="card overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Journal des paiements</h2>
              <p className="mt-1 text-sm text-slate-500">
                Recherche par référence, client, méthode de paiement ou statut.
              </p>
            </div>

            <label className="relative xl:min-w-[22rem]">
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="input pl-11" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Ex: RES-0001, Sara, CASH, PAID" />
            </label>
          </div>
        </div>

        <div className="px-6 py-4 text-sm text-slate-500">
          {loading ? "Chargement des paiements..." : `${filteredRows.length} paiement(s) affiché(s).`}
        </div>

        <DataTable
          columns={[
            {
              key: "reservation",
              label: "Reservation",
              render: (row) => (
                <div>
                  <p className="font-semibold text-slate-900">{row.reservation?.reference}</p>
                  <p className="text-sm text-slate-500">{date(row.reservation?.createdAt)}</p>
                </div>
              )
            },
            {
              key: "client",
              label: "Client",
              render: (row) => (
                <div>
                  <p className="font-semibold text-slate-900">{row.reservation?.client?.user?.firstName} {row.reservation?.client?.user?.lastName}</p>
                  <p className="text-sm text-slate-500">{row.reservation?.client?.user?.phone || row.reservation?.client?.user?.email}</p>
                </div>
              )
            },
            {
              key: "amounts",
              label: "Montants",
              render: (row) => (
                <div>
                  <p className="font-semibold text-slate-900">Total {currency(row.amountTotal)}</p>
                  <p className="text-sm text-slate-500">Paye {currency(row.amountPaid)} - Reste {currency(row.remaining)}</p>
                </div>
              )
            },
            {
              key: "method",
              label: "Reglement",
              render: (row) => (
                <div>
                  <p className="font-semibold text-slate-900">{row.method}</p>
                  <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${paymentTone(row.status)}`}>
                    {row.status}
                  </span>
                </div>
              )
            }
          ]}
          rows={filteredRows}
        />
      </section>
    </div>
  );
}
