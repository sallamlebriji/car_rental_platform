import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeDollarSign,
  Building2,
  CalendarClock,
  CarFront,
  CheckCircle2,
  Clock3,
  Globe2,
  MapPinned,
  MessageCircle,
  PackageCheck,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Users
} from "lucide-react";
import { useFetch } from "../hooks/useFetch";
import { useThemeSettings } from "../context/ThemeContext";
import CarCard from "../components/CarCard";

function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-[1.8rem] border border-slate-200/80 bg-white/90 p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)]">
      <p className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{hint}</p>
    </div>
  );
}

function EditorialFeature({ icon: Icon, title, description }) {
  return (
    <div className="rounded-[1.9rem] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_55px_rgba(15,23,42,0.06)]">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
        <Icon size={20} />
      </div>
      <h3 className="mt-5 text-xl font-semibold tracking-tight text-slate-950">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
    </div>
  );
}

function AccessCard({ icon: Icon, title, description, to, tone = "dark" }) {
  const classes = tone === "dark"
    ? "border-white/10 bg-white/8 text-white hover:bg-white/12"
    : "border-slate-200 bg-white text-slate-950 hover:border-slate-300 hover:shadow-soft";

  return (
    <Link
      to={to}
      className={`group rounded-[1.7rem] border p-5 transition ${classes}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tone === "dark" ? "bg-white/10" : "bg-slate-100"}`}>
          <Icon size={18} />
        </div>
        <ArrowRight size={16} className="opacity-50 transition group-hover:translate-x-1 group-hover:opacity-100" />
      </div>
      <h3 className="mt-5 text-lg font-semibold">{title}</h3>
      <p className={`mt-2 text-sm leading-relaxed ${tone === "dark" ? "text-white/70" : "text-slate-600"}`}>{description}</p>
    </Link>
  );
}

function ContactRow({ icon: Icon, label, value, href }) {
  const content = (
    <div className="flex items-center gap-4 rounded-[1.45rem] border border-slate-200 bg-white px-4 py-4 transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">{label}</p>
        <p className="mt-1 truncate text-sm font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );

  if (!href) return content;

  return <a href={href} target="_blank" rel="noreferrer">{content}</a>;
}

export default function HomePage() {
  const settings = useThemeSettings();
  const agencyQuery = settings.activeAgencyId ? `?agencyId=${settings.activeAgencyId}` : "";
  const { data: cars, loading } = useFetch(`/cars${agencyQuery}`, [agencyQuery]);
  const carsPath = settings.buildClientPath("/cars");
  const registerPath = settings.buildClientPath("/register");
  const loginPath = settings.buildClientPath("/login");
  const reservationsPath = settings.buildClientPath("/my-reservations");
  const agencyLoginPath = settings.isPortalScoped ? `${settings.portalBasePath}/admin/login` : "/admin/login";
  const carRows = Array.isArray(cars) ? cars : [];
  const activeCars = carRows.filter((car) => car.status === "AVAILABLE");
  const uniqueBrands = new Set(carRows.map((car) => car.brand).filter(Boolean)).size;
  const agencyName = settings.agency?.agencyName || settings.activeAgency?.name || "Plateforme";
  const slogan = settings.agency?.slogan || "Location de voitures haut de gamme";
  const coverImage = settings.visual?.coverImageUrl || settings.activeAgency?.coverImageUrl || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80";
  const primaryButtonText = settings.visual?.primaryButtonText || "Reserver maintenant";
  const heroCopy = settings.visual?.homepageText || "Choisissez votre vehicule, comparez les packs, ajoutez vos options et pilotez votre reservation dans un espace client soigne.";
  const contactPhone = settings.agency?.phone || settings.activeAgency?.phone;
  const whatsapp = settings.agency?.whatsapp;
  const website = settings.agency?.website;
  const address = [settings.agency?.address, settings.activeAgency?.city || settings.agency?.city, settings.activeAgency?.country || settings.agency?.country].filter(Boolean).join(", ");

  return (
    <div className="space-y-12">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(380px,0.85fr)]">
        <div className="relative overflow-hidden rounded-[2.6rem] bg-slate-950 text-white shadow-[0_34px_95px_rgba(15,23,42,0.18)]">
          <img src={coverImage} alt={agencyName} className="absolute inset-0 h-full w-full object-cover opacity-28" />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(2,6,23,0.95)_4%,rgba(2,6,23,0.78)_42%,rgba(2,6,23,0.76)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.12),transparent_18%),radial-gradient(circle_at_80%_12%,rgba(45,212,191,0.12),transparent_22%)]" />

          <div className="relative flex h-full flex-col justify-between gap-8 px-6 py-8 md:px-8 md:py-10">
            <div className="space-y-6">
              <div className="inline-flex rounded-full border border-white/15 bg-white/6 px-4 py-2 text-[11px] uppercase tracking-[0.34em] text-white/72">
                {settings.isPortalScoped ? "Portail agence dedie" : "Showroom premium"}
              </div>

              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.28em] text-white/55">{slogan}</p>
                <h1 className="max-w-3xl text-4xl font-semibold leading-[0.98] tracking-tight sm:text-5xl xl:text-[4.75rem]">
                  {agencyName}
                </h1>
                <p className="max-w-2xl text-lg font-medium leading-relaxed text-white/92 sm:text-[1.35rem]">
                  Une vitrine sobre, un parc dedie et un parcours de location vraiment professionnel.
                </p>
                <p className="max-w-2xl text-sm leading-7 text-white/74 sm:text-base">
                  {heroCopy}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link className="btn-primary gap-2" to={carsPath}>
                  {primaryButtonText}
                  <ArrowRight size={16} />
                </Link>
                <Link className="btn-secondary border-white/15 bg-white/8 text-white hover:bg-white/12" to={registerPath}>
                  Creer mon compte client
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.6rem] border border-white/10 bg-white/8 px-4 py-4 backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/50">Vehicules visibles</p>
                <p className="mt-2 text-3xl font-semibold text-white">{activeCars.length || carRows.length || 0}</p>
              </div>
              <div className="rounded-[1.6rem] border border-white/10 bg-white/8 px-4 py-4 backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/50">Marques</p>
                <p className="mt-2 text-3xl font-semibold text-white">{uniqueBrands || 1}</p>
              </div>
              <div className="rounded-[1.6rem] border border-white/10 bg-white/8 px-4 py-4 backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/50">Parcours client</p>
                <p className="mt-2 text-3xl font-semibold text-white">1 portail</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="rounded-[2.3rem] border border-slate-200/80 bg-white/95 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400">Agence active</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">{agencyName}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {settings.activeAgency?.city ? `${settings.activeAgency.city}, ${settings.activeAgency.country || "Maroc"}` : "Portail local agence"}
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-soft">
                {settings.agency?.logoUrl ? (
                  <img src={settings.agency.logoUrl} alt={agencyName} className="h-12 w-12 rounded-2xl bg-white object-cover p-2" />
                ) : (
                  <Building2 size={24} />
                )}
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <AccessCard
                icon={Users}
                title="Connexion client"
                description="Le locataire se connecte et reserve uniquement dans l'environnement de cette agence."
                to={loginPath}
                tone="light"
              />
              <AccessCard
                icon={ShieldCheck}
                title="Connexion agence"
                description="Admins et employes retrouvent le back-office propre a cette meme agence."
                to={agencyLoginPath}
                tone="light"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard label="Positionnement" value="Premium local" hint="Presentation plus elegante, service plus direct et lecture plus rassurante des offres." />
            <StatCard label="Acces rapide" value="Client & agence" hint="Deux points d'entree clairs pour le client d'un cote, l'equipe de l'agence de l'autre." />
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <EditorialFeature icon={ShieldCheck} title="Reservation securisee" description="Chaque demande reste rattachee a la bonne agence, avec un parcours de confirmation plus fiable et plus net." />
        <EditorialFeature icon={PackageCheck} title="Offres bien presentees" description="Packs, options, conditions et tarifs sont mis en scene dans une interface plus professionnelle." />
        <EditorialFeature icon={Clock3} title="Suivi client simplifie" description="Le client retrouve ses reservations, ses documents et son historique dans un espace plus clair." />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="inline-flex rounded-full border border-slate-200 bg-white/75 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-slate-500">
                Selection du moment
              </span>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">Voitures disponibles</h2>
              <p className="mt-2 text-slate-500">
                Une selection actuelle pour {agencyName}.
              </p>
            </div>
            <Link to={carsPath} className="btn-secondary gap-2">
              Voir tout le parc
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-[28rem] rounded-[2rem] bg-white/80 shadow-soft animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {carRows.slice(0, 3).map((car) => <CarCard key={car.id} car={car} />)}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-[2.2rem] border border-slate-200/80 bg-[#f7f3ec] p-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
            <div>
              <span className="inline-flex rounded-full border border-slate-300 bg-white/70 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-slate-500">
                Contact agence
              </span>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">Entrer directement en relation</h2>
              <p className="mt-2 text-slate-600">
                Informations utiles pour appeler, localiser ou ouvrir la vitrine de {agencyName}.
              </p>
            </div>

            <div className="mt-6 grid gap-4">
              {contactPhone ? (
                <ContactRow icon={PhoneCall} label="Telephone" value={contactPhone} href={`tel:${contactPhone}`} />
              ) : null}
              {whatsapp ? (
                <ContactRow icon={MessageCircle} label="WhatsApp" value={whatsapp} href={`https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`} />
              ) : null}
              {website ? (
                <ContactRow icon={Globe2} label="Site web" value={website} href={website} />
              ) : null}
              {address ? (
                <ContactRow icon={MapPinned} label="Adresse" value={address} />
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <AccessCard
              icon={CalendarClock}
              title="Mon espace client"
              description="Retrouver mes reservations, mes statuts et mes documents."
              to={reservationsPath}
              tone="light"
            />
            <AccessCard
              icon={CarFront}
              title="Voir tout le parc"
              description="Consulter toutes les voitures visibles pour cette seule agence."
              to={carsPath}
              tone="light"
            />
          </div>

          <div className="rounded-[2rem] border border-slate-200/80 bg-white/95 p-6 shadow-[0_20px_55px_rgba(15,23,42,0.06)]">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-950">Une presentation plus professionnelle</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Cette vitrine est maintenant pensee comme un vrai showroom digital : plus elegante, plus lisible et mieux adaptee a une agence de location.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
