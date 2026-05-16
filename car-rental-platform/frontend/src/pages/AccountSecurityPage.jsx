import { useState } from "react";
import { KeyRound, Lock, Save, ShieldCheck } from "lucide-react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";

function SecurityField({ label, icon: Icon, value, onChange, placeholder }) {
  return (
    <label className="space-y-2.5">
      <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
        {Icon ? <Icon size={16} className="text-slate-400" /> : null}
        {label}
      </span>
      <input
        type="password"
        className="input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </label>
  );
}

export default function AccountSecurityPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError("Renseignez tous les champs de securite.");
      return;
    }

    if (form.newPassword.length < 6) {
      setError("Le nouveau mot de passe doit contenir au moins 6 caracteres.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("La confirmation ne correspond pas au nouveau mot de passe.");
      return;
    }

    setSaving(true);
    try {
      const response = await api.post("/auth/change-password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      });
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setMessage(response.data.message || "Mot de passe mis a jour.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Impossible de modifier le mot de passe.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <span className="inline-flex rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-500">
          Mon compte
        </span>
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">Securite du compte</h1>
          <p className="mt-2 max-w-3xl text-lg leading-relaxed text-slate-500">
            Modifiez le mot de passe du compte actuellement connecte en toute securite.
          </p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
        <div className="card overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-slate-100 p-3 text-slate-500">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Profil connecte</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Informations de la session actuelle.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 p-6">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Nom complet</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {user?.firstName} {user?.lastName}
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Email</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{user?.email}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Type de compte</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{user?.type || "-"}</p>
            </div>
          </div>
        </div>

        <form className="card overflow-hidden" onSubmit={handleSubmit}>
          <div className="border-b border-slate-100 px-6 py-5">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-teal-50 p-3 text-teal-600">
                <KeyRound size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Changer le mot de passe</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Saisissez votre mot de passe actuel puis definissez un nouveau secret.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-6">
            <div className="grid gap-4 md:grid-cols-3">
              <SecurityField
                label="Mot de passe actuel"
                icon={Lock}
                value={form.currentPassword}
                onChange={(event) => setForm({ ...form, currentPassword: event.target.value })}
                placeholder="Votre mot de passe actuel"
              />
              <SecurityField
                label="Nouveau mot de passe"
                icon={KeyRound}
                value={form.newPassword}
                onChange={(event) => setForm({ ...form, newPassword: event.target.value })}
                placeholder="Minimum 6 caracteres"
              />
              <SecurityField
                label="Confirmer le nouveau mot de passe"
                icon={ShieldCheck}
                value={form.confirmPassword}
                onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
                placeholder="Retapez le nouveau mot de passe"
              />
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm leading-relaxed text-slate-600">
              Ce changement s'applique uniquement au compte actuellement connecte. Pour un employe, utilisez
              le bouton de reinitialisation depuis la page <span className="font-semibold text-slate-900">Employes</span>.
            </div>

            {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
            {message ? <p className="text-sm font-medium text-emerald-700">{message}</p> : null}

            <div className="flex justify-end">
              <button className="btn-primary gap-2" type="submit" disabled={saving}>
                <Save size={18} />
                {saving ? "Mise a jour..." : "Changer mon mot de passe"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
