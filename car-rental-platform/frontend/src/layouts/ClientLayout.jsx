import { Link, NavLink, Outlet, useSearchParams } from "react-router-dom";
import { Building2, ChevronDown, Compass, CarFront, CalendarClock, Sparkles, UserCircle2, LogOut } from "lucide-react";
import { useThemeSettings } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

function navClass({ isActive }) {
  return [
    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
    isActive
      ? "bg-white text-slate-950 shadow-soft"
      : "text-white/78 hover:bg-white/10 hover:text-white"
  ].join(" ");
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

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(15,118,110,0.14),transparent_22%),radial-gradient(circle_at_top_right,rgba(245,158,11,0.12),transparent_18%),linear-gradient(180deg,#eff4fb_0%,#f8fafc_45%,#eef2ff_100%)]">
      <header className="relative overflow-hidden border-b border-white/20 bg-slate-950 text-white shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(59,130,246,0.08),transparent_35%,rgba(20,184,166,0.14))]" />
        <div className="relative mx-auto max-w-7xl px-4 py-5 lg:px-6">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center gap-4">
                <Link to={homePath} className="group flex items-center gap-4">
                  {agency?.logoUrl ? (
                    <img src={agency.logoUrl} alt={brandName} className="h-14 w-14 rounded-[1.25rem] object-cover ring-1 ring-white/20" />
                  ) : (
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] text-lg font-semibold text-white ring-1 ring-white/15"
                      style={{ background: `linear-gradient(135deg, ${visual?.primaryColor || "#0f766e"}, ${visual?.secondaryColor || "#f59e0b"})` }}
                    >
                      {brandName.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-white/65">
                      <Sparkles size={12} />
                      Portail client
                    </div>
                    <p className="mt-3 text-2xl font-semibold tracking-tight">{brandName}</p>
                    <p className="text-sm text-white/62">{slogan}</p>
                  </div>
                </Link>
              </div>

              <div className="grid gap-3 md:grid-cols-[minmax(240px,290px)_auto] md:items-center">
                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-[0.26em] text-white/45">Agence active</label>
                  <label className="relative block">
                    <Building2 size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/45" />
                    <select
                      className="input border-white/10 bg-white/10 pl-11 pr-11 text-white backdrop-blur disabled:bg-white/5 disabled:text-white/55"
                      value={activeAgencyId || ""}
                      onChange={handleAgencyChange}
                      disabled={isAgencyLocked}
                    >
                      {agencies.map((agencyItem) => (
                        <option key={agencyItem.id} value={agencyItem.id} className="text-slate-900">
                          {agencyItem.name}{agencyItem.city ? ` - ${agencyItem.city}` : ""}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/45" />
                  </label>
                  {isAgencyLocked ? (
                    <p className="text-xs text-white/55">
                      {isPortalScoped
                        ? "Ce portail est dedie a cette agence. Les clients, l'admin et les employes se connectent dans cet environnement unique."
                        : "Votre compte client est rattache a cette agence. Le catalogue et la reservation suivent automatiquement ce parc."}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center gap-3 md:justify-end">
                  {user ? (
                    <>
                      <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/8 px-4 py-2">
                        <UserCircle2 size={18} className="text-white/75" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-white">{user.firstName} {user.lastName}</p>
                          <p className="truncate text-xs text-white/55">{user.email}</p>
                        </div>
                      </div>
                      <button className="btn-secondary gap-2 border-white/15 bg-white/8 text-white hover:bg-white/12" onClick={logout}>
                        <LogOut size={16} />
                        Deconnexion
                      </button>
                    </>
                  ) : (
                    <>
                      <Link className="btn-secondary border-white/15 bg-white/8 text-white hover:bg-white/12" to={loginPath}>Connexion</Link>
                      <Link className="btn-primary" to={registerPath}>Inscription</Link>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-[1.8rem] border border-white/10 bg-white/6 p-4 backdrop-blur md:flex-row md:items-center md:justify-between">
              <nav className="flex flex-wrap items-center gap-2">
                <NavLink to={homePath} className={navClass}>
                  <Compass size={16} />
                  Accueil
                </NavLink>
                <NavLink to={carsPath} className={navClass}>
                  <CarFront size={16} />
                  Voitures
                </NavLink>
                <NavLink to={reservationsPath} className={navClass}>
                  <CalendarClock size={16} />
                  Mes reservations
                </NavLink>
              </nav>

              <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-white/62">
                {activeAgency?.city ? `${activeAgency.city}, ${activeAgency.country || "Maroc"}` : "Experience premium de location"}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-6 lg:py-10">
        <Outlet />
      </main>
    </div>
  );
}
