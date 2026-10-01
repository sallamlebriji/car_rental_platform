import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Building2, KeyRound, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useThemeSettings } from "../context/ThemeContext";
import FormField from "../components/FormField";
import AuthShell from "../components/client/AuthShell";
import DemoAccounts, { agencyDemoAccounts } from "../components/DemoAccounts";

export default function AgencyLoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { slug } = useParams();
  const { activeAgency, buildClientPath } = useThemeSettings();

  async function submitCredentials(credentials) {
    setError("");
    setSubmitting(true);

    try {
      const user = await login({ ...credentials, portal: "agency", agencySlug: slug || undefined });
      navigate(user.type === "SUPER_ADMIN" ? "/super-admin/dashboard" : "/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Connexion agence impossible.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    submitCredentials(form);
  }

  function handleDemo(credentials) {
    setForm(credentials);
    submitCredentials(credentials);
  }

  return (
    <AuthShell
      eyebrow={slug ? `Agence ${activeAgency?.name || slug}` : "Espace agence"}
      title="Pilotez votre agence"
      description="Reservations, flotte, clients et paiements, reunis dans un seul tableau de bord."
      aside={
        <div className="space-y-2">
          {[
            ["Admin agence", "Pilotage complet de l'activite"],
            ["Employe", "Acces selon les permissions"],
            ["Super admin", "Vision reseau et parametres globaux"]
          ].map(([label, hint]) => (
            <div key={label} className="flex items-center gap-3 text-sm">
              <ShieldCheck size={16} className="shrink-0 text-white/60" />
              <span className="font-medium text-white">{label}</span>
              <span className="text-white/50">· {hint}</span>
            </div>
          ))}
        </div>
      }
    >
      <h2 className="hidden font-display text-2xl font-bold tracking-tight text-slate-900 lg:block">Connexion agence</h2>
      <p className="mt-1 hidden text-sm text-slate-500 lg:block">
        {slug ? "Seuls les comptes rattaches a cette agence peuvent se connecter ici." : "Admins, employes et super admin."}
      </p>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <FormField label="Email professionnel">
          <div className="relative">
            <Building2 size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input !pl-11" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
        </FormField>
        <FormField label="Mot de passe">
          <div className="relative">
            <KeyRound size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="input !pl-11" type="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
        </FormField>
        {error ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
        <button disabled={submitting} className="btn-primary w-full !py-3 disabled:opacity-60">
          {submitting ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <div className="mt-6">
        <DemoAccounts accounts={agencyDemoAccounts} disabled={submitting} onSelect={handleDemo} />
      </div>

      <p className="mt-8 border-t border-slate-900/[0.06] pt-6 text-sm text-slate-500">
        Vous etes un client ?{" "}
        <Link className="font-semibold text-slate-900 underline-offset-4 hover:underline" to={buildClientPath("/login")}>
          Espace client
        </Link>
      </p>
    </AuthShell>
  );
}
