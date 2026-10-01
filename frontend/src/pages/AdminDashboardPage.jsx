import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, CalendarClock, CarFront, CircleDollarSign, ReceiptText, Wallet, Wrench } from "lucide-react";
import DataTable from "../components/DataTable";
import { RevenueBars, StatusDonut } from "../components/DashboardWidgets";
import StatusBadge from "../components/StatusBadge";
import { PersonCell } from "../components/Avatar";
import Panel, { PageHeader } from "../components/ui/Panel";
import CountUp from "../components/ui/CountUp";
import EmptyState from "../components/ui/EmptyState";
import { Item, Stagger } from "../components/ui/Reveal";
import { SkeletonBlock, SkeletonRows } from "../components/ui/Skeleton";
import { useFetch } from "../hooks/useFetch";
import { compactCurrency, currency, date } from "../utils/format";
import { DURATION, EASE } from "../motion";

function MiniStat({ icon: Icon, label, value, format, hint }) {
  return (
    <div className="rounded-2xl bg-white/[0.05] p-4 ring-1 ring-inset ring-white/[0.07]">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon size={14} />
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-2 font-display text-2xl font-semibold tracking-tight text-white">
        <CountUp value={value} format={format} />
      </p>
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
}

function OccupancyRing({ rate }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const safe = Math.min(Math.max(rate, 0), 1);

  return (
    <div className="relative mx-auto h-44 w-44">
      <svg viewBox="0 0 128 128" className="h-44 w-44 -rotate-90">
        <circle cx="64" cy="64" r={radius} fill="none" stroke="var(--surface-sunken)" strokeWidth="10" />
        <motion.circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          stroke="var(--primary-color)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: circumference * (1 - safe) }}
          viewport={{ once: true }}
          transition={{ duration: DURATION.counter, ease: EASE }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl font-semibold tracking-tight text-slate-900">
          <CountUp value={Math.round(safe * 100)} format={(n) => `${Math.round(n)}%`} />
        </span>
        <span className="eyebrow mt-1 !tracking-[0.12em]">Occupation</span>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data: stats, loading: statsLoading } = useFetch("/dashboard/stats", []);
  const { data: topCarsData, loading: topLoading } = useFetch("/dashboard/top-cars", []);
  const { data: revenueRowsData } = useFetch("/dashboard/revenue", []);
  const { data: reservationRowsData } = useFetch("/dashboard/reservations-chart", []);
  const { data: reservationsData, loading: reservationsLoading } = useFetch("/reservations", []);
  const { data: carsData } = useFetch("/cars", []);

  const topCars = Array.isArray(topCarsData) ? topCarsData : [];
  const revenueRows = Array.isArray(revenueRowsData) ? revenueRowsData : [];
  const reservationRows = Array.isArray(reservationRowsData) ? reservationRowsData : [];
  const reservations = Array.isArray(reservationsData) ? reservationsData : [];
  const cars = Array.isArray(carsData) ? carsData : [];

  const revenueBars = useMemo(() => {
    const grouped = revenueRows.reduce((acc, row) => {
      const d = new Date(row.createdAt);
      const key = `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear().toString().slice(-2)}`;
      acc[key] = (acc[key] || 0) + Number(row.totalPrice || 0);
      return acc;
    }, {});

    return Object.entries(grouped).slice(-6).map(([label, total]) => ({ label, total }));
  }, [revenueRows]);

  const statusSummary = reservationRows.reduce((acc, row) => {
    acc[row.status] = (acc[row.status] || 0) + 1;
    return acc;
  }, {});

  const donutItems = [
    { label: "En attente", value: statusSummary.PENDING || 0, color: "#f59e0b" },
    { label: "Confirmees", value: statusSummary.CONFIRMED || 0, color: "#10b981" },
    { label: "Annulees", value: statusSummary.CANCELLED || 0, color: "#94a3b8" },
    { label: "Terminees", value: statusSummary.COMPLETED || 0, color: "#3b82f6" }
  ];

  const totalCars = stats?.totalCars || 0;
  const occupancy = totalCars ? (stats?.rentedCars || 0) / totalCars : 0;

  const upcoming = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return reservations
      .filter((row) => ["PENDING", "CONFIRMED"].includes(row.status) && new Date(row.startDate) >= today)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      .slice(0, 5);
  }, [reservations]);

  const pendingPayments = useMemo(() => {
    const rows = reservations
      .flatMap((reservation) => (reservation.payments || []).map((payment) => ({ ...payment, reservation })))
      .filter((payment) => payment.status !== "PAID" && Number(payment.remaining || 0) > 0)
      .sort((a, b) => Number(b.remaining) - Number(a.remaining));
    return { rows: rows.slice(0, 3), total: rows.reduce((sum, row) => sum + Number(row.remaining || 0), 0), count: rows.length };
  }, [reservations]);

  const carsToCheck = cars.filter((car) => car.status === "MAINTENANCE");
  const clientName = (row) => `${row.client?.user?.firstName || ""} ${row.client?.user?.lastName || ""}`.trim() || "Client";

  return (
    <Stagger className="space-y-6" stagger={0.1}>
      <Item>
        <PageHeader
          eyebrow={new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
          title="Tableau de bord"
          description="Activite, encaissements et prochaines locations de votre agence, en un coup d'oeil."
          actions={
            <>
              <Link to="/admin/reservations" className="btn-secondary">Reservations</Link>
              <Link to="/admin/cars" className="btn-primary">Voir la flotte</Link>
            </>
          }
        />
      </Item>

      {/* Row 1: revenue (primary) + occupancy */}
      <Item className="grid gap-6 xl:grid-cols-12">
        <section className="card-primary xl:col-span-8">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full anim-breathe" style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--primary-color) 35%, transparent), transparent 70%)" }} />
          <div className="relative p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <p className="text-sm text-slate-400">Chiffre d'affaires estime</p>
                {statsLoading ? (
                  <div className="skeleton mt-3 h-12 w-56 !bg-white/10" />
                ) : (
                  <h2 className="mt-2 font-display text-5xl font-semibold tracking-tight text-white md:text-6xl">
                    <CountUp value={stats?.estimatedRevenue || 0} format={(n) => compactCurrency(n)} />
                  </h2>
                )}
                <p className="mt-3 text-sm text-slate-400">Cumul de toutes les reservations de l'agence.</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white">
                <CircleDollarSign size={20} />
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <MiniStat icon={ReceiptText} label="Reservations" value={stats?.totalReservations || 0} />
              <MiniStat icon={CalendarClock} label="En attente" value={stats?.pendingReservations || 0} hint="A traiter" />
              <MiniStat icon={CarFront} label="Voitures dispo" value={stats?.availableCars || 0} hint={`sur ${totalCars}`} />
            </div>

            <div className="mt-8 rounded-2xl bg-white p-5 text-slate-900">
              <p className="mb-4 text-sm font-semibold">Evolution du revenu</p>
              {revenueBars.length ? (
                <RevenueBars values={revenueBars} height="h-48" />
              ) : (
                <EmptyState compact title="Pas encore de revenu" description="Le graphe apparaitra des les premieres reservations." />
              )}
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:col-span-4">
          <Panel title="Occupation de la flotte" description="Voitures actuellement louees.">
            <OccupancyRing rate={occupancy} />
            <div className="mt-6 grid grid-cols-3 gap-2 text-center">
              {[
                ["Louees", stats?.rentedCars || 0, "var(--primary-color)"],
                ["Dispo", stats?.availableCars || 0, "#10b981"],
                ["Total", totalCars, "#94a3b8"]
              ].map(([label, value, color]) => (
                <div key={label} className="card-info px-2 py-3">
                  <p className="font-display text-xl font-semibold tabular-nums text-slate-900">{value}</p>
                  <p className="mt-0.5 flex items-center justify-center gap-1.5 text-[0.7rem] text-slate-500">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </Item>

      {/* Row 2: upcoming rentals + what needs attention */}
      <Item className="grid gap-6 xl:grid-cols-12">
        <Panel
          className="xl:col-span-7"
          title="Prochaines locations"
          description="Les 5 prochains departs confirmes ou en attente."
          action={<Link to="/admin/reservations" className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline">Tout voir <ArrowUpRight size={14} /></Link>}
          padded={false}
        >
          {reservationsLoading && !upcoming.length ? (
            <SkeletonRows rows={4} columns={3} />
          ) : upcoming.length ? (
            <div className="divide-y" style={{ borderColor: "var(--line-color)" }}>
              {upcoming.map((row) => (
                <Link
                  key={row.id}
                  to={`/admin/reservations/${row.id}`}
                  className="flex flex-wrap items-center gap-4 px-6 py-3.5 transition-colors duration-calm ease-calm hover:bg-slate-50"
                >
                  <div className="min-w-0 flex-1">
                    <PersonCell name={clientName(row)} subtitle={`${row.car?.brand || ""} ${row.car?.model || ""}`.trim()} />
                  </div>
                  <div className="hidden text-right text-sm sm:block">
                    <p className="font-medium text-slate-900">{date(row.startDate)}</p>
                    <p className="text-xs text-slate-500">{row.totalDays} j · {currency(row.totalPrice)}</p>
                  </div>
                  <StatusBadge status={row.status} />
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              compact
              title="Aucun depart a venir"
              description="Les prochaines reservations confirmees ou en attente apparaitront ici."
              actionLabel="Voir les reservations"
              actionTo="/admin/reservations"
            />
          )}
        </Panel>

        <div className="grid gap-6 xl:col-span-5">
          <Panel
            variant={pendingPayments.count ? "warning" : "success"}
            title="Paiements en attente"
            description={pendingPayments.count ? `${pendingPayments.count} paiement(s) a encaisser` : "Tout est encaisse"}
            action={<Wallet size={18} className={pendingPayments.count ? "text-amber-600" : "text-emerald-600"} />}
          >
            <p className="font-display text-3xl font-semibold tracking-tight text-slate-900">
              <CountUp value={pendingPayments.total} format={(n) => currency(n)} />
            </p>
            {pendingPayments.rows.length ? (
              <ul className="mt-4 space-y-2">
                {pendingPayments.rows.map((payment) => (
                  <li key={payment.id} className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2 text-sm">
                    <span className="truncate font-medium text-slate-800">{payment.reservation?.reference}</span>
                    <span className="tabular-nums text-slate-600">{currency(payment.remaining)}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            <Link to="/admin/payments" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-slate-700 hover:underline">
              Ouvrir les paiements <ArrowUpRight size={14} />
            </Link>
          </Panel>

          <Panel
            title="Vehicules a controler"
            description={carsToCheck.length ? "En maintenance actuellement." : "Aucune intervention en cours."}
            action={<Wrench size={18} className="text-slate-400" />}
          >
            {carsToCheck.length ? (
              <ul className="space-y-2">
                {carsToCheck.slice(0, 3).map((car) => (
                  <li key={car.id} className="card-info flex items-center justify-between px-3 py-2 text-sm">
                    <span className="truncate font-medium text-slate-800">{car.brand} {car.model}</span>
                    <StatusBadge status={car.status} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">Toute la flotte est operationnelle.</p>
            )}
          </Panel>
        </div>
      </Item>

      {/* Row 3: analytics */}
      <Item className="grid gap-6 xl:grid-cols-12">
        <Panel className="xl:col-span-5" title="Statuts de reservation" description="Repartition par etat.">
          {statsLoading ? <SkeletonBlock className="h-40" /> : <StatusDonut items={donutItems} centerLabel="Reservations" />}
        </Panel>

        <Panel className="xl:col-span-7" title="Top voitures" description="Les vehicules les plus reserves." padded={false}>
          <DataTable
            bare
            loading={topLoading}
            emptyTitle="Pas encore de classement"
            emptyDescription="Les voitures les plus reservees apparaitront ici."
            columns={[
              {
                key: "brand",
                label: "Voiture",
                render: (row) => (
                  <div>
                    <p className="font-medium text-slate-900">{row.car?.brand} {row.car?.model}</p>
                    <p className="text-xs text-slate-500">{row.car?.plateNumber}</p>
                  </div>
                )
              },
              {
                key: "reservations",
                label: "Reservations",
                render: (row) => (
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-sm font-semibold tabular-nums text-slate-900">{row.reservations}</span>
                    <div className="h-1.5 w-28 overflow-hidden rounded-full bg-slate-100">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: "var(--primary-color)" }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.min((row.reservations / Math.max(topCars[0]?.reservations || 1, 1)) * 100, 100)}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: DURATION.headline, ease: EASE }}
                      />
                    </div>
                  </div>
                )
              }
            ]}
            rows={topCars}
          />
        </Panel>
      </Item>
    </Stagger>
  );
}
