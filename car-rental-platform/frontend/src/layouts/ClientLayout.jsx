import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, ChevronDown, Globe2, LogOut, MapPinned, Menu, MessageCircle, PhoneCall, UserRound, X } from "lucide-react";
import { useThemeSettings } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import SmoothScroll from "../components/ui/SmoothScroll";
import Avatar from "../components/Avatar";
import { overlay, pageTransition } from "../motion";

function BrandMark({ agency, visual, brandName, size = 40 }) {
  if (agency?.logoUrl) {
    return <img src={agency.logoUrl} alt={brandName} className="rounded-xl object-cover" style={{ width: size, height: size }} />;
  }

  return (
    <span
      className="flex items-center justify-center rounded-xl font-display text-sm font-bold text-white"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${visual?.primaryColor || "var(--primary-color)"}, color-mix(in srgb, ${visual?.primaryColor || "var(--primary-color)"} 55%, black))`
      }}
    >
      {brandName.slice(0, 2).toUpperCase()}
    </span>
  );
}

export default function ClientLayout() {
  const {
    agency,
    visual,
    agencies,
    activeAgency,
    activeAgencyId,
    setActiveAgencyId,
    isAgencyLocked,
    isPortalScoped,
    buildClientPath
  } = useThemeSettings();
  const { user, logout } = useAuth();
  const [, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  function handleAgencyChange(event) {
    if (isAgencyLocked) return;
    const nextAgencyId = event.target.value;
    setActiveAgencyId(nextAgencyId);
    const nextParams = new URLSearchParams(window.location.search);
    if (nextAgencyId) nextParams.set("agency", nextAgencyId);
    else nextParams.delete("agency");
    setSearchParams(nextParams, { replace: true });
  }

  const brandName = agency?.agencyName || activeAgency?.name || "Agence";
  const slogan = agency?.slogan || "Location de voitures";
  const homePath = buildClientPath("/");
  const carsPath = buildClientPath("/cars");
  const reservationsPath = buildClientPath("/my-reservations");
  const loginPath = buildClientPath("/login");
  const registerPath = buildClientPath("/register");
  // Home is served both at "/" and at "/agency/:slug".
  const isHome = location.pathname === "/" || /^\/agency\/[^/]+\/?$/.test(location.pathname);
  const overHero = isHome && !scrolled && !menuOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const links = [
    { to: homePath, label: "Accueil", end: true },
    { to: carsPath, label: "Voitures" },
    { to: reservationsPath, label: "Mes reservations" }
  ];

  const contactPhone = agency?.phone || activeAgency?.phone;
  const whatsapp = agency?.whatsapp;
  const website = agency?.website;
  const address = [agency?.address, activeAgency?.city || agency?.city, activeAgency?.country || agency?.country].filter(Boolean).join(", ");

  const agencySelect = (dark) => (
    <label className="relative block">
      <Building2 size={14} className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${dark ? "text-white/60" : "text-slate-400"}`} />
      <select
        aria-label="Agence active"
        className={`w-full appearance-none rounded-full border py-2 pl-8 pr-8 text-xs font-medium outline-none transition-colors duration-calm ease-calm disabled:cursor-default ${
          dark
            ? "border-white/15 bg-white/10 text-white hover:bg-white/15"
            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
        }`}
        value={activeAgencyId || ""}
        onChange={handleAgencyChange}
        disabled={isAgencyLocked}
        title={isAgencyLocked ? (isPortalScoped ? "Portail dedie a cette agence" : "Compte rattache a cette agence") : "Changer d'agence"}
      >
        {agencies.map((agencyItem) => (
          <option key={agencyItem.id} value={agencyItem.id} className="text-slate-900">
            {agencyItem.name}{agencyItem.city ? ` - ${agencyItem.city}` : ""}
          </option>
        ))}
      </select>
      {!isAgencyLocked ? (
        <ChevronDown size={14} className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${dark ? "text-white/60" : "text-slate-400"}`} />
      ) : null}
    </label>
  );

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f7f5]">
      <SmoothScroll />

      <header
        className={`fixed inset-x-0 top-0 z-topbar transition-[background-color,box-shadow,border-color] duration-calm ease-calm ${
          overHero
            ? "border-b border-transparent bg-transparent"
            : "border-b border-slate-900/[0.06] bg-white/80 shadow-[0_1px_0_rgba(11,18,32,0.02)] backdrop-blur-xl"
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-6 px-4 lg:px-8">
          <Link to={homePath} className="flex min-w-0 items-center gap-3">
            <BrandMark agency={agency} visual={visual} brandName={brandName} />
            <span className="min-w-0">
              <span className={`block truncate font-display text-[0.95rem] font-bold leading-tight ${overHero ? "text-white" : "text-slate-900"}`}>{brandName}</span>
              <span className={`block truncate text-[0.7rem] ${overHero ? "text-white/60" : "text-slate-500"}`}>{slogan}</span>
            </span>
          </Link>

          <nav className="mx-auto hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className="relative px-4 py-2 text-sm font-medium">
                {({ isActive: routeActive }) => {
                  const isActive = link.end ? isHome : routeActive;
                  return (
                  <>
                    <span className={`relative z-10 transition-colors duration-calm ease-calm ${
                      overHero ? (isActive ? "text-white" : "text-white/70 hover:text-white") : isActive ? "text-slate-900" : "text-slate-500 hover:text-slate-900"
                    }`}>
                      {link.label}
                    </span>
                    {isActive ? (
                      <motion.span
                        layoutId="client-nav-underline"
                        className="absolute inset-x-4 -bottom-0.5 h-[2px] rounded-full"
                        style={{ background: overHero ? "#fff" : "var(--primary-color)" }}
                        transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      />
                    ) : null}
                  </>
                  );
                }}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto hidden items-center gap-3 md:flex">
            {agencies.length > 1 || isAgencyLocked ? <div className="w-48">{agencySelect(overHero)}</div> : null}
            {user ? (
              <div className="flex items-center gap-2">
                <Link to={reservationsPath} className={`flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-sm font-medium transition-colors duration-calm ease-calm ${overHero ? "text-white hover:bg-white/10" : "text-slate-800 hover:bg-slate-900/5"}`}>
                  <Avatar name={`${user.firstName || ""} ${user.lastName || ""}`} size={30} />
                  <span className="max-w-[7rem] truncate">{user.firstName}</span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  aria-label="Deconnexion"
                  title="Deconnexion"
                  className={`rounded-full p-2 transition-colors duration-calm ease-calm ${overHero ? "text-white/70 hover:bg-white/10 hover:text-white" : "text-slate-500 hover:bg-slate-900/5 hover:text-slate-900"}`}
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <>
                <Link to={loginPath} className={`text-sm font-medium transition-colors duration-calm ease-calm ${overHero ? "text-white/80 hover:text-white" : "text-slate-600 hover:text-slate-900"}`}>
                  Connexion
                </Link>
                <Link to={registerPath} className={overHero ? "btn-secondary !border-white/20 !bg-white !text-slate-900" : "btn-primary"}>
                  Creer un compte
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className={`ml-auto rounded-full p-2 md:hidden ${overHero ? "text-white" : "text-slate-800"}`}
            onClick={() => setMenuOpen((value) => !value)}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen ? (
            <motion.div className="border-t border-slate-900/[0.06] bg-white px-4 pb-6 pt-4 md:hidden" {...overlay}>
              <nav className="grid gap-1">
                {links.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) => `rounded-xl px-3 py-3 text-base font-medium ${(link.end ? isHome : isActive) ? "bg-slate-900/5 text-slate-900" : "text-slate-600"}`}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
              <div className="mt-4 space-y-3">
                {agencySelect(false)}
                {user ? (
                  <button type="button" onClick={logout} className="btn-secondary w-full gap-2">
                    <LogOut size={16} /> Deconnexion
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link to={loginPath} className="btn-secondary">Connexion</Link>
                    <Link to={registerPath} className="btn-primary">Creer un compte</Link>
                  </div>
                )}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>

      <main className={`flex-1 ${isHome ? "" : "mx-auto w-full max-w-7xl px-4 pb-16 pt-[104px] lg:px-8 lg:pt-[120px]"}`}>
        <motion.div key={location.pathname} {...pageTransition}>
          <Outlet />
        </motion.div>
      </main>

      <footer className="border-t border-slate-900/[0.06] bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <BrandMark agency={agency} visual={visual} brandName={brandName} size={36} />
              <span className="font-display text-lg font-bold text-slate-900">{brandName}</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500">
              {agency?.description || `${slogan}. Reservez en ligne, suivez vos demandes et retrouvez vos documents dans votre espace client.`}
            </p>
          </div>

          <div>
            <p className="eyebrow">Navigation</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to={carsPath} className="text-slate-600 transition-colors hover:text-slate-900">Nos voitures</Link></li>
              <li><Link to={reservationsPath} className="text-slate-600 transition-colors hover:text-slate-900">Mes reservations</Link></li>
              <li><Link to={user ? reservationsPath : loginPath} className="text-slate-600 transition-colors hover:text-slate-900">{user ? "Mon espace" : "Connexion client"}</Link></li>
              <li>
                <Link to={isPortalScoped ? buildClientPath("/admin/login") : "/admin/login"} className="text-slate-600 transition-colors hover:text-slate-900">
                  Espace agence
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow">Contact</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {contactPhone ? (
                <li><a href={`tel:${contactPhone}`} className="flex items-center gap-2.5 hover:text-slate-900"><PhoneCall size={15} className="text-slate-400" />{contactPhone}</a></li>
              ) : null}
              {whatsapp ? (
                <li><a href={`https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 hover:text-slate-900"><MessageCircle size={15} className="text-slate-400" />WhatsApp</a></li>
              ) : null}
              {website ? (
                <li><a href={website} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 hover:text-slate-900"><Globe2 size={15} className="text-slate-400" />Site web</a></li>
              ) : null}
              {address ? <li className="flex items-start gap-2.5"><MapPinned size={15} className="mt-0.5 shrink-0 text-slate-400" />{address}</li> : null}
              {!contactPhone && !whatsapp && !website && !address ? (
                <li className="flex items-center gap-2.5"><UserRound size={15} className="text-slate-400" />Contactez votre agence</li>
              ) : null}
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-900/[0.06]">
          <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-slate-400 lg:px-8">
            © {new Date().getFullYear()} {brandName}. Tous droits reserves.
          </p>
        </div>
      </footer>
    </div>
  );
}
