import { useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { KeyRound, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useThemeSettings } from "../context/ThemeContext";
import FormField from "../components/FormField";
import AuthShell from "../components/client/AuthShell";
import DemoAccounts, { clientDemoAccounts } from "../components/DemoAccounts";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const agencyFromQuery = searchParams.get("agency");
  const { activeAgency, buildClientPath, portalBasePath } = useThemeSettings();
  const registerPath = buildClientPath("/register");
  const agencyLoginPath = slug ? `${portalBasePath}/admin/login` : "/admin/login";

  async function submitCredentials(credentials) {
    setError("");
    setSubmitting(true);

    try {
      await login({ ...credentials, portal: "client", agencySlug: slug || undefined });
      navigate(buildClientPath("/"));
    } catch (err) {
      setError(err.response?.data?.message || "Connexion client impossible.");
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
      eyebrow={slug ? `Portail ${activeAgency?.name || slug}` : "Espace client"}
      title="Bon retour parmi nous"
      description="Suivez vos reservations, vos documents et vos informations personnelles en un seul endroit."
    >
      <h2 className="hidden font-display text-2xl font-bold tracking-tight text-slate-900 lg:block">Se connecter</h2>
      <p className="mt-1 hidden text-sm text-slate-500 lg:block">Accedez a votre espace client.</p>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <FormField label="Email">
          <div className="relative">
            <UserRound size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
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
        <DemoAccounts accounts={clientDemoAccounts} disabled={submitting} onSelect={handleDemo} />
      </div>

      <div className="mt-8 space-y-2 border-t border-slate-900/[0.06] pt-6 text-sm text-slate-500">
        <p>
          Pas encore de compte ?{" "}
          <Link className="font-semibold text-slate-900 underline-offset-4 hover:underline" to={slug ? registerPath : (agencyFromQuery ? `/register?agency=${agencyFromQuery}` : "/register")}>
            Creer un compte client
          </Link>
        </p>
        <p>
          Admin ou employe ?{" "}
          <Link className="font-semibold text-slate-900 underline-offset-4 hover:underline" to={agencyLoginPath}>
            Espace agence
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
