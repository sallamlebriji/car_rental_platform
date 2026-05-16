import { useMemo, useState } from "react";
import { Activity, Building2, Search, ShieldCheck } from "lucide-react";
import ControlCenterHero from "../components/ControlCenterHero";
import AgencyScopeSelector from "../components/AgencyScopeSelector";
import DataTable from "../components/DataTable";
import { useFetch } from "../hooks/useFetch";
import { date } from "../utils/format";

export default function SuperAdminAuditLogsPage() {
  const { data: agenciesData } = useFetch("/agencies", []);
  const agencies = Array.isArray(agenciesData) ? agenciesData : [];
  const [selectedAgencyId, setSelectedAgencyId] = useState("");
  const [search, setSearch] = useState("");

  const auditUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (selectedAgencyId) params.set("agencyId", selectedAgencyId);
    if (search.trim()) params.set("q", search.trim());
    const query = params.toString();
    return query ? `/platform/audit-logs?${query}` : "/platform/audit-logs";
  }, [selectedAgencyId, search]);

  const { data: logsData, loading } = useFetch(auditUrl, [auditUrl]);
  const logs = Array.isArray(logsData) ? logsData : [];

  const heroMetrics = [
    {
      label: "Logs visibles",
      value: logs.length,
      hint: "Evenements charges dans la vue courante.",
      icon: Activity
    },
    {
      label: "Scope agence",
      value: selectedAgencyId ? agencies.find((agency) => agency.id === selectedAgencyId)?.name || "Agence" : "Toutes",
      hint: "Filtrage multi-tenant des journaux.",
      icon: Building2
    },
    {
      label: "Gouvernance",
      value: "RBAC actif",
      hint: "La consultation passe par une permission dediee.",
      icon: ShieldCheck
    }
  ];

  return (
    <div className="space-y-8">
      <ControlCenterHero
        badge="Observabilite et traçabilite"
        title="Audit logs"
        description="Suivez les connexions, modifications et operations critiques du systeme avec un filtrage multi-tenant par agence."
        metrics={heroMetrics}
        tone="super"
      />

      <div className="grid gap-4 xl:grid-cols-[0.7fr_1.3fr]">
        <AgencyScopeSelector
          agencies={agencies}
          value={selectedAgencyId}
          onChange={setSelectedAgencyId}
          helper="Laissez vide pour tout le reseau ou ciblez une agence particuliere."
        />
        <div className="rounded-[1.6rem] border border-slate-200 bg-white/85 p-5 shadow-sm">
          <label className="relative block">
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input pl-11" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher une action, un utilisateur ou une entite..." />
          </label>
        </div>
      </div>

      <section className="card overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-2xl font-semibold text-slate-900">Journal d'activite</h2>
          <p className="mt-1 text-sm text-slate-500">Historique recent des operations critiques du systeme.</p>
        </div>
        <div className="px-6 py-4 text-sm text-slate-500">
          {loading ? "Chargement des journaux..." : `${logs.length} ligne(s) chargee(s).`}
        </div>
        <DataTable
          columns={[
            {
              key: "createdAt",
              label: "Date",
              render: (row) => (
                <div>
                  <p className="font-semibold text-slate-900">{date(row.createdAt)}</p>
                  <p className="text-sm text-slate-500">{new Date(row.createdAt).toLocaleTimeString("fr-MA", { hour: "2-digit", minute: "2-digit" })}</p>
                </div>
              )
            },
            {
              key: "user",
              label: "Utilisateur",
              render: (row) => (
                <div>
                  <p className="font-semibold text-slate-900">
                    {row.user ? `${row.user.firstName || ""} ${row.user.lastName || ""}`.trim() || row.user.email : "Systeme"}
                  </p>
                  <p className="text-sm text-slate-500">{row.user?.email || "Aucun email"}</p>
                </div>
              )
            },
            { key: "action", label: "Action" },
            { key: "entityType", label: "Entite" },
            {
              key: "description",
              label: "Description",
              render: (row) => row.description || "-"
            }
          ]}
          rows={logs}
        />
      </section>
    </div>
  );
}
