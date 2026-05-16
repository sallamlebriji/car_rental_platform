import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Ban,
  CalendarRange,
  CarFront,
  CircleDollarSign,
  FileDown,
  FileText,
  IdCard,
  Mail,
  MapPinned,
  NotebookPen,
  Phone,
  Save,
  ShieldAlert,
  UserRound
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import api from "../api/client";
import StatusBadge from "../components/StatusBadge";
import { currency, date } from "../utils/format";

const statusActions = [
  { value: "CONFIRMED", label: "Valider", icon: BadgeCheck, className: "border-emerald-200 text-emerald-700 hover:bg-emerald-50" },
  { value: "REFUSED", label: "Refuser", icon: Ban, className: "border-rose-200 text-rose-600 hover:bg-rose-50" },
  { value: "CANCELLED", label: "Annuler", icon: ShieldAlert, className: "border-slate-200 text-slate-600 hover:bg-slate-50" },
  { value: "COMPLETED", label: "Terminer", icon: BadgeCheck, className: "border-sky-200 text-sky-700 hover:bg-sky-50" }
];

function InfoCard({ title, subtitle, children }) {
  return (
    <section className="card overflow-hidden">
      <div className="border-b border-slate-100 px-6 py-5">
        <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
      <div className="mt-0.5 text-slate-400">{Icon ? <Icon size={16} /> : null}</div>
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{label}</p>
        <p className="mt-1 text-sm font-medium text-slate-800">{value || "Non renseigne"}</p>
      </div>
    </div>
  );
}

export default function AdminReservationDetailsPage() {
  const { id } = useParams();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);
  const [generatingContract, setGeneratingContract] = useState(false);
  const [form, setForm] = useState({
    finalPrice: "",
    internalNote: ""
  });

  useEffect(() => {
    let active = true;
    setLoading(true);

    api.get(`/reservations/${id}`)
      .then((response) => {
        if (!active) return;
        setReservation(response.data);
        setForm({
          finalPrice: response.data.finalPrice ? Number(response.data.finalPrice) : "",
          internalNote: response.data.internalNote || ""
        });
      })
      .catch((error) => {
        if (!active) return;
        setFeedback(error.response?.data?.message || "Impossible de charger cette reservation.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const coverImage = reservation?.car?.images?.[0]?.url || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80";

  const paymentSummary = useMemo(() => {
    const payment = reservation?.payments?.[0];
    return {
      total: payment?.amountTotal ?? reservation?.totalPrice ?? 0,
      paid: payment?.amountPaid ?? reservation?.advanceAmount ?? 0,
      remaining: payment?.remaining ?? reservation?.remainingAmount ?? 0,
      method: payment?.method || "CASH",
      status: payment?.status || "UNPAID"
    };
  }, [reservation]);

  async function refreshReservation() {
    const response = await api.get(`/reservations/${id}`);
    setReservation(response.data);
    setForm({
      finalPrice: response.data.finalPrice ? Number(response.data.finalPrice) : "",
      internalNote: response.data.internalNote || ""
    });
  }

  async function updateStatus(status) {
    const response = await api.patch(`/reservations/${id}/status`, { status });
    setReservation((current) => ({ ...current, status: response.data.status }));
    setFeedback(`Statut mis a jour: ${response.data.status}.`);
  }

  async function saveReservationAdjustments(event) {
    event.preventDefault();
    setSaving(true);
    setFeedback("");

    try {
      await api.put(`/reservations/${id}`, {
        finalPrice: form.finalPrice || undefined,
        internalNote: form.internalNote
      });
      await refreshReservation();
      setFeedback("Les ajustements de reservation ont ete enregistres.");
    } catch (error) {
      setFeedback(error.response?.data?.message || "Impossible d'enregistrer les modifications.");
    } finally {
      setSaving(false);
    }
  }

  async function generateContract() {
    setGeneratingContract(true);
    setFeedback("");

    try {
      await api.post(`/contracts/generate/${id}`);
      await refreshReservation();
      setFeedback("Le contrat a ete genere avec succes.");
    } catch (error) {
      setFeedback(error.response?.data?.message || "Generation du contrat impossible pour le moment.");
    } finally {
      setGeneratingContract(false);
    }
  }

  async function downloadContract() {
    if (!reservation?.contract?.id) return;

    try {
      const response = await api.get(`/contracts/${reservation.contract.id}/download`, {
        responseType: "blob"
      });
      const fileUrl = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = `${reservation.reference}-contrat.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(fileUrl);
    } catch (error) {
      setFeedback(error.response?.data?.message || "Telechargement du contrat impossible.");
    }
  }

  if (loading) {
    return (
      <div className="card p-8">
        <h1 className="text-3xl font-semibold text-slate-900">Chargement de la reservation...</h1>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="card p-8">
        <h1 className="text-3xl font-semibold text-slate-900">Reservation introuvable</h1>
        <p className="mt-3 text-slate-500">{feedback || "Le dossier demande n'est pas disponible."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <span className="inline-flex rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-500">
            Dossier reservation
          </span>
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              {reservation.reference}
            </h1>
            <p className="mt-2 max-w-3xl text-lg leading-relaxed text-slate-500">
              Suivi complet du client, du vehicule, des paiements et du contrat associe.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/admin/reservations" className="btn-secondary gap-2">
            <ArrowLeft size={18} />
            Retour
          </Link>
          <div className="flex items-center">
            <StatusBadge status={reservation.status} />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <section className="card overflow-hidden">
            <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="overflow-hidden">
                <img src={coverImage} alt={`${reservation.car?.brand} ${reservation.car?.model}`} className="h-full min-h-80 w-full object-cover" />
              </div>
              <div className="space-y-6 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Vehicule</p>
                    <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                      {reservation.car?.brand} {reservation.car?.model}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">{reservation.car?.plateNumber}</p>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                    <CarFront size={24} />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <DetailRow icon={CalendarRange} label="Periode" value={`${date(reservation.startDate)} - ${date(reservation.endDate)}`} />
                  <DetailRow icon={CalendarRange} label="Duree" value={`${reservation.totalDays} jours`} />
                  <DetailRow icon={CircleDollarSign} label="Prix total" value={currency(reservation.totalPrice)} />
                  <DetailRow icon={CircleDollarSign} label="Avance" value={currency(reservation.advanceAmount)} />
                </div>

                {reservation.car?.images?.length > 1 ? (
                  <div className="grid grid-cols-3 gap-3">
                    {reservation.car.images.slice(1, 4).map((image) => (
                      <img key={image.id} src={image.url} alt="Apercu voiture" className="h-24 w-full rounded-2xl object-cover" />
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <InfoCard title="Client" subtitle="Coordonnees et pieces administratives">
              <div className="grid gap-3">
                <DetailRow icon={UserRound} label="Nom complet" value={`${reservation.client?.user?.firstName} ${reservation.client?.user?.lastName}`} />
                <DetailRow icon={Mail} label="Email" value={reservation.client?.user?.email} />
                <DetailRow icon={Phone} label="Telephone" value={reservation.client?.user?.phone} />
                <DetailRow icon={MapPinned} label="Ville / adresse" value={[reservation.client?.city, reservation.client?.address].filter(Boolean).join(" - ")} />
                <DetailRow icon={IdCard} label="CIN / Passeport" value={reservation.client?.cinOrPassport} />
                <DetailRow icon={IdCard} label="Permis" value={reservation.client?.driverLicense} />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {reservation.client?.identityDocUrl ? (
                  <a href={reservation.client.identityDocUrl} target="_blank" rel="noreferrer" className="btn-secondary gap-2">
                    <FileText size={16} />
                    Voir CIN / Passeport
                  </a>
                ) : null}
                {reservation.client?.licenseDocUrl ? (
                  <a href={reservation.client.licenseDocUrl} target="_blank" rel="noreferrer" className="btn-secondary gap-2">
                    <FileText size={16} />
                    Voir permis
                  </a>
                ) : null}
              </div>
            </InfoCard>

            <InfoCard title="Paiement" subtitle="Lecture immediate de la situation financiere">
              <div className="grid gap-3">
                <DetailRow icon={CircleDollarSign} label="Montant total" value={currency(paymentSummary.total)} />
                <DetailRow icon={CircleDollarSign} label="Montant paye" value={currency(paymentSummary.paid)} />
                <DetailRow icon={CircleDollarSign} label="Reste a payer" value={currency(paymentSummary.remaining)} />
                <DetailRow icon={FileText} label="Mode de paiement" value={paymentSummary.method} />
                <DetailRow icon={ShieldAlert} label="Statut de paiement" value={paymentSummary.status} />
              </div>
            </InfoCard>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <InfoCard title="Pack et options" subtitle="Configuration commerciale de la reservation">
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Pack</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{reservation.pack?.name || "Sans pack"}</p>
                  <p className="mt-1 text-sm text-slate-500">{reservation.pack?.description || "Aucune option pack supplementaire."}</p>
                </div>

                {reservation.options?.length ? (
                  <div className="space-y-3">
                    {reservation.options.map((option) => (
                      <div key={option.id} className="rounded-2xl border border-slate-100 bg-white px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-900">{option.name || option.option?.name}</p>
                            <p className="text-sm text-slate-500">{option.pricingType}</p>
                          </div>
                          <span className="text-sm font-semibold text-slate-900">{currency(option.price)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-5 text-sm text-slate-500">
                    Aucune option supplementaire rattachee a cette reservation.
                  </div>
                )}
              </div>
            </InfoCard>

            <InfoCard title="Affectation et historique" subtitle="Contexte operationnel du dossier">
              <div className="grid gap-3">
                <DetailRow
                  icon={UserRound}
                  label="Employe responsable"
                  value={reservation.employee ? `${reservation.employee.user?.firstName} ${reservation.employee.user?.lastName}` : "Non affecte"}
                />
                <DetailRow icon={CalendarRange} label="Creee le" value={date(reservation.createdAt)} />
                <DetailRow icon={CalendarRange} label="Derniere mise a jour" value={date(reservation.updatedAt)} />
                <DetailRow icon={FileText} label="Reference contrat" value={reservation.contract?.contractNumber || "Pas encore genere"} />
              </div>
            </InfoCard>
          </div>
        </div>

        <div className="space-y-6">
          <InfoCard title="Actions rapides" subtitle="Decisions et ajustements sur la reservation">
            <div className="grid gap-3">
              {statusActions.map(({ value, label, icon: Icon, className }) => (
                <button
                  key={value}
                  type="button"
                  className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${className}`}
                  onClick={() => updateStatus(value)}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
          </InfoCard>

          <InfoCard title="Ajustements" subtitle="Prix final et note interne">
            <form className="space-y-4" onSubmit={saveReservationAdjustments}>
              <label className="space-y-2">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <CircleDollarSign size={16} className="text-slate-400" />
                  Prix final
                </span>
                <input
                  type="number"
                  className="input"
                  value={form.finalPrice}
                  onChange={(event) => setForm((current) => ({ ...current, finalPrice: event.target.value }))}
                  placeholder="Laisser vide pour garder le calcul initial"
                />
              </label>

              <label className="space-y-2">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <NotebookPen size={16} className="text-slate-400" />
                  Note interne
                </span>
                <textarea
                  className="input min-h-32 resize-y"
                  value={form.internalNote}
                  onChange={(event) => setForm((current) => ({ ...current, internalNote: event.target.value }))}
                  placeholder="Instructions de livraison, remarques commerciales, points de vigilance..."
                />
              </label>

              <button type="submit" className="btn-primary gap-2" disabled={saving}>
                <Save size={18} />
                {saving ? "Enregistrement..." : "Enregistrer les ajustements"}
              </button>
            </form>
          </InfoCard>

          <InfoCard title="Contrat" subtitle="Generation et telechargement du PDF">
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
                <p className="text-sm font-semibold text-slate-900">
                  {reservation.contract?.contractNumber || "Aucun contrat genere"}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {reservation.contract ? "Le contrat est disponible pour telechargement." : "Generez le document contractuel a partir des informations actuelles."}
                </p>
              </div>

              <button type="button" className="btn-primary gap-2" onClick={generateContract} disabled={generatingContract}>
                <FileText size={18} />
                {generatingContract ? "Generation..." : "Generer le contrat"}
              </button>

              {reservation.contract ? (
                <button type="button" className="btn-secondary gap-2" onClick={downloadContract}>
                  <FileDown size={18} />
                  Telecharger le contrat
                </button>
              ) : null}
            </div>
          </InfoCard>

          {feedback ? (
            <div className="card px-5 py-4 text-sm font-medium text-slate-700">
              {feedback}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
