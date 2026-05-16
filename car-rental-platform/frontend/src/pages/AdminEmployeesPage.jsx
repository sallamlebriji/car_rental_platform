import { useMemo, useState } from "react";
import {
  BadgeCheck,
  BriefcaseBusiness,
  KeyRound,
  Mail,
  Plus,
  Search,
  Shield,
  Trash2,
  UserRound,
  Users
} from "lucide-react";
import api from "../api/client";
import DataTable from "../components/DataTable";
import { useFetch } from "../hooks/useFetch";

function TeamMetricCard({ icon: Icon, label, value, hint, tone }) {
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

export default function AdminEmployeesPage() {
  const { data: employeesData, setData, loading } = useFetch("/employees", []);
  const { data: settingsData } = useFetch("/settings", []);
  const employees = Array.isArray(employeesData) ? employeesData : [];
  const roles = Array.isArray(settingsData?.roles)
    ? settingsData.roles.filter((role) => role.code !== "SUPER_ADMIN")
    : [];

  const [search, setSearch] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    roleId: "",
    title: "",
    password: ""
  });

  const metrics = useMemo(() => {
    const total = employees.length;
    const active = employees.filter((employee) => employee.isActive).length;
    const managers = employees.filter((employee) => employee.role?.code === "ADMIN_AGENCY").length;
    const operational = employees.filter((employee) => employee.role?.code !== "ADMIN_AGENCY").length;
    return { total, active, managers, operational };
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return employees;

    return employees.filter((employee) => {
      const haystack = [
        employee.user?.firstName,
        employee.user?.lastName,
        employee.user?.email,
        employee.title,
        employee.role?.name
      ].join(" ").toLowerCase();
      return haystack.includes(query);
    });
  }, [employees, search]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setFeedback("");

    try {
      const response = await api.post("/employees", form);
      setData([response.data, ...employees]);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        roleId: "",
        title: "",
        password: ""
      });
      setFeedback("Employe ajoute avec succes.");
    } catch (error) {
      setFeedback(error.response?.data?.message || "Impossible d'ajouter cet employe.");
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleEmployee(employee) {
    const response = await api.put(`/employees/${employee.id}`, {
      title: employee.title,
      roleId: employee.roleId,
      isActive: !employee.isActive
    });
    setData(employees.map((item) => (item.id === employee.id ? { ...item, ...response.data } : item)));
  }

  async function removeEmployee(employeeId) {
    await api.delete(`/employees/${employeeId}`);
    setData(employees.filter((employee) => employee.id !== employeeId));
  }

  async function resetPassword(employee) {
    const newPassword = window.prompt(`Nouveau mot de passe pour ${employee.user?.firstName} ${employee.user?.lastName}`, "password123");
    if (!newPassword) return;

    try {
      const response = await api.post(`/employees/${employee.id}/reset-password`, { newPassword });
      setFeedback(response.data.message || "Mot de passe reinitialise.");
    } catch (error) {
      setFeedback(error.response?.data?.message || "Impossible de reinitialiser le mot de passe.");
    }
  }

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <span className="inline-flex rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-500">
          Equipe agence
        </span>
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">Gestion des employes</h1>
          <p className="mt-2 max-w-3xl text-lg leading-relaxed text-slate-500">
            Organisez les roles, creez rapidement un profil collaborateur et gardez une vue claire sur l’equipe active.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <TeamMetricCard icon={Users} label="Equipe" value={metrics.total} hint="Nombre total de collaborateurs enregistres." tone="from-sky-500 to-cyan-500" />
        <TeamMetricCard icon={BadgeCheck} label="Actifs" value={metrics.active} hint="Collaborateurs actuellement autorises a se connecter." tone="from-emerald-500 to-teal-500" />
        <TeamMetricCard icon={Shield} label="Admins agence" value={metrics.managers} hint="Profils disposant d'un niveau de pilotage eleve." tone="from-amber-500 to-orange-500" />
        <TeamMetricCard icon={BriefcaseBusiness} label="Operationnels" value={metrics.operational} hint="Agents de reservation, responsables voiture et autres roles." tone="from-fuchsia-500 to-violet-500" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <form className="card overflow-hidden" onSubmit={handleSubmit}>
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Nouvel employe</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Creation rapide d’un compte collaborateur rattache a l’agence.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500">
                <Plus size={14} />
                Ajout express
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Prenom" icon={UserRound}>
                <input className="input" value={form.firstName} onChange={(event) => setForm({ ...form, firstName: event.target.value })} placeholder="Ex: Yassine" />
              </Field>
              <Field label="Nom" icon={UserRound}>
                <input className="input" value={form.lastName} onChange={(event) => setForm({ ...form, lastName: event.target.value })} placeholder="Ex: Bennani" />
              </Field>
              <Field label="Email" icon={Mail}>
                <input className="input" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="employe@agence.ma" />
              </Field>
              <Field label="Telephone" icon={Mail}>
                <input className="input" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="+212..." />
              </Field>
              <Field label="Fonction" icon={BriefcaseBusiness}>
                <input className="input" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Ex: Agent de reservation" />
              </Field>
              <Field label="Role" icon={Shield}>
                <select className="input" value={form.roleId} onChange={(event) => setForm({ ...form, roleId: event.target.value })}>
                  <option value="">Choisir un role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Mot de passe" icon={KeyRound}>
                <input className="input" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Par defaut: password123" />
              </Field>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 pt-5">
              <button className="btn-primary gap-2" disabled={submitting}>
                <Plus size={18} />
                {submitting ? "Ajout en cours..." : "Ajouter l'employe"}
              </button>
              {feedback ? <p className="text-sm font-medium text-slate-700">{feedback}</p> : null}
            </div>
          </div>
        </form>

        <section className="card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Equipe actuelle</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Recherchez un profil et pilotez son statut d’activation.
                </p>
              </div>

              <label className="relative xl:min-w-[20rem]">
                <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  className="input pl-11"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Nom, email, role..."
                />
              </label>
            </div>
          </div>

          <div className="px-6 py-4 text-sm text-slate-500">
            {loading ? "Chargement des employes..." : `${filteredEmployees.length} employe(s) affiché(s).`}
          </div>

          <DataTable
            columns={[
              {
                key: "name",
                label: "Collaborateur",
                render: (row) => (
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                      <UserRound size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{row.user?.firstName} {row.user?.lastName}</p>
                      <p className="text-sm text-slate-500">{row.title || "Fonction non renseignee"}</p>
                    </div>
                  </div>
                )
              },
              {
                key: "email",
                label: "Contact",
                render: (row) => (
                  <div>
                    <p className="font-medium text-slate-900">{row.user?.email}</p>
                    <p className="text-sm text-slate-500">{row.user?.phone || "Telephone non renseigne"}</p>
                  </div>
                )
              },
              {
                key: "role",
                label: "Role",
                render: (row) => (
                  <div>
                    <p className="font-semibold text-slate-900">{row.role?.name || "-"}</p>
                    <p className="text-sm text-slate-500">{row.role?.code || "Aucun code"}</p>
                  </div>
                )
              },
              {
                key: "status",
                label: "Statut",
                render: (row) => (
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${row.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"}`}>
                    {row.isActive ? "Actif" : "Desactive"}
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
                      onClick={() => resetPassword(row)}
                    >
                      <KeyRound size={16} />
                      Reinit. mdp
                    </button>
                    <button
                      type="button"
                      className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition ${row.isActive ? "border-amber-200 text-amber-700 hover:bg-amber-50" : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"}`}
                      onClick={() => toggleEmployee(row)}
                    >
                      <Shield size={16} />
                      {row.isActive ? "Desactiver" : "Activer"}
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                      onClick={() => removeEmployee(row.id)}
                    >
                      <Trash2 size={16} />
                      Supprimer
                    </button>
                  </div>
                )
              }
            ]}
            rows={filteredEmployees}
          />
        </section>
      </section>
    </div>
  );
}
