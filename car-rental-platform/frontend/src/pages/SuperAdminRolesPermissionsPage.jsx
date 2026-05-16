import { useEffect, useMemo, useState } from "react";
import { KeyRound, Save, ShieldCheck, Trash2, UserCog, Wrench } from "lucide-react";
import api from "../api/client";
import ControlCenterHero from "../components/ControlCenterHero";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { useFetch } from "../hooks/useFetch";

const emptyForm = {
  name: "",
  code: "",
  description: "",
  permissionIds: []
};

export default function SuperAdminRolesPermissionsPage() {
  const { data, setData } = useFetch("/settings/roles-permissions", []);
  const roles = data?.roles || [];
  const permissions = data?.permissions || [];
  const [selectedRole, setSelectedRole] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!selectedRole) {
      setForm(emptyForm);
      return;
    }

    setForm({
      name: selectedRole.name || "",
      code: selectedRole.code || "",
      description: selectedRole.description || "",
      permissionIds: selectedRole.rolePermissions?.map((item) => item.permissionId) || []
    });
  }, [selectedRole]);

  const groupedPermissions = useMemo(() => {
    return permissions.reduce((acc, permission) => {
      const category = permission.category || "general";
      if (!acc[category]) acc[category] = [];
      acc[category].push(permission);
      return acc;
    }, {});
  }, [permissions]);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    const payload = {
      name: form.name,
      code: form.code,
      description: form.description,
      permissionIds: form.permissionIds
    };

    if (selectedRole) {
      const response = await api.put(`/settings/roles-permissions/${selectedRole.id}`, payload);
      setData({
        ...data,
        roles: roles.map((role) => (role.id === selectedRole.id ? response.data : role))
      });
      setSelectedRole(response.data);
      setMessage("Role mis a jour.");
      return;
    }

    const response = await api.post("/settings/roles-permissions", payload);
    setData({
      ...data,
      roles: [response.data, ...roles]
    });
    setSelectedRole(response.data);
    setMessage("Nouveau role cree.");
  }

  async function handleDelete(role) {
    await api.delete(`/settings/roles-permissions/${role.id}`);
    setData({
      ...data,
      roles: roles.filter((item) => item.id !== role.id)
    });
    if (selectedRole?.id === role.id) {
      setSelectedRole(null);
      setForm(emptyForm);
    }
    setMessage("Role supprime.");
  }

  function togglePermission(permissionId) {
    setForm((current) => ({
      ...current,
      permissionIds: current.permissionIds.includes(permissionId)
        ? current.permissionIds.filter((id) => id !== permissionId)
        : [...current.permissionIds, permissionId]
    }));
  }

  const heroMetrics = [
    {
      label: "Roles definis",
      value: roles.length,
      hint: "Profils d'acces disponibles dans le systeme.",
      icon: UserCog
    },
    {
      label: "Permissions",
      value: permissions.length,
      hint: "Actions unitaires attribuables aux roles.",
      icon: KeyRound
    },
    {
      label: "Edition courante",
      value: selectedRole?.name || "Nouveau role",
      hint: "Role actuellement selectionne pour edition.",
      icon: ShieldCheck
    }
  ];

  return (
    <div className="space-y-8">
      <ControlCenterHero
        badge="Gouvernance des acces"
        title="Roles et permissions"
        description="Structurez les droits du reseau, creez des profils metier clairs et maitrisez finement la visibilite de chaque espace."
        metrics={heroMetrics}
        tone="super"
      />

      <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_minmax(760px,1.15fr)]">
        <section className="space-y-6">
          <div className="card overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">
                  <Wrench size={18} />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Roles existants</h2>
                  <p className="mt-1 text-sm text-slate-500">Selectionnez un role pour ajuster ses droits et son perimetre.</p>
                </div>
              </div>
            </div>
            <DataTable
              columns={[
                { key: "name", label: "Role" },
                { key: "code", label: "Code" },
                { key: "system", label: "Type", render: (row) => <StatusBadge status={row.isSystem ? "CONFIRMED" : "PENDING"} /> },
                {
                  key: "permissions",
                  label: "Permissions",
                  render: (row) => row.rolePermissions.map((item) => item.permission.code).join(", ")
                },
                {
                  key: "actions",
                  label: "Actions",
                  render: (row) => (
                    <div className="flex flex-wrap gap-2">
                      <button className="btn-secondary !px-3 !py-2" onClick={() => setSelectedRole(row)}>Modifier</button>
                      {!row.isSystem ? (
                        <button className="btn-secondary !px-3 !py-2" onClick={() => handleDelete(row)}>
                          <span className="inline-flex items-center gap-2">
                            <Trash2 size={15} />
                            Supprimer
                          </span>
                        </button>
                      ) : null}
                    </div>
                  )
                }
              ]}
              rows={roles}
            />
          </div>
        </section>

        <section className="space-y-6">
          <form onSubmit={handleSubmit} className="card overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-3xl font-semibold text-slate-900">
                    {selectedRole ? "Modifier le role" : "Ajouter un role"}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm text-slate-500">
                    Definissez un nom, un code stable et un ensemble de permissions adapte a un contexte metier.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setSelectedRole(null);
                      setForm(emptyForm);
                      setMessage("");
                    }}
                  >
                    Nouveau role
                  </button>
                  {selectedRole ? (
                    <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
                      Edition: {selectedRole.name}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="space-y-8 p-6">
              <div className="rounded-[1.6rem] border border-slate-200 bg-slate-50 p-5">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">Identite du role</h3>
                  <p className="mt-1 text-sm text-slate-500">Definissez un nom lisible, un code stable et une description metier.</p>
                </div>
                <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
                  <div className="grid gap-4">
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-slate-700">Nom du role</span>
                      <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Responsable flotte" />
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-slate-700">Description</span>
                      <textarea className="input min-h-28" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Role dedie a la gestion des vehicules et disponibilites." />
                    </label>
                  </div>
                  <div className="grid gap-4 content-start">
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-slate-700">Code</span>
                      <input className="input" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase().replace(/\s+/g, "_") })} placeholder="FLEET_MANAGER" />
                    </label>
                    <div className="rounded-2xl bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Apercu</p>
                      <p className="mt-3 text-xl font-semibold text-slate-900">{form.name || "Nouveau role"}</p>
                      <p className="mt-1 text-sm text-slate-500">{form.code || "ROLE_CODE"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Permissions</h3>
                  <p className="mt-1 text-sm text-slate-500">Activez uniquement les droits necessaires pour ce role.</p>
                </div>
                <div className="grid gap-4 xl:grid-cols-2">
                  {Object.entries(groupedPermissions).map(([category, items]) => (
                    <div key={category} className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-5">
                      <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{category}</h4>
                      <div className="mt-4 grid gap-3">
                        {items.map((permission) => (
                          <label key={permission.id} className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3">
                            <input type="checkbox" checked={form.permissionIds.includes(permission.id)} onChange={() => togglePermission(permission.id)} className="mt-1" />
                            <div>
                              <p className="font-medium text-slate-900">{permission.name}</p>
                              <p className="text-sm text-slate-500">{permission.code}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.4rem] border border-slate-200 bg-slate-50 px-5 py-4">
                <div>
                  <p className="font-medium text-slate-900">Permissions selectionnees</p>
                  <p className="text-sm text-slate-500">{form.permissionIds.length} droit(s) actif(s)</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button className="btn-primary min-w-52 gap-2">
                    <Save size={18} />
                    {selectedRole ? "Enregistrer les changements" : "Creer le role"}
                  </button>
                  {message ? <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">{message}</span> : null}
                </div>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
