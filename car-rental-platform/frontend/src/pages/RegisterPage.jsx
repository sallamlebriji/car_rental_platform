import { useEffect, useMemo, useState } from "react";
import { Building2, CheckCircle2, IdCard, KeyRound, Mail, MapPinned, Phone, UserRound } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useThemeSettings } from "../context/ThemeContext";
import { useFetch } from "../hooks/useFetch";
import FormField from "../components/FormField";
import AuthShell from "../components/client/AuthShell";

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

  const fields = [
    ["Prenom", "firstName", "text", UserRound, "given-name"],
    ["Nom", "lastName", "text", UserRound, "family-name"],
    ["Email", "email", "email", Mail, "email"],
    ["Mot de passe", "password", "password", KeyRound, "new-password"],
    ["Telephone", "phone", "tel", Phone, "tel"],
    ["Ville", "city", "text", MapPinned, "address-level2"],
    ["Adresse", "address", "text", MapPinned, "street-address"],
    ["CIN / Passeport", "cinOrPassport", "text", IdCard, "off"],
    ["Permis de conduire", "driverLicense", "text", IdCard, "off"]
  ];

  return (
    <AuthShell
      wide
      eyebrow="Inscription client"
      title="Creez votre espace client"
      description={
        slug
          ? "Votre compte sera rattache a cette agence et active apres validation par son equipe."
          : "Choisissez votre agence, completez votre profil, puis attendez la validation par l'agence."
      }
      aside={
        <div className="space-y-3">
          {[
            slug ? "Compte limite a cette seule agence" : "Choix de l'agence a l'inscription",
            "Compte cree en attente de validation",
            "Activation par l'agence depuis son espace"
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 text-sm text-white/80">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-300" />
              {item}
            </div>
          ))}
          {selectedAgency ? (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-xs text-white/50">Agence rattachee</p>
              <p className="mt-1 font-display text-lg font-bold">{selectedAgency.name}</p>
              <p className="text-sm text-white/60">{[selectedAgency.city, selectedAgency.country].filter(Boolean).join(", ") || "Maroc"}</p>
            </div>
          ) : null}
        </div>
      }
    >
      <h2 className="hidden font-display text-2xl font-bold tracking-tight text-slate-900 lg:block">Demande d'inscription</h2>
      <p className="mt-1 hidden text-sm text-slate-500 lg:block">Quelques informations pour preparer vos futurs contrats.</p>

      <form className="mt-8 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
        <div className="sm:col-span-2">
          {slug ? (
            <FormField label="Agence rattachee">
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
                <Building2 size={17} className="text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-900">{selectedAgency?.name || "Agence en chargement"}</p>
                  <p className="text-xs text-slate-500">{[selectedAgency?.city, selectedAgency?.country].filter(Boolean).join(", ") || "Portail dedie"}</p>
                </div>
              </div>
            </FormField>
          ) : (
            <FormField label="Agence">
              <div className="relative">
                <Building2 size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <select className="input !pl-11" value={form.agencyId} onChange={(e) => setForm({ ...form, agencyId: e.target.value, agencySlug: "" })}>
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
        </div>

        {fields.map(([label, key, type, Icon, autoComplete]) => (
          <div key={key} className={key === "address" ? "sm:col-span-2" : ""}>
            <FormField label={label}>
              <div className="relative">
                <Icon size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input className="input !pl-11" type={type} autoComplete={autoComplete} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
              </div>
            </FormField>
          </div>
        ))}

        {success ? <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 sm:col-span-2">{success}</p> : null}
        {error ? <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 sm:col-span-2">{error}</p> : null}

        <button className="btn-primary !py-3 disabled:opacity-60 sm:col-span-2" disabled={submitting}>
          {submitting ? "Envoi..." : "Envoyer la demande d'inscription"}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-500">
        Vous avez deja un compte ?{" "}
        <Link className="font-semibold text-slate-900 underline-offset-4 hover:underline" to={buildClientPath("/login")}>
          Se connecter
        </Link>
      </p>
    </AuthShell>
  );
}
