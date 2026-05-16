import { useMemo, useState } from "react";
import {
  BadgeCheck,
  Ban,
  CalendarRange,
  Mail,
  MapPinned,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserRound
} from "lucide-react";
import api from "../api/client";
import DataTable from "../components/DataTable";
import { useFetch } from "../hooks/useFetch";
import { currency, date } from "../utils/format";

function ClientMetricCard({ icon: Icon, label, value, hint, tone }) {
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

export default function AdminClientsPage() {
  const { data: clientsData, setData, loading } = useFetch("/clients", []);
  const clients = Array.isArray(clientsData) ? clientsData : [];
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    cinOrPassport: "",
    driverLicense: "",
    internalNote: ""
  });

  const metrics = useMemo(() => {
    const total = clients.length;
    const blocked = clients.filter((client) => client.isBlocked).length;
    const pendingApproval = clients.filter((client) => client.user && !client.user.isActive).length;
    const totalReservations = clients.reduce((sum, client) => sum + (client.reservations?.length || 0), 0);
    const activeClients = clients.filter((client) => client.user?.isActive).length;
    return { total, blocked, totalReservations, activeClients, pendingApproval };
  }, [clients]);

  const filteredClients = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return clients;

    return clients.filter((client) => {
      const haystack = [
        client.user?.firstName,
        client.user?.lastName,
        client.user?.email,
        client.user?.phone,
        client.city,
        client.cinOrPassport
      ].join(" ").toLowerCase();
      return haystack.includes(query);
    });
  }, [clients, search]);

  async function toggleBlocked(client) {
    const response = await api.put(`/clients/${client.id}`, {
      isBlocked: !client.isBlocked,
      internalNote: client.internalNote,
      user: {
        isActive: client.user?.isActive
      }
    });
    setData(clients.map((item) => (item.id === client.id ? { ...item, ...response.data } : item)));
  }

  async function approveClient(client) {
    const response = await api.patch(`/clients/${client.id}/approve`);
    setData(clients.map((item) => (item.id === client.id ? response.data : item)));
    setFeedback("Compte client valide avec succes.");
  }

  async function removeClient(clientId) {
    await api.delete(`/clients/${clientId}`);
    setData(clients.filter((item) => item.id !== clientId));
  }

  async function createClient(event) {
    event.preventDefault();
    setSubmitting(true);
    setFeedback("");

    try {
      const response = await api.post("/clients", form);
      setData([response.data, ...clients]);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        city: "",
        address: "",
        cinOrPassport: "",
        driverLicense: "",
        internalNote: ""
      });
      setFeedback("Client ajoute avec succes.");
    } catch (error) {
      setFeedback(error.response?.data?.message || "Impossible d'ajouter ce client.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <span className="inline-flex rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-500">
          Portefeuille client
        </span>
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">Gestion des clients</h1>
          <p className="mt-2 max-w-3xl text-lg leading-relaxed text-slate-500">
            Visualisez l’historique, identifiez les profils sensibles et pilotez la relation client depuis une seule page.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ClientMetricCard icon={UserRound} label="Clients" value={metrics.total} hint="Nombre total de fiches client disponibles." tone="from-sky-500 to-cyan-500" />
        <ClientMetricCard icon={ShieldCheck} label="Actifs" value={metrics.activeClients} hint="Comptes clients actuellement autorises a se connecter." tone="from-emerald-500 to-teal-500" />
        <ClientMetricCard icon={CalendarRange} label="Reservations" value={metrics.totalReservations} hint="Historique cumule de toutes les demandes." tone="from-amber-500 to-orange-500" />
        <ClientMetricCard icon={BadgeCheck} label="En attente" value={metrics.pendingApproval} hint="Comptes en attente de validation par l'agence." tone="from-fuchsia-500 to-violet-500" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <form className="card overflow-hidden" onSubmit={createClient}>
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Nouveau client</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Creez une fiche client manuellement depuis l’espace admin.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500">
                <Plus size={14} />
                Creation rapide
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Prenom" icon={UserRound}>
                <input className="input" value={form.firstName} onChange={(event) => setForm({ ...form, firstName: event.target.value })} placeholder="Ex: Sara" />
              </Field>
              <Field label="Nom" icon={UserRound}>
                <input className="input" value={form.lastName} onChange={(event) => setForm({ ...form, lastName: event.target.value })} placeholder="Ex: Bennani" />
              </Field>
              <Field label="Email" icon={Mail}>
                <input className="input" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="client@email.com" />
              </Field>
              <Field label="Telephone" icon={Mail}>
                <input className="input" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="+212..." />
              </Field>
              <Field label="Ville" icon={MapPinned}>
                <input className="input" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} placeholder="Ex: Casablanca" />
              </Field>
              <Field label="Adresse" icon={MapPinned}>
                <input className="input" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} placeholder="Adresse complete" />
              </Field>
              <Field label="CIN / Passeport" icon={ShieldCheck}>
                <input className="input" value={form.cinOrPassport} onChange={(event) => setForm({ ...form, cinOrPassport: event.target.value })} placeholder="Numero de piece" />
              </Field>
              <Field label="Permis de conduire" icon={ShieldCheck}>
                <input className="input" value={form.driverLicense} onChange={(event) => setForm({ ...form, driverLicense: event.target.value })} placeholder="Numero de permis" />
              </Field>
            </div>

            <Field label="Note interne" icon={Ban}>
              <textarea className="input min-h-24 resize-y" value={form.internalNote} onChange={(event) => setForm({ ...form, internalNote: event.target.value })} placeholder="Remarque interne sur ce client..." />
            </Field>

            <div className="flex flex-col gap-3 border-t border-slate-100 pt-5">
              <button className="btn-primary gap-2" disabled={submitting}>
                <Plus size={18} />
                {submitting ? "Ajout en cours..." : "Ajouter le client"}
              </button>
              {feedback ? <p className="text-sm font-medium text-slate-700">{feedback}</p> : null}
            </div>
          </div>
        </form>

        <section className="card overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Base clients</h2>
              <p className="mt-1 text-sm text-slate-500">
                Recherchez un client par nom, email, telephone, ville ou numero de piece.
              </p>
            </div>

            <label className="relative xl:min-w-[24rem]">
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="input pl-11"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Ex: Sara, sara@email.com, Casablanca..."
              />
            </label>
          </div>
        </div>

        <div className="px-6 py-4 text-sm text-slate-500">
          {loading ? "Chargement des clients..." : `${filteredClients.length} client(s) affiché(s).`}
        </div>

        <DataTable
          columns={[
            {
              key: "name",
              label: "Client",
              render: (row) => (
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                    <UserRound size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{row.user?.firstName} {row.user?.lastName}</p>
                    <p className="text-sm text-slate-500">{row.cinOrPassport || "Piece non renseignee"}</p>
                  </div>
                </div>
              )
            },
            {
              key: "contact",
              label: "Contact",
              render: (row) => (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <Mail size={14} className="text-slate-400" />
                    {row.user?.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <MapPinned size={14} className="text-slate-400" />
                    {[row.user?.phone, row.city].filter(Boolean).join(" - ")}
                  </div>
                </div>
              )
            },
            {
              key: "history",
              label: "Historique",
              render: (row) => {
                const reservations = row.reservations || [];
                const totalSpent = reservations.reduce((sum, reservation) => sum + Number(reservation.totalPrice || 0), 0);
                return (
                  <div>
                    <p className="font-semibold text-slate-900">{reservations.length} reservation(s)</p>
                    <p className="text-sm text-slate-500">{currency(totalSpent)}</p>
                  </div>
                );
              }
            },
            {
              key: "latest",
              label: "Derniere activite",
              render: (row) => {
                const latest = row.reservations?.[0];
                return (
                  <div>
                    <p className="font-medium text-slate-900">{latest ? date(latest.createdAt) : "Aucune reservation"}</p>
                    <p className="text-sm text-slate-500">{latest ? `${latest.car?.brand} ${latest.car?.model}` : "Aucune activite"}</p>
                  </div>
                );
              }
            },
            {
              key: "status",
              label: "Statut",
              render: (row) => (
                <div className="flex flex-wrap gap-2">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${row.user?.isActive ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {row.user?.isActive ? "Valide" : "En attente"}
                  </span>
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${row.isBlocked ? "bg-rose-100 text-rose-700" : "bg-slate-200 text-slate-700"}`}>
                    {row.isBlocked ? "Bloque" : "Autorise"}
                  </span>
                </div>
              )
            },
            {
              key: "actions",
              label: "Actions",
              render: (row) => (
                <div className="flex flex-wrap gap-2">
                  {!row.user?.isActive ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
                      onClick={() => approveClient(row)}
                    >
                      <BadgeCheck size={16} />
                      Valider
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition ${row.isBlocked ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50" : "border-amber-200 text-amber-700 hover:bg-amber-50"}`}
                    onClick={() => toggleBlocked(row)}
                  >
                    <Ban size={16} />
                    {row.isBlocked ? "Debloquer" : "Bloquer"}
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                    onClick={() => removeClient(row.id)}
                  >
                    <Trash2 size={16} />
                    Supprimer
                  </button>
                </div>
              )
            }
          ]}
          rows={filteredClients}
        />
        </section>
      </section>
    </div>
  );
}
