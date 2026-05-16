import { useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { KeyRound, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useThemeSettings } from "../context/ThemeContext";
import FormField from "../components/FormField";

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

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login({ ...form, portal: "client", agencySlug: slug || undefined });
      navigate(buildClientPath("/"));
    } catch (err) {
      setError(err.response?.data?.message || "Connexion client impossible.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-soft md:p-10">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="rounded-[1.8rem] bg-slate-950 p-8 text-white">
          <span className="inline-flex rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-300">
            Espace client
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight">Connexion client</h1>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            Connectez-vous pour suivre vos reservations, consulter vos demandes et retrouver vos informations personnelles.
          </p>
          {slug ? (
            <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Portail dedie</p>
              <p className="mt-2 text-lg font-semibold text-white">{activeAgency?.name || slug}</p>
              <p className="mt-1 text-sm text-slate-300">Ce client ne voit que le catalogue et les reservations de cette agence.</p>
            </div>
          ) : null}
          <div className="mt-8 rounded-[1.6rem] bg-white/5 p-5">
            <p className="text-sm text-slate-300">Vous n'avez pas encore de compte ?</p>
            <Link className="mt-3 inline-flex rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-950" to={slug ? registerPath : (agencyFromQuery ? `/register?agency=${agencyFromQuery}` : "/register")}>
              Creer mon compte client
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-semibold text-slate-950">Se connecter</h2>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <FormField label="Email">
              <div className="relative">
                <UserRound size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input className="input pl-11" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </FormField>
            <FormField label="Mot de passe">
              <div className="relative">
                <KeyRound size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input className="input pl-11" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </div>
            </FormField>
            {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
            <button disabled={submitting} className="btn-primary w-full disabled:opacity-60">
              {submitting ? "Connexion..." : "Se connecter"}
            </button>
            <p className="text-sm text-slate-500">
              Vous etes un admin ou un employe ?{" "}
              <Link className="font-semibold text-teal-700" to={agencyLoginPath}>
                Acceder a l'espace agence
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
