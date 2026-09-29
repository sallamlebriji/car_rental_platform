import { Building2, CarFront, CircleDollarSign, Network, ReceiptText } from "lucide-react";
import DataTable from "../components/DataTable";
import Panel, { PageHeader } from "../components/ui/Panel";
import CountUp from "../components/ui/CountUp";
import EmptyState from "../components/ui/EmptyState";
import { Item, Stagger } from "../components/ui/Reveal";
import { DashboardKpi, HorizontalMetricBars, RevenueBars, StatusDonut } from "../components/DashboardWidgets";
import { useFetch } from "../hooks/useFetch";
import { compactCurrency } from "../utils/format";

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
    <Stagger className="space-y-6" stagger={0.1}>
      <Item>
        <PageHeader
          eyebrow="Vision reseau"
          title="Super admin"
          description="Vue globale du reseau d'agences, du volume de reservations et de la performance commerciale consolidee."
        />
      </Item>

      <Item className="grid gap-6 xl:grid-cols-12">
        <section className="card-primary xl:col-span-8">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full anim-breathe" style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--primary-color) 35%, transparent), transparent 70%)" }} />
          <div className="relative p-6 md:p-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-sm text-slate-400">Revenu consolide</p>
                <h2 className="mt-2 font-display text-5xl font-semibold tracking-tight text-white md:text-6xl">
                  <CountUp value={stats?.estimatedRevenue || 0} format={(n) => compactCurrency(n)} />
                </h2>
                <p className="mt-3 text-sm text-slate-400">Vision consolidee de toutes les agences.</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white">
                <CircleDollarSign size={20} />
              </div>
            </div>
            <div className="mt-8 rounded-2xl bg-white p-5 text-slate-900">
              <p className="mb-4 text-sm font-semibold">Evolution du revenu global</p>
              {revenueBars.length ? (
                <RevenueBars values={revenueBars} height="h-48" />
              ) : (
                <EmptyState compact title="Pas encore de revenu" description="Le graphe apparaitra des les premieres reservations." />
              )}
            </div>
          </div>
        </section>

        <div className="grid content-start gap-4 sm:grid-cols-2 xl:col-span-4 xl:grid-cols-1">
          <DashboardKpi icon={Building2} label="Agences" value={overview?.totalAgencies || 0} tone="from-sky-500 to-cyan-500" progress={100} hint="Nombre total d'entites creees." />
          <DashboardKpi icon={Network} label="Agences actives" value={overview?.activeAgencies || 0} tone="from-emerald-500 to-teal-500" progress={activeRatio} hint="Part des agences actuellement exploitables." />
          <DashboardKpi icon={CarFront} label="Voitures total" value={stats?.totalCars || 0} tone="from-amber-500 to-orange-500" progress={70} hint="Parc cumule sur l'ensemble du reseau." />
          <DashboardKpi icon={ReceiptText} label="Reservations total" value={stats?.totalReservations || 0} tone="from-fuchsia-500 to-violet-500" progress={80} hint="Volume consolide des demandes." />
        </div>
      </Item>

      <Item className="grid gap-6 xl:grid-cols-12">
        <Panel className="xl:col-span-4" title="Statuts de reservation" description="Distribution de tous les statuts du reseau.">
          <StatusDonut items={donutItems} centerLabel="Reseau" />
        </Panel>
        <Panel className="xl:col-span-8" title="Reservations par agence" description="Vue comparative de l'activite du reseau.">
          {agencyBars.length ? <HorizontalMetricBars items={agencyBars} /> : <EmptyState compact title="Aucune agence" />}
        </Panel>
      </Item>

      <Item>
        <Panel title="Agences detaillees" description="Comparatif des volumes, de la flotte et des utilisateurs par agence." padded={false}>
          <DataTable
            bare
            columns={[
              { key: "name", label: "Agence", render: (row) => <span className="font-medium text-slate-900">{row.name}</span> },
              { key: "city", label: "Ville" },
              { key: "users", label: "Utilisateurs", render: (row) => row._count?.users || 0 },
              { key: "cars", label: "Voitures", render: (row) => row._count?.cars || 0 },
              { key: "reservations", label: "Reservations", render: (row) => row._count?.reservations || 0 }
            ]}
            rows={agencies}
          />
        </Panel>
      </Item>
    </Stagger>
  );
}
