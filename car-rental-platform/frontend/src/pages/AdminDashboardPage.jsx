import { BadgeDollarSign, CarFront, CircleDollarSign, Clock3, ReceiptText, RadioTower } from "lucide-react";
import DataTable from "../components/DataTable";
import { DashboardKpi, RevenueBars, StatusDonut } from "../components/DashboardWidgets";
import { useFetch } from "../hooks/useFetch";
import { compactCurrency, currency } from "../utils/format";

export default function AdminDashboardPage() {
  const { data: stats } = useFetch("/dashboard/stats", []);
  const { data: topCarsData } = useFetch("/dashboard/top-cars", []);
  const { data: revenueRowsData } = useFetch("/dashboard/revenue", []);
  const { data: reservationRowsData } = useFetch("/dashboard/reservations-chart", []);

  const topCars = Array.isArray(topCarsData) ? topCarsData : [];
  const revenueRows = Array.isArray(revenueRowsData) ? revenueRowsData : [];
  const reservationRows = Array.isArray(reservationRowsData) ? reservationRowsData : [];

  const revenueBars = (() => {
    const grouped = revenueRows.reduce((acc, row) => {
      const date = new Date(row.createdAt);
      const key = `${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear().toString().slice(-2)}`;
      acc[key] = (acc[key] || 0) + Number(row.totalPrice || 0);
      return acc;
    }, {});

    return Object.entries(grouped).slice(-6).map(([label, total]) => ({ label, total }));
  })();

  const statusSummary = reservationRows.reduce((acc, row) => {
    acc[row.status] = (acc[row.status] || 0) + 1;
    return acc;
  }, {});

  const totalReservations = stats?.totalReservations || 0;
  const availableRatio = totalReservations > 0 ? Math.round(((stats?.availableCars || 0) / Math.max(stats?.totalCars || 1, 1)) * 100) : 35;

  const donutItems = [
    { label: "En attente", value: statusSummary.PENDING || 0, color: "#f59e0b" },
    { label: "Confirmees", value: statusSummary.CONFIRMED || 0, color: "#10b981" },
    { label: "Annulees", value: statusSummary.CANCELLED || 0, color: "#94a3b8" },
    { label: "Terminees", value: statusSummary.COMPLETED || 0, color: "#3b82f6" }
  ];

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[3rem] bg-slate-950 px-7 py-8 text-white shadow-soft lg:px-12 lg:py-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.22),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.18),transparent_30%)]" />
        <div className="relative space-y-10">
          <div className="space-y-6">
            <span className="inline-flex rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-300">
              Performance agence
            </span>
            <div className="max-w-4xl">
              <h1 className="text-[3.4rem] font-semibold tracking-tight md:text-[4.7rem] md:leading-[0.95]">
                Tableau de bord
              </h1>
              <p className="mt-5 max-w-5xl text-lg leading-relaxed text-slate-300 md:text-[1.1rem] md:leading-[1.65]">
                Suivi des reservations, analyse du revenu et lecture immediate des indicateurs critiques de l'agence.
              </p>
            </div>
          </div>
          <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr] lg:items-end">
            <div className="rounded-[2.5rem] bg-white/[0.03] p-8 backdrop-blur-sm">
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <p className="text-[1.05rem] text-slate-300">CA estime</p>
                  <h2 className="mt-6 max-w-[8ch] whitespace-pre-line text-[4.25rem] font-semibold leading-[0.95] tracking-tight text-white">
                    {compactCurrency(stats?.estimatedRevenue || 0).replace(" MAD", "\nMAD")}
                  </h2>
                  <p className="mt-8 max-w-xs text-[1.05rem] leading-relaxed text-slate-400">
                    Total cumule des reservations.
                  </p>
                </div>
                <div className="mt-2 flex h-[6.6rem] w-[6.6rem] shrink-0 items-center justify-center rounded-[2rem] bg-white/10 text-slate-100">
                  <BadgeDollarSign size={40} strokeWidth={2} />
                </div>
              </div>
            </div>
            <div className="rounded-[2.5rem] bg-cyan-950/55 p-8 backdrop-blur-sm">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-[1.05rem] text-slate-300">Voitures actives</p>
                  <h2 className="mt-6 text-[4.25rem] font-semibold leading-[0.95] tracking-tight text-white">
                    {stats?.totalCars || 0}
                  </h2>
                  <p className="mt-8 max-w-xs text-[1.05rem] leading-relaxed text-slate-400">
                    Flotte actuellement suivie.
                  </p>
                </div>
                <div className="mt-2 flex h-[6.6rem] w-[6.6rem] shrink-0 items-center justify-center rounded-[2rem] bg-white/10 text-slate-100">
                  <RadioTower size={40} strokeWidth={2} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <DashboardKpi icon={ReceiptText} label="Reservations" value={stats?.totalReservations || 0} tone="from-sky-500 to-cyan-500" progress={70} hint="Volume global des demandes." />
        <DashboardKpi
          icon={Clock3}
          label="En attente"
          value={stats?.pendingReservations || 0}
          tone="from-amber-500 to-orange-500"
          progress={Math.min(((stats?.pendingReservations || 0) / Math.max(totalReservations, 1)) * 100, 100)}
          hint="Dossiers a traiter rapidement."
        />
        <DashboardKpi
          icon={CarFront}
          label="Voitures disponibles"
          value={stats?.availableCars || 0}
          tone="from-emerald-500 to-teal-500"
          progress={availableRatio}
          hint="Part de la flotte actuellement libre."
        />
        <DashboardKpi
          icon={CircleDollarSign}
          label="CA estime"
          value={compactCurrency(stats?.estimatedRevenue || 0)}
          tone="from-fuchsia-500 to-violet-500"
          progress={85}
          hint="Montant calcule a partir des reservations."
        />
      </section>

      <section className="grid gap-6 2xl:grid-cols-[1.2fr_0.8fr]">
        <div className="card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="text-2xl font-semibold text-slate-900">Evolution du revenu</h2>
            <p className="mt-1 text-sm text-slate-500">Vue synthetique des revenus accumules par periode.</p>
          </div>
          <div className="p-6">
            {revenueBars.length ? <RevenueBars values={revenueBars} /> : <div className="flex h-72 items-center justify-center rounded-[1.6rem] bg-slate-50 text-slate-500">Pas encore assez de donnees pour afficher un graphe.</div>}
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="text-2xl font-semibold text-slate-900">Statuts de reservation</h2>
            <p className="mt-1 text-sm text-slate-500">Repartition immediate des reservations par etat.</p>
          </div>
          <div className="p-6">
            <StatusDonut items={donutItems} centerLabel="Reservations" />
          </div>
        </div>
      </section>

      <section className="card overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-2xl font-semibold text-slate-900">Top voitures</h2>
          <p className="mt-1 text-sm text-slate-500">Vehicules les plus reserves, utiles pour la planification de flotte.</p>
        </div>
        <DataTable
          columns={[
            { key: "brand", label: "Voiture", render: (row) => `${row.car?.brand} ${row.car?.model}` },
            { key: "plate", label: "Matricule", render: (row) => row.car?.plateNumber },
            {
              key: "reservations",
              label: "Reservations",
              render: (row) => (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-900">{row.reservations}</span>
                  <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500" style={{ width: `${Math.min((row.reservations / Math.max(topCars[0]?.reservations || 1, 1)) * 100, 100)}%` }} />
                  </div>
                </div>
              )
            }
          ]}
          rows={topCars}
        />
      </section>
    </div>
  );
}
