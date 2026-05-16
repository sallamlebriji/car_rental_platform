import { useEffect, useMemo, useState } from "react";
import { Building2, CheckCircle2, MapPinned, UserRound } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useThemeSettings } from "../context/ThemeContext";
import { useFetch } from "../hooks/useFetch";
import FormField from "../components/FormField";

const emptyForm = {
  agencyId: "",
  agencySlug: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
  city: "",
  address: "",
  cinOrPassport: "",
  driverLicense: ""
};

export default function RegisterPage() {
  const { register } = useAuth();
  const { data: agenciesData } = useFetch("/agencies/public/list", []);
  const { slug } = useParams();
  const { activeAgency, buildClientPath } = useThemeSettings();
  const agencies = Array.isArray(agenciesData) ? agenciesData : [];
  const [searchParams] = useSearchParams();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    ...emptyForm,
    agencySlug: slug || ""
  });

  const selectedAgency = useMemo(
    () => (slug ? activeAgency : agencies.find((agency) => agency.id === form.agencyId)),
    [activeAgency, agencies, form.agencyId, slug]
  );

  useEffect(() => {
    if (slug) {
      setForm((current) => ({
        ...current,
        agencyId: activeAgency?.id || "",
        agencySlug: slug
      }));
      return;
    }

    const agencyFromQuery = searchParams.get("agency");
    if (agencyFromQuery && agencies.some((agency) => agency.id === agencyFromQuery) && form.agencyId !== agencyFromQuery) {
      setForm((current) => ({ ...current, agencyId: agencyFromQuery, agencySlug: "" }));
    }
  }, [activeAgency?.id, agencies, form.agencyId, searchParams, slug]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const response = await register(form);
      setSuccess(response.message || "Votre demande d'inscription a ete envoyee.");
      setForm({
        ...emptyForm,
        agencyId: slug ? activeAgency?.id || "" : "",
        agencySlug: slug || ""
      });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Impossible d'envoyer la demande d'inscription.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-soft md:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="rounded-[1.8rem] bg-slate-950 p-8 text-white">
            <span className="inline-flex rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-300">
              Inscription client
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight">Creer un compte client</h1>
            <p className="mt-4 text-base leading-relaxed text-slate-300">
              {slug
                ? "Votre compte sera rattache a cette agence. Completez votre profil puis attendez la validation par l'admin de cette agence."
                : "Choisissez votre agence, completez votre profil, puis attendez la validation par l'admin de l'agence."}
            </p>

            <div className="mt-8 space-y-3">
              {[
                slug ? "Le client reste limite a cette seule agence" : "Le client choisit une agence lors de l'inscription",
                "Le compte est cree en attente de validation",
                "L'admin agence l'active depuis l'espace clients"
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3">
                  <CheckCircle2 size={18} className="text-emerald-300" />
                  <span className="text-sm text-slate-200">{item}</span>
                </div>
              ))}
            </div>

            {selectedAgency ? (
              <div className="mt-8 rounded-[1.6rem] bg-white/5 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Agence rattachee</p>
                <h2 className="mt-3 text-2xl font-semibold">{selectedAgency.name}</h2>
                <p className="mt-2 text-sm text-slate-300">
                  {[selectedAgency.city, selectedAgency.country].filter(Boolean).join(", ") || "Maroc"}
                </p>
              </div>
            ) : null}
          </div>

          <div>
            <h2 className="text-3xl font-semibold text-slate-950">Demande d'inscription</h2>
            <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
              {slug ? (
                <FormField label="Agence rattachee">
                  <div className="flex min-h-14 items-center gap-3 rounded-[1.3rem] border border-slate-200 bg-slate-50 px-4">
                    <Building2 size={18} className="text-slate-400" />
                    <div>
                      <p className="font-medium text-slate-900">{selectedAgency?.name || "Agence en chargement"}</p>
                      <p className="text-xs text-slate-500">{[selectedAgency?.city, selectedAgency?.country].filter(Boolean).join(", ") || "Portail dedie"}</p>
                    </div>
                  </div>
                </FormField>
              ) : (
                <FormField label="Agence">
                  <div className="relative">
                    <Building2 size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select className="input pl-11" value={form.agencyId} onChange={(e) => setForm({ ...form, agencyId: e.target.value, agencySlug: "" })}>
                      <option value="">Choisir une agence</option>
                      {agencies.map((agency) => (
                        <option key={agency.id} value={agency.id}>
                          {agency.name} {agency.city ? `- ${agency.city}` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </FormField>
              )}

              {[
                ["Prenom", "firstName", "text", UserRound],
                ["Nom", "lastName", "text", UserRound],
                ["Email", "email", "email", UserRound],
                ["Mot de passe", "password", "password", UserRound],
                ["Telephone", "phone", "text", UserRound],
                ["Ville", "city", "text", MapPinned],
                ["Adresse", "address", "text", MapPinned],
                ["CIN / Passeport", "cinOrPassport", "text", UserRound],
                ["Permis de conduire", "driverLicense", "text", UserRound]
              ].map(([label, key, type, Icon]) => (
                <FormField key={key} label={label}>
                  <div className="relative">
                    <Icon size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input className="input pl-11" type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
                  </div>
                </FormField>
              ))}

              {success ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 md:col-span-2">{success}</p> : null}
              {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 md:col-span-2">{error}</p> : null}

              <button className="btn-primary md:col-span-2" disabled={submitting}>
                {submitting ? "Envoi..." : "Envoyer la demande d'inscription"}
              </button>
            </form>

            <p className="mt-4 text-sm text-slate-500">
              Vous avez deja un compte ?{" "}
              <Link className="font-semibold text-teal-700" to={buildClientPath("/login")}>
                Se connecter a l'espace client
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
