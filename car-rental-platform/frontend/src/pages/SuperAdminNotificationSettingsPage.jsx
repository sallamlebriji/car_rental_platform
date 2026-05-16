import { BellRing, Mail, MessageSquareText, Save, ServerCog, ShieldCheck } from "lucide-react";
import { useState } from "react";
import api from "../api/client";
import ControlCenterHero from "../components/ControlCenterHero";
import { useFetch } from "../hooks/useFetch";

function Field({ label, children, hint }) {
  return (
    <label className="space-y-2.5">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      {children}
      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
    </label>
  );
}

export default function SuperAdminNotificationSettingsPage() {
  const { data: notifications, setData } = useFetch("/settings/notifications", []);
  const [saved, setSaved] = useState(false);

  if (!notifications) return <div className="card p-8">Chargement...</div>;

  async function handleSave() {
    const response = await api.put("/settings/notifications", notifications);
    setData(response.data);
    setSaved(true);
  }

  const heroMetrics = [
    {
      label: "Email",
      value: notifications.emailNotificationsEnabled ? "Actif" : "Inactif",
      hint: "Canal principal pour les confirmations et relances.",
      icon: Mail
    },
    {
      label: "WhatsApp",
      value: notifications.whatsappNotificationsEnabled ? "Actif" : "Inactif",
      hint: "Messages courts et rappels operationnels.",
      icon: MessageSquareText
    },
    {
      label: "Interne",
      value: notifications.internalNotificationsEnabled ? "Actif" : "Inactif",
      hint: "Alertes visibles dans l'espace de travail interne.",
      icon: ShieldCheck
    }
  ];

  return (
    <div className="space-y-8">
      <ControlCenterHero
        badge="Canaux et automatisations"
        title="Notifications"
        description="Orchestrez les canaux d'envoi, la configuration SMTP et les messages automatiques du reseau depuis une interface claire."
        metrics={heroMetrics}
        tone="super"
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="space-y-6">
          <div className="card overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">
                  <BellRing size={18} />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Canaux de notification</h2>
                  <p className="mt-1 text-sm text-slate-500">Activez les canaux qui seront exposes a l'ensemble des agences.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-6">
              {[
                ["Email de notification", "emailNotificationsEnabled", "Utilise le serveur SMTP configure ci-dessous."],
                ["Notifications WhatsApp", "whatsappNotificationsEnabled", "Pour les confirmations, rappels et messages courts."],
                ["Notifications internes", "internalNotificationsEnabled", "Affiche les alertes dans l'espace admin."]
              ].map(([label, key, hint]) => (
                <label key={key} className="flex items-center justify-between gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-4">
                  <div>
                    <p className="font-medium text-slate-900">{label}</p>
                    <p className="text-sm text-slate-500">{hint}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(notifications[key])}
                    onChange={(e) => setData({ ...notifications, [key]: e.target.checked })}
                    className="h-5 w-5"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">
                  <ServerCog size={18} />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Configuration SMTP</h2>
                  <p className="mt-1 text-sm text-slate-500">Infrastructure email partagee pour les notifications du reseau.</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 p-6 md:grid-cols-2">
              {[
                ["Serveur SMTP", "smtpHost", "smtp.agence.ma"],
                ["Port SMTP", "smtpPort", "587"],
                ["Utilisateur SMTP", "smtpUser", "noreply@agence.ma"],
                ["Mot de passe SMTP", "smtpPassword", "********"]
              ].map(([label, key, placeholder]) => (
                <Field key={key} label={label}>
                  <input
                    className="input"
                    type={key === "smtpPassword" ? "password" : key === "smtpPort" ? "number" : "text"}
                    placeholder={placeholder}
                    value={notifications[key] || ""}
                    onChange={(e) =>
                      setData({
                        ...notifications,
                        [key]: key === "smtpPort" ? Number(e.target.value) : e.target.value
                      })
                    }
                  />
                </Field>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="card overflow-hidden">
            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">
                  <MessageSquareText size={18} />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900">Messages automatiques</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Personnalisez les messages utilises pour informer le client et l'administrateur.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 p-6">
              <Field label="Message automatique client" hint="Exemple de texte envoye apres une nouvelle reservation.">
                <textarea
                  className="input min-h-40"
                  rows="5"
                  value={notifications.autoClientMessage || ""}
                  onChange={(e) => setData({ ...notifications, autoClientMessage: e.target.value })}
                  placeholder="Merci pour votre reservation. Notre equipe reviendra vers vous rapidement."
                />
              </Field>

              <Field label="Message automatique admin" hint="Message interne ou email pour alerter l'equipe.">
                <textarea
                  className="input min-h-40"
                  rows="5"
                  value={notifications.autoAdminMessage || ""}
                  onChange={(e) => setData({ ...notifications, autoAdminMessage: e.target.value })}
                  placeholder="Nouvelle reservation a traiter dans le tableau de bord."
                />
              </Field>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex flex-wrap items-center gap-3">
              <button className="btn-primary min-w-52 gap-2" onClick={handleSave}>
                <Save size={18} />
                Enregistrer les notifications
              </button>
              {saved ? <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">Mise a jour effectuee.</span> : null}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
