import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Ban,
  CalendarRange,
  CarFront,
  CircleDollarSign,
  Clock3,
  Filter,
  Search,
  ShieldAlert,
  UserRound
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/client";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { useFetch } from "../hooks/useFetch";
import { currency, date } from "../utils/format";

function ReservationMetricCard({ icon: Icon, label, value, hint, tone }) {
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

export default function AdminReservationsPage() {
  const { data: reservationsData, setData, loading } = useFetch("/reservations", []);
  const reservations = Array.isArray(reservationsData) ? reservationsData : [];

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const metrics = useMemo(() => {
    const total = reservations.length;
    const pending = reservations.filter((item) => item.status === "PENDING").length;
    const confirmed = reservations.filter((item) => item.status === "CONFIRMED").length;
    const estimatedRevenue = reservations.reduce((sum, item) => sum + Number(item.totalPrice || 0), 0);
    return { total, pending, confirmed, estimatedRevenue };
  }, [reservations]);

  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      const matchesStatus = statusFilter === "ALL" ? true : reservation.status === statusFilter;
      const query = search.trim().toLowerCase();
      if (!query) return matchesStatus;

      const haystack = [
        reservation.reference,
        reservation.client?.user?.firstName,
        reservation.client?.user?.lastName,
        reservation.client?.user?.phone,
        reservation.car?.brand,
        reservation.car?.model,
        reservation.car?.plateNumber
      ].join(" ").toLowerCase();

      return matchesStatus && haystack.includes(query);
    });
  }, [reservations, search, statusFilter]);

  async function updateStatus(id, status) {
    const response = await api.patch(`/reservations/${id}/status`, { status });
    setData(reservations.map((item) => (item.id === id ? { ...item, status: response.data.status } : item)));
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <span className="inline-flex rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-500">
            Pilotage reservations
          </span>
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">Gestion des reservations</h1>
            <p className="mt-2 max-w-3xl text-lg leading-relaxed text-slate-500">
              Validez, refusez et suivez chaque demande depuis une vue operationnelle claire.
            </p>
          </div>
        </div>

        <Link to="/admin/contracts" className="btn-secondary gap-2 self-start lg:self-auto">
          <ArrowRight size={18} />
          Voir les contrats
        </Link>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ReservationMetricCard
          icon={CalendarRange}
          label="Reservations"
          value={metrics.total}
          hint="Volume total des dossiers actuellement visibles."
          tone="from-sky-500 to-cyan-500"
        />
        <ReservationMetricCard
          icon={Clock3}
          label="En attente"
          value={metrics.pending}
          hint="Demandes qui attendent encore une decision de l'agence."
          tone="from-amber-500 to-orange-500"
        />
        <ReservationMetricCard
          icon={BadgeCheck}
          label="Confirmees"
          value={metrics.confirmed}
          hint="Dossiers deja valides et prets a etre executes."
          tone="from-emerald-500 to-teal-500"
        />
        <ReservationMetricCard
          icon={CircleDollarSign}
          label="CA estime"
          value={currency(metrics.estimatedRevenue)}
          hint="Montant cumule sur les reservations chargees."
          tone="from-fuchsia-500 to-violet-500"
        />
      </section>

      <section className="card overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Centre de filtrage</h2>
              <p className="mt-1 text-sm text-slate-500">
                Recherchez un dossier par reference, client, telephone, voiture ou matricule.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-[1.4fr_0.8fr] xl:min-w-[36rem]">
              <label className="relative">
                <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  className="input pl-11"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Ex: RES-0001, Sara, Dacia, 12345-A-1"
                />
              </label>

              <label className="relative">
                <Filter size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <select className="input pl-11" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                  <option value="ALL">Tous les statuts</option>
                  <option value="PENDING">En attente</option>
                  <option value="CONFIRMED">Confirmee</option>
                  <option value="REFUSED">Refusee</option>
                  <option value="CANCELLED">Annulee</option>
                  <option value="COMPLETED">Terminee</option>
                </select>
              </label>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 text-sm text-slate-500">
          {loading ? "Chargement des reservations..." : `${filteredReservations.length} reservation(s) correspondent aux filtres actuels.`}
        </div>

        <DataTable
          columns={[
            {
              key: "reference",
              label: "Reference",
              render: (row) => (
                <div>
                  <p className="font-semibold text-slate-900">{row.reference}</p>
                  <p className="text-sm text-slate-500">{row.totalDays} jours</p>
                </div>
              )
            },
            {
              key: "client",
              label: "Client",
              render: (row) => (
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                    <UserRound size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {row.client?.user?.firstName} {row.client?.user?.lastName}
                    </p>
                    <p className="text-sm text-slate-500">{row.client?.user?.phone || row.client?.user?.email}</p>
                  </div>
                </div>
              )
            },
            {
              key: "car",
              label: "Voiture",
              render: (row) => (
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                    <CarFront size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{row.car?.brand} {row.car?.model}</p>
                    <p className="text-sm text-slate-500">{row.car?.plateNumber}</p>
                  </div>
                </div>
              )
            },
            {
              key: "dates",
              label: "Dates",
              render: (row) => (
                <div>
                  <p className="font-medium text-slate-900">{date(row.startDate)} - {date(row.endDate)}</p>
                  <p className="text-sm text-slate-500">Creation {date(row.createdAt)}</p>
                </div>
              )
            },
            {
              key: "amount",
              label: "Montant",
              render: (row) => (
                <div>
                  <p className="font-semibold text-slate-900">{currency(row.totalPrice)}</p>
                  <p className="text-sm text-slate-500">Avance {currency(row.advanceAmount)}</p>
                </div>
              )
            },
            { key: "status", label: "Statut", render: (row) => <StatusBadge status={row.status} /> },
            {
              key: "actions",
              label: "Actions",
              render: (row) => (
                <div className="flex flex-wrap gap-2">
                  <Link to={`/admin/reservations/${row.id}`} className="btn-secondary gap-2 px-3 py-2 text-sm">
                    <ArrowRight size={16} />
                    Ouvrir
                  </Link>

                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
                    onClick={() => updateStatus(row.id, "CONFIRMED")}
                  >
                    <BadgeCheck size={16} />
                    Valider
                  </button>

                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                    onClick={() => updateStatus(row.id, "REFUSED")}
                  >
                    <Ban size={16} />
                    Refuser
                  </button>

                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                    onClick={() => updateStatus(row.id, "CANCELLED")}
                  >
                    <ShieldAlert size={16} />
                    Annuler
                  </button>
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
