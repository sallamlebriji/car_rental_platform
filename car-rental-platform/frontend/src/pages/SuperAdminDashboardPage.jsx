import { Building2, CarFront, CircleDollarSign, Network, RadioTower, ReceiptText } from "lucide-react";
import DataTable from "../components/DataTable";
import { DashboardKpi, HorizontalMetricBars, RevenueBars, StatusDonut } from "../components/DashboardWidgets";
import { useFetch } from "../hooks/useFetch";
import { compactCurrency, currency } from "../utils/format";

export default function SuperAdminDashboardPage() {
  const { data: stats } = useFetch("/dashboard/stats", []);
  const { data: overview } = useFetch("/dashboard/super-admin-overview", []);
  const { data: revenueRowsData } = useFetch("/dashboard/revenue", []);
  const { data: reservationRowsData } = useFetch("/dashboard/reservations-chart", []);

  const agencies = Array.isArray(overview?.agencies) ? overview.agencies : [];
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

  const agencyBars = agencies.map((agency) => ({
    label: agency.name,
    value: agency._count?.reservations || 0,
    subLabel: `${agency._count?.cars || 0} voitures`
  }));

  const donutItems = [
    { label: "En attente", value: statusSummary.PENDING || 0, color: "#f59e0b" },
    { label: "Confirmees", value: statusSummary.CONFIRMED || 0, color: "#10b981" },
    { label: "Annulees", value: statusSummary.CANCELLED || 0, color: "#94a3b8" },
    { label: "Terminees", value: statusSummary.COMPLETED || 0, color: "#3b82f6" }
  ];

  const activeRatio = Math.round(((overview?.activeAgencies || 0) / Math.max(overview?.totalAgencies || 1, 1)) * 100);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2.4rem] bg-slate-950 px-7 py-8 text-white shadow-soft lg:px-8 lg:py-9">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.22),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.12),transparent_28%)]" />
        <div className="relative space-y-8">
          <div className="space-y-6">
            <span className="inline-flex rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-300">
              Vision reseau
            </span>
            <div>
              <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">Super admin</h1>
              <p className="mt-5 max-w-4xl text-lg leading-relaxed text-slate-200 md:text-[1.05rem]">
                Vue globale du reseau d'agences, du volume de reservations et de la performance commerciale consolidee.
              </p>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-[2rem] bg-white/5 px-7 py-7 backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[15px] font-medium text-slate-300">Reseau actif</p>
                  <h2 className="mt-5 text-5xl font-semibold tracking-tight">{overview?.activeAgencies || 0}</h2>
                  <p className="mt-5 text-lg text-slate-400">Agences actives sur {overview?.totalAgencies || 0}.</p>
                </div>
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.6rem] bg-white/10">
                  <RadioTower size={30} />
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white/5 px-7 py-7 backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[15px] font-medium text-slate-300">Revenu consolide</p>
                  <h2 className="mt-5 break-words text-4xl font-semibold leading-tight md:text-5xl">
                    {compactCurrency(stats?.estimatedRevenue || 0)}
                  </h2>
                  <p className="mt-5 text-lg text-slate-400">Vision consolidee de toutes les agences.</p>
                </div>
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.6rem] bg-white/10">
                  <CircleDollarSign size={30} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardKpi icon={Building2} label="Agences" value={overview?.totalAgencies || 0} tone="from-sky-500 to-cyan-500" progress={100} hint="Nombre total d'entites creees." />
        <DashboardKpi icon={Network} label="Agences actives" value={overview?.activeAgencies || 0} tone="from-emerald-500 to-teal-500" progress={activeRatio} hint="Part des agences actuellement exploitables." />
        <DashboardKpi icon={CarFront} label="Voitures total" value={stats?.totalCars || 0} tone="from-amber-500 to-orange-500" progress={70} hint="Parc cumule sur l'ensemble du reseau." />
        <DashboardKpi icon={ReceiptText} label="Reservations total" value={stats?.totalReservations || 0} tone="from-fuchsia-500 to-violet-500" progress={80} hint="Volume consolide des demandes." />
      </section>

      <section className="grid gap-6 2xl:grid-cols-[1.15fr_0.85fr]">
        <div className="card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="text-2xl font-semibold text-slate-900">Evolution du revenu global</h2>
            <p className="mt-1 text-sm text-slate-500">Lecture des revenus sur les dernieres periodes.</p>
          </div>
          <div className="p-6">
            {revenueBars.length ? <RevenueBars values={revenueBars} /> : <div className="flex h-72 items-center justify-center rounded-[1.6rem] bg-slate-50 text-slate-500">Pas encore assez de donnees pour afficher un graphe.</div>}
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="text-2xl font-semibold text-slate-900">Statuts de reservation</h2>
            <p className="mt-1 text-sm text-slate-500">Distribution de tous les statuts du reseau.</p>
          </div>
          <div className="p-6">
            <StatusDonut items={donutItems} centerLabel="Reseau" />
          </div>
        </div>
      </section>

      <section className="grid gap-6 2xl:grid-cols-[0.8fr_1.2fr]">
        <div className="card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="text-2xl font-semibold text-slate-900">Reservations par agence</h2>
            <p className="mt-1 text-sm text-slate-500">Vue comparative de l'activite du reseau.</p>
          </div>
          <div className="p-6">
            <HorizontalMetricBars items={agencyBars} />
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="text-2xl font-semibold text-slate-900">Agences detaillees</h2>
            <p className="mt-1 text-sm text-slate-500">Comparatif des volumes, de la flotte et des utilisateurs par agence.</p>
          </div>
          <DataTable
            columns={[
              { key: "name", label: "Agence" },
              { key: "city", label: "Ville" },
              { key: "users", label: "Utilisateurs", render: (row) => row._count?.users || 0 },
              { key: "cars", label: "Voitures", render: (row) => row._count?.cars || 0 },
              { key: "reservations", label: "Reservations", render: (row) => row._count?.reservations || 0 }
            ]}
            rows={agencies}
          />
        </div>
      </section>
    </div>
  );
}
