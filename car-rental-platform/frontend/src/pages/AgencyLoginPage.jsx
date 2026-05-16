import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Building2, KeyRound, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useThemeSettings } from "../context/ThemeContext";
import FormField from "../components/FormField";

export default function AgencyLoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { slug } = useParams();
  const { activeAgency, buildClientPath } = useThemeSettings();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const user = await login({ ...form, portal: "agency", agencySlug: slug || undefined });
      navigate(user.type === "SUPER_ADMIN" ? "/super-admin/dashboard" : "/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Connexion agence impossible.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-soft md:p-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div className="rounded-[1.8rem] bg-slate-950 p-8 text-white">
          <span className="inline-flex rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-300">
            Espace agence
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight">Connexion admin / employe</h1>
          <p className="mt-4 text-base leading-relaxed text-slate-300">
            Accedez au tableau de bord de votre agence pour gerer les clients, reservations, voitures et parametres.
          </p>
          {slug ? (
            <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Agence dediee</p>
              <p className="mt-2 text-lg font-semibold text-white">{activeAgency?.name || slug}</p>
              <p className="mt-1 text-sm text-slate-300">Seuls les comptes rattaches a cette agence peuvent se connecter ici.</p>
            </div>
          ) : null}
          <div className="mt-8 grid gap-3">
            {[
              ["Admin agence", "Pilotage complet de l'activite"],
              ["Employe", "Acces limite selon les permissions"],
              ["Super admin", "Vision reseau et parametres globaux"]
            ].map(([label, hint]) => (
              <div key={label} className="flex items-start gap-3 rounded-2xl bg-white/5 px-4 py-3">
                <ShieldCheck size={18} className="mt-0.5 text-slate-200" />
                <div>
                  <p className="font-medium text-white">{label}</p>
                  <p className="text-sm text-slate-400">{hint}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-semibold text-slate-950">Se connecter a l'agence</h2>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <FormField label="Email professionnel">
              <div className="relative">
                <Building2 size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
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
              Vous etes un client ?{" "}
              <Link className="font-semibold text-teal-700" to={buildClientPath("/login")}>
                Retour a l'espace client
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
