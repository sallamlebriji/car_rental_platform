import { useEffect, useState } from "react";
import {
  BellRing,
  Building2,
  Eye,
  KeyRound,
  Palette,
  Save,
  ShieldCheck
} from "lucide-react";
import api from "../api/client";
import ControlCenterHero from "../components/ControlCenterHero";
import { useFetch } from "../hooks/useFetch";

function SettingsSection({ icon: Icon, title, subtitle, children }) {
  return (
    <section className="card overflow-hidden">
      <div className="border-b border-slate-100 px-6 py-5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-2xl bg-slate-100 p-3 text-slate-600">{Icon ? <Icon size={18} /> : null}</div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
            {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
          </div>
        </div>
      </div>
      <div className="grid gap-5 p-6">{children}</div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="space-y-2.5">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  );
}

export default function AdminSettingsPage() {
  const { data: settings, loading } = useFetch("/settings", []);
  const [message, setMessage] = useState("");
  const [savingSection, setSavingSection] = useState("");
  const [agencyForm, setAgencyForm] = useState({
    agencyName: "",
    slogan: "",
    address: "",
    phone: "",
    email: "",
    website: ""
  });
  const [visualForm, setVisualForm] = useState({
    primaryColor: "#0f766e",
    secondaryColor: "#f59e0b",
    homepageText: "",
    primaryButtonText: ""
  });
  const [reservationForm, setReservationForm] = useState({
    minimumRentalDays: 1,
    maximumRentalDays: 30,
    bookingFees: 0,
    requiredAdvancePercent: 20,
    defaultDepositAmount: 3000,
    reservationSuccessMessage: ""
  });
  const [notificationForm, setNotificationForm] = useState({
    autoClientMessage: "",
    autoAdminMessage: "",
    emailNotificationsEnabled: false,
    whatsappNotificationsEnabled: false,
    internalNotificationsEnabled: true
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (!settings) return;
    setAgencyForm({
      agencyName: settings.agency?.agencyName || "",
      slogan: settings.agency?.slogan || "",
      address: settings.agency?.address || "",
      phone: settings.agency?.phone || "",
      email: settings.agency?.email || "",
      website: settings.agency?.website || ""
    });
    setVisualForm({
      primaryColor: settings.visual?.primaryColor || "#0f766e",
      secondaryColor: settings.visual?.secondaryColor || "#f59e0b",
      homepageText: settings.visual?.homepageText || "",
      primaryButtonText: settings.visual?.primaryButtonText || ""
    });
    setReservationForm({
      minimumRentalDays: settings.reservation?.minimumRentalDays || 1,
      maximumRentalDays: settings.reservation?.maximumRentalDays || 30,
      bookingFees: Number(settings.reservation?.bookingFees || 0),
      requiredAdvancePercent: Number(settings.reservation?.requiredAdvancePercent || 20),
      defaultDepositAmount: Number(settings.reservation?.defaultDepositAmount || 3000),
      reservationSuccessMessage: settings.reservation?.reservationSuccessMessage || ""
    });
    setNotificationForm({
      autoClientMessage: settings.notifications?.autoClientMessage || "",
      autoAdminMessage: settings.notifications?.autoAdminMessage || "",
      emailNotificationsEnabled: Boolean(settings.notifications?.emailNotificationsEnabled),
      whatsappNotificationsEnabled: Boolean(settings.notifications?.whatsappNotificationsEnabled),
      internalNotificationsEnabled: settings.notifications?.internalNotificationsEnabled ?? true
    });
  }, [settings]);

  async function saveAgencySettings() {
    setSavingSection("agency");
    setMessage("");
    try {
      await api.put("/settings/agency", agencyForm);
      setMessage("Informations agence enregistrees.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Impossible d'enregistrer les informations agence.");
    } finally {
      setSavingSection("");
    }
  }

  async function saveVisualSettings() {
    setSavingSection("visual");
    setMessage("");
    try {
      await api.put("/settings/visual", visualForm);
      setMessage("Parametres visuels enregistres.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Impossible d'enregistrer les parametres visuels.");
    } finally {
      setSavingSection("");
    }
  }

  async function saveReservationSettings() {
    setSavingSection("reservation");
    setMessage("");
    try {
      await api.put("/settings/reservation", {
        ...reservationForm,
        minimumRentalDays: Number(reservationForm.minimumRentalDays),
        maximumRentalDays: Number(reservationForm.maximumRentalDays),
        bookingFees: Number(reservationForm.bookingFees),
        requiredAdvancePercent: Number(reservationForm.requiredAdvancePercent),
        defaultDepositAmount: Number(reservationForm.defaultDepositAmount)
      });
      setMessage("Parametres de reservation enregistres.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Impossible d'enregistrer les parametres de reservation.");
    } finally {
      setSavingSection("");
    }
  }

  async function saveNotificationSettings() {
    setSavingSection("notifications");
    setMessage("");
    try {
      await api.put("/settings/notifications", notificationForm);
      setMessage("Parametres de notification enregistres.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Impossible d'enregistrer les notifications.");
    } finally {
      setSavingSection("");
    }
  }

  async function changeMyPassword() {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      setMessage("Renseignez le mot de passe actuel et le nouveau mot de passe.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage("La confirmation du nouveau mot de passe ne correspond pas.");
      return;
    }

    setSavingSection("password");
    setMessage("");
    try {
      const response = await api.post("/auth/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setMessage(response.data.message || "Mot de passe mis a jour.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Impossible de modifier le mot de passe.");
    } finally {
      setSavingSection("");
    }
  }

  if (loading || !settings) return <div className="card p-8">Chargement des parametres...</div>;

  const heroMetrics = [
    {
      label: "Identite agence",
      value: agencyForm.agencyName || "A completer",
      hint: "Nom principal actuellement visible sur la plateforme.",
      icon: Building2
    },
    {
      label: "Theme actif",
      value: visualForm.primaryColor || "#0f766e",
      hint: "Couleur dominante appliquee a l'experience client.",
      icon: Palette
    },
    {
      label: "Reservation min.",
      value: `${reservationForm.minimumRentalDays || 1} j`,
      hint: "Seuil minimal applique aux nouvelles demandes.",
      icon: ShieldCheck
    },
    {
      label: "Notifications",
      value: notificationForm.emailNotificationsEnabled ? "Email actif" : "Email inactif",
      hint: "Statut du canal principal de notification.",
      icon: BellRing
    }
  ];

  return (
    <div className="space-y-8">
      <ControlCenterHero
        badge="Pilotage agence"
        title="Parametres"
        description="Ajustez l'identite de l'agence, l'experience visuelle, les regles de reservation et la couche de notification depuis un seul espace coherent."
        metrics={heroMetrics}
        tone="admin"
      />

      {message ? <div className="card px-5 py-4 text-sm font-medium text-slate-700">{message}</div> : null}

      <div className="grid gap-6">
        <SettingsSection icon={Building2} title="Agence" subtitle="Coordonnees et identite visibles sur la plateforme">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nom de l'agence">
              <input className="input" value={agencyForm.agencyName} onChange={(event) => setAgencyForm({ ...agencyForm, agencyName: event.target.value })} />
            </Field>
            <Field label="Slogan">
              <input className="input" value={agencyForm.slogan} onChange={(event) => setAgencyForm({ ...agencyForm, slogan: event.target.value })} />
            </Field>
            <Field label="Adresse">
              <input className="input" value={agencyForm.address} onChange={(event) => setAgencyForm({ ...agencyForm, address: event.target.value })} />
            </Field>
            <Field label="Telephone">
              <input className="input" value={agencyForm.phone} onChange={(event) => setAgencyForm({ ...agencyForm, phone: event.target.value })} />
            </Field>
            <Field label="Email">
              <input className="input" value={agencyForm.email} onChange={(event) => setAgencyForm({ ...agencyForm, email: event.target.value })} />
            </Field>
            <Field label="Site web">
              <input className="input" value={agencyForm.website} onChange={(event) => setAgencyForm({ ...agencyForm, website: event.target.value })} />
            </Field>
          </div>
          <button className="btn-primary gap-2" onClick={saveAgencySettings} disabled={savingSection === "agency"}>
            <Save size={18} />
            {savingSection === "agency" ? "Enregistrement..." : "Enregistrer l'agence"}
          </button>
        </SettingsSection>

        <SettingsSection icon={Palette} title="Visuel" subtitle="Couleurs et elements d'interface de l'agence">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Couleur principale">
              <input type="color" className="input h-12" value={visualForm.primaryColor} onChange={(event) => setVisualForm({ ...visualForm, primaryColor: event.target.value })} />
            </Field>
            <Field label="Couleur secondaire">
              <input type="color" className="input h-12" value={visualForm.secondaryColor} onChange={(event) => setVisualForm({ ...visualForm, secondaryColor: event.target.value })} />
            </Field>
            <Field label="Texte page d'accueil">
              <textarea className="input min-h-28 resize-y" value={visualForm.homepageText} onChange={(event) => setVisualForm({ ...visualForm, homepageText: event.target.value })} />
            </Field>
            <Field label="Texte du bouton principal">
              <input className="input" value={visualForm.primaryButtonText} onChange={(event) => setVisualForm({ ...visualForm, primaryButtonText: event.target.value })} />
            </Field>
          </div>

          <div className="rounded-[1.8rem] border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-white p-3 text-slate-600">
                <Eye size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Apercu rapide</p>
                <div
                  className="mt-4 overflow-hidden rounded-[1.6rem] p-5 text-white"
                  style={{ background: `linear-gradient(135deg, ${visualForm.primaryColor || "#0f766e"} 0%, ${visualForm.secondaryColor || "#f59e0b"} 100%)` }}
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-white/80">Accueil client</p>
                  <h3 className="mt-3 text-2xl font-semibold">Atlas Drive</h3>
                  <p className="mt-3 max-w-xl text-sm text-white/90">
                    {visualForm.homepageText || "Decouvrez une flotte moderne, flexible et prete a etre reservee."}
                  </p>
                  <span className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950">
                    {visualForm.primaryButtonText || "Reserver maintenant"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button className="btn-primary gap-2" onClick={saveVisualSettings} disabled={savingSection === "visual"}>
            <Save size={18} />
            {savingSection === "visual" ? "Enregistrement..." : "Enregistrer le visuel"}
          </button>
        </SettingsSection>

        <SettingsSection icon={ShieldCheck} title="Reservation" subtitle="Regles operationnelles et montant d'avance">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Duree minimale">
              <input type="number" className="input" value={reservationForm.minimumRentalDays} onChange={(event) => setReservationForm({ ...reservationForm, minimumRentalDays: event.target.value })} />
            </Field>
            <Field label="Duree maximale">
              <input type="number" className="input" value={reservationForm.maximumRentalDays} onChange={(event) => setReservationForm({ ...reservationForm, maximumRentalDays: event.target.value })} />
            </Field>
            <Field label="Frais de reservation">
              <input type="number" className="input" value={reservationForm.bookingFees} onChange={(event) => setReservationForm({ ...reservationForm, bookingFees: event.target.value })} />
            </Field>
            <Field label="Pourcentage d'avance">
              <input type="number" className="input" value={reservationForm.requiredAdvancePercent} onChange={(event) => setReservationForm({ ...reservationForm, requiredAdvancePercent: event.target.value })} />
            </Field>
            <Field label="Caution par defaut">
              <input type="number" className="input" value={reservationForm.defaultDepositAmount} onChange={(event) => setReservationForm({ ...reservationForm, defaultDepositAmount: event.target.value })} />
            </Field>
            <Field label="Message apres reservation">
              <textarea className="input min-h-28 resize-y" value={reservationForm.reservationSuccessMessage} onChange={(event) => setReservationForm({ ...reservationForm, reservationSuccessMessage: event.target.value })} />
            </Field>
          </div>
          <button className="btn-primary gap-2" onClick={saveReservationSettings} disabled={savingSection === "reservation"}>
            <Save size={18} />
            {savingSection === "reservation" ? "Enregistrement..." : "Enregistrer la reservation"}
          </button>
        </SettingsSection>

        <SettingsSection icon={BellRing} title="Notifications" subtitle="Messages internes et clients pour le suivi des reservations">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Message automatique client">
              <textarea className="input min-h-28 resize-y" value={notificationForm.autoClientMessage} onChange={(event) => setNotificationForm({ ...notificationForm, autoClientMessage: event.target.value })} />
            </Field>
            <Field label="Message automatique admin">
              <textarea className="input min-h-28 resize-y" value={notificationForm.autoAdminMessage} onChange={(event) => setNotificationForm({ ...notificationForm, autoAdminMessage: event.target.value })} />
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["emailNotificationsEnabled", "Notifications email"],
              ["whatsappNotificationsEnabled", "Notifications WhatsApp"],
              ["internalNotificationsEnabled", "Notifications internes"]
            ].map(([key, label]) => (
              <label key={key} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <span className="text-sm font-medium text-slate-700">{label}</span>
                <input
                  type="checkbox"
                  checked={notificationForm[key]}
                  onChange={(event) => setNotificationForm({ ...notificationForm, [key]: event.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-teal-600"
                />
              </label>
            ))}
          </div>

          <button className="btn-primary gap-2" onClick={saveNotificationSettings} disabled={savingSection === "notifications"}>
            <Save size={18} />
            {savingSection === "notifications" ? "Enregistrement..." : "Enregistrer les notifications"}
          </button>
        </SettingsSection>

        <SettingsSection icon={KeyRound} title="Securite du compte" subtitle="Changer le mot de passe du compte actuellement connecte">
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Mot de passe actuel">
              <input type="password" className="input" value={passwordForm.currentPassword} onChange={(event) => setPasswordForm({ ...passwordForm, currentPassword: event.target.value })} />
            </Field>
            <Field label="Nouveau mot de passe">
              <input type="password" className="input" value={passwordForm.newPassword} onChange={(event) => setPasswordForm({ ...passwordForm, newPassword: event.target.value })} />
            </Field>
            <Field label="Confirmer le nouveau mot de passe">
              <input type="password" className="input" value={passwordForm.confirmPassword} onChange={(event) => setPasswordForm({ ...passwordForm, confirmPassword: event.target.value })} />
            </Field>
          </div>
          <button className="btn-primary gap-2" onClick={changeMyPassword} disabled={savingSection === "password"}>
            <Save size={18} />
            {savingSection === "password" ? "Mise a jour..." : "Changer mon mot de passe"}
          </button>
        </SettingsSection>
      </div>
    </div>
  );
}
