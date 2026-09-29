import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarClock,
  CarFront,
  Clock3,
  Globe2,
  MapPinned,
  MessageCircle,
  PackageCheck,
  PhoneCall,
  ShieldCheck,
  Users
} from "lucide-react";
import { useFetch } from "../hooks/useFetch";
import { useThemeSettings } from "../context/ThemeContext";
import CarCard from "../components/CarCard";
import SplitWords from "../components/ui/SplitWords";
import Parallax from "../components/ui/Parallax";
import CountUp from "../components/ui/CountUp";
import EmptyState from "../components/ui/EmptyState";
import LiveBookingMockup from "../components/client/LiveBookingMockup";
import { Item, Reveal, Stagger } from "../components/ui/Reveal";

function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 md:text-[2.6rem] md:leading-[1.1]">{title}</h2>
        {description ? <p className="mt-4 text-base leading-relaxed text-slate-500">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

function ContactRow({ icon: Icon, label, value, href }) {
  const content = (
    <div className="group flex items-center gap-4 rounded-2xl px-4 py-3.5 transition-colors duration-calm ease-calm hover:bg-white/5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
        <Icon size={17} />
      </span>
      <div className="min-w-0">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white/40">{label}</p>
        <p className="mt-0.5 truncate text-sm font-medium text-white">{value}</p>
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
  const brandList = [...new Set(carRows.map((car) => car.brand).filter(Boolean))];
  const uniqueBrands = brandList.length;
  const lowestPrice = carRows.length ? Math.min(...carRows.map((car) => Number(car.pricePerDay || 0)).filter((price) => price > 0)) : 0;
  const agencyName = settings.agency?.agencyName || settings.activeAgency?.name || "Plateforme";
  const slogan = settings.agency?.slogan || "Location de voitures haut de gamme";
  const coverImage = settings.visual?.coverImageUrl || settings.activeAgency?.coverImageUrl || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80";
  const primaryButtonText = settings.visual?.primaryButtonText || "Reserver maintenant";
  const heroCopy = settings.visual?.homepageText || "Choisissez votre vehicule, comparez les packs, ajoutez vos options et pilotez votre reservation dans un espace client soigne.";
  const contactPhone = settings.agency?.phone || settings.activeAgency?.phone;
  const whatsapp = settings.agency?.whatsapp;
  const website = settings.agency?.website;
  const address = [settings.agency?.address, settings.activeAgency?.city || settings.agency?.city, settings.activeAgency?.country || settings.agency?.country].filter(Boolean).join(", ");
  const featured = (activeCars.length ? activeCars : carRows).slice(0, 3);

  return (
    <div className="overflow-x-clip">
      {/* ---------- Hero ---------- */}
      <section className="relative isolate flex min-h-[92vh] items-end overflow-hidden bg-ink-950 text-white">
        <Parallax className="absolute inset-x-0 -top-[6%] bottom-[-12%] -z-10" amount={10}>
          <img src={coverImage} alt="" className="h-full w-full scale-105 object-cover opacity-60" />
        </Parallax>
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(7,11,20,0.55)_0%,rgba(7,11,20,0.25)_35%,rgba(7,11,20,0.92)_100%)]" />
        <div
          className="absolute inset-0 -z-10"
          style={{ background: "radial-gradient(50rem 30rem at 15% 100%, color-mix(in srgb, var(--primary-color) 30%, transparent), transparent 70%)" }}
        />

        <div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-36 lg:px-8 lg:pb-14">
          <Stagger className="max-w-3xl" stagger={0.12} delay={0.1}>
            <Item as="p" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/80 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full anim-pulse-dot" style={{ background: "var(--primary-color)", color: "var(--primary-color)" }} />
              {settings.isPortalScoped ? `Portail officiel · ${agencyName}` : `${agencyName} · ${slogan}`}
            </Item>
          </Stagger>

          <SplitWords
            text="La bonne voiture, au bon moment."
            delay={0.25}
            className="mt-6 max-w-4xl font-display text-[2.6rem] font-extrabold leading-[1.02] tracking-[-0.03em] sm:text-6xl lg:text-[5.2rem]"
          />

          <Stagger className="mt-6 max-w-2xl" stagger={0.12} delay={0.7}>
            <Item as="p" className="text-base leading-relaxed text-white/75 md:text-lg">{heroCopy}</Item>
            <Item className="mt-8 flex flex-wrap gap-3">
              <Link className="btn-primary gap-2 !px-6 !py-3.5 !text-[0.95rem]" to={carsPath}>
                {primaryButtonText}
                <ArrowRight size={17} />
              </Link>
              <Link className="btn-secondary !border-white/20 !bg-white/10 !px-6 !py-3.5 !text-[0.95rem] !text-white backdrop-blur hover:!bg-white/15" to={reservationsPath}>
                Suivre ma reservation
              </Link>
            </Item>
          </Stagger>

          <Reveal delay={1} className="mt-14 grid grid-cols-3 divide-x divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-md md:max-w-2xl">
            {[
              ["Vehicules disponibles", activeCars.length || carRows.length, (n) => Math.round(n)],
              ["Marques", uniqueBrands, (n) => Math.round(n)],
              ["A partir de", Number.isFinite(lowestPrice) ? lowestPrice : 0, (n) => `${Math.round(n)} MAD`]
            ].map(([label, value, format]) => (
              <div key={label} className="px-4 py-4 md:px-6">
                <p className="font-display text-xl font-bold tracking-tight md:text-3xl">
                  <CountUp value={value} format={format} />
                </p>
                <p className="mt-1 text-[0.7rem] text-white/55 md:text-xs">{label}</p>
              </div>
            ))}
          </Reveal>
        </div>

        <div className="pointer-events-none absolute bottom-8 right-8 hidden h-10 w-6 justify-center overflow-hidden rounded-full border border-white/25 lg:flex" aria-hidden="true">
          <span className="anim-scroll-cue mt-1.5 h-2.5 w-[3px] rounded-full bg-white/80" />
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-28 px-4 py-24 lg:px-8">
        {/* ---------- Selection ---------- */}
        <section className="space-y-10">
          <Reveal>
            <SectionHeading
              eyebrow="Selection du moment"
              title="Des vehicules prets a partir"
              description={`Une selection du parc de ${agencyName}, entretenue et preparee pour vos trajets.`}
              action={
                <Link to={carsPath} className="btn-secondary shrink-0 gap-2">
                  Voir tout le parc
                  <ArrowRight size={16} />
                </Link>
              }
            />
          </Reveal>

          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="overflow-hidden rounded-card-primary border border-slate-900/[0.06] bg-white">
                  <div className="skeleton aspect-[16/10] !rounded-none" />
                  <div className="space-y-3 p-5">
                    <div className="skeleton h-5 w-2/3" />
                    <div className="skeleton h-3 w-1/3" />
                    <div className="skeleton mt-6 h-6 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : featured.length ? (
            <Stagger className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {featured.map((car) => (
                <Item key={car.id} className="h-full">
                  <CarCard car={car} />
                </Item>
              ))}
            </Stagger>
          ) : (
            <div className="rounded-card-primary border border-slate-900/[0.06] bg-white">
              <EmptyState title="Le parc arrive bientot" description="Aucun vehicule n'est encore publie pour cette agence. Revenez tres vite." />
            </div>
          )}
        </section>

        {/* ---------- How it works ---------- */}
        <section className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-10">
            <Reveal>
              <SectionHeading
                eyebrow="Comment ca marche"
                title="Reserver en trois etapes, sans friction"
                description="Un parcours clair du choix du vehicule jusqu'a la confirmation par l'agence."
              />
            </Reveal>
            <Stagger className="space-y-2">
              {[
                ["01", "Choisissez votre voiture", "Comparez modeles, carburant, boite et tarif journalier."],
                ["02", "Composez votre location", "Selectionnez vos dates, un pack et les options utiles."],
                ["03", "Recevez la confirmation", "L'agence valide votre demande, vous suivez tout depuis votre espace."]
              ].map(([number, title, text]) => (
                <Item key={number} className="group flex gap-5 rounded-2xl p-4 transition-colors duration-calm ease-calm hover:bg-white">
                  <span className="font-display text-sm font-bold tabular-nums" style={{ color: "var(--primary-color)" }}>{number}</span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-slate-900">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-500">{text}</p>
                  </div>
                </Item>
              ))}
            </Stagger>
          </div>
          <Reveal delay={0.15}>
            <LiveBookingMockup />
          </Reveal>
        </section>

        {/* ---------- Promises ---------- */}
        <Stagger as="section" className="grid gap-px overflow-hidden rounded-card-primary border border-slate-900/[0.06] bg-slate-900/[0.06] md:grid-cols-3">
          {[
            [ShieldCheck, "Reservation securisee", "Chaque demande reste rattachee a votre agence, avec un parcours de confirmation fiable."],
            [PackageCheck, "Offres transparentes", "Packs, options, conditions et tarifs presentes clairement avant de valider."],
            [Clock3, "Suivi simplifie", "Reservations, statuts et documents reunis dans votre espace client."]
          ].map(([Icon, title, text]) => (
            <Item key={title} className="bg-white p-8">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: "color-mix(in srgb, var(--primary-color) 10%, white)", color: "var(--primary-color)" }}>
                <Icon size={20} />
              </span>
              <h3 className="mt-6 font-display text-lg font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{text}</p>
            </Item>
          ))}
        </Stagger>
      </div>

      {/* ---------- Brands marquee ---------- */}
      {uniqueBrands > 0 ? (
        <div className="overflow-hidden border-y border-slate-900/[0.06] bg-white py-8" aria-hidden="true">
          <div className="anim-marquee flex w-max gap-16 whitespace-nowrap">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex gap-16">
                {[...brandList, ...brandList, ...brandList].map((brand, index) => (
                  <span key={`${brand}-${index}`} className="font-display text-3xl font-extrabold tracking-tight text-slate-200">{brand}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* ---------- Contact & access ---------- */}
      <div className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
        <Reveal className="relative overflow-hidden rounded-[2rem] bg-ink-900 text-white shadow-deep">
          <div
            className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full anim-breathe"
            style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--primary-color) 40%, transparent), transparent 70%)" }}
          />
          <div className="relative grid gap-10 p-8 md:p-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">{agencyName}</p>
              <h2 className="mt-4 max-w-lg font-display text-3xl font-bold tracking-tight md:text-[2.6rem] md:leading-[1.1]">
                Une question avant de reserver ?
              </h2>
              <p className="mt-4 max-w-md text-white/60">
                Notre equipe vous accompagne pour choisir le bon vehicule et preparer votre depart.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to={carsPath} className="btn-primary gap-2">
                  <CarFront size={16} /> Parcourir le parc
                </Link>
                <Link to={registerPath} className="btn-secondary !border-white/15 !bg-white/10 !text-white hover:!bg-white/15">
                  Creer mon compte
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/50">
                <Link to={loginPath} className="inline-flex items-center gap-2 hover:text-white"><Users size={15} />Connexion client</Link>
                <Link to={reservationsPath} className="inline-flex items-center gap-2 hover:text-white"><CalendarClock size={15} />Mes reservations</Link>
                <Link to={agencyLoginPath} className="inline-flex items-center gap-2 hover:text-white"><ShieldCheck size={15} />Espace agence</Link>
              </div>
            </div>

            <div className="grid content-start gap-1 rounded-2xl border border-white/10 bg-white/[0.04] p-2">
              {contactPhone ? <ContactRow icon={PhoneCall} label="Telephone" value={contactPhone} href={`tel:${contactPhone}`} /> : null}
              {whatsapp ? <ContactRow icon={MessageCircle} label="WhatsApp" value={whatsapp} href={`https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`} /> : null}
              {website ? <ContactRow icon={Globe2} label="Site web" value={website} href={website} /> : null}
              {address ? <ContactRow icon={MapPinned} label="Adresse" value={address} /> : null}
              {!contactPhone && !whatsapp && !website && !address ? (
                <p className="px-4 py-6 text-sm text-white/50">Les coordonnees de l'agence seront bientot disponibles.</p>
              ) : null}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
