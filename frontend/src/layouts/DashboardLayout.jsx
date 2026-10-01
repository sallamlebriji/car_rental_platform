import { useEffect, useMemo, useRef, useState } from "react";
import {
  BellRing,
  BriefcaseBusiness,
  Building2,
  CarFront,
  ChevronDown,
  ChevronsLeft,
  ClipboardList,
  ExternalLink,
  FileText,
  Flag,
  Home,
  KeyRound,
  LayoutTemplate,
  LogOut,
  Menu,
  Palette,
  Plus,
  ReceiptText,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  Wallet,
  Wrench,
  X
} from "lucide-react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import Avatar from "../components/Avatar";
import { drawer, overlay, pageTransition } from "../motion";

const COLLAPSE_KEY = "dashboard_sidebar_collapsed";

function buildAdminSections(permissions) {
  const sections = [
    {
      title: "Pilotage",
      items: [{ href: "/admin/dashboard", label: "Dashboard", icon: Home }]
    },
    {
      title: "Activite",
      items: [
        { href: "/admin/reservations", label: "Reservations", icon: ReceiptText, badgeKey: "pending" },
        { href: "/admin/payments", label: "Paiements", icon: Wallet },
        { href: "/admin/contracts", label: "Contrats", icon: FileText }
      ]
    },
    {
      title: "Flotte & offres",
      items: [
        { href: "/admin/cars", label: "Voitures", icon: CarFront },
        { href: "/admin/packs", label: "Packs", icon: LayoutTemplate },
        { href: "/admin/options", label: "Options", icon: SlidersHorizontal }
      ]
    },
    {
      title: "Equipe",
      items: [
        { href: "/admin/clients", label: "Clients", icon: Users },
        { href: "/admin/employees", label: "Employes", icon: BriefcaseBusiness }
      ]
    },
    {
      title: "Compte",
      items: [
        { href: "/admin/account", label: "Mon compte", icon: KeyRound },
        { href: "/admin/settings", label: "Parametres", icon: Settings2, permission: "settings.manage" }
      ]
    }
  ];

  return sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => !item.permission || permissions.includes(item.permission))
    }))
    .filter((section) => section.items.length);
}

function buildSuperAdminSections() {
  return [
    { title: "Pilotage", items: [{ href: "/super-admin/dashboard", label: "Dashboard", icon: Home }] },
    {
      title: "Reseau",
      items: [
        { href: "/super-admin/agency-settings", label: "Agences", icon: Building2 },
        { href: "/super-admin/visual-settings", label: "Visuel", icon: Palette },
        { href: "/super-admin/reservation-settings", label: "Reservations", icon: ShieldCheck }
      ]
    },
    {
      title: "Securite",
      items: [
        { href: "/super-admin/roles-permissions", label: "Roles & droits", icon: Wrench },
        { href: "/super-admin/audit-logs", label: "Audit logs", icon: ClipboardList },
        { href: "/super-admin/feature-flags", label: "Feature flags", icon: Flag }
      ]
    },
    {
      title: "Communication",
      items: [
        { href: "/super-admin/notification-settings", label: "Notifications", icon: BellRing },
        { href: "/super-admin/document-settings", label: "Documents", icon: FileText }
      ]
    },
    { title: "Compte", items: [{ href: "/super-admin/account", label: "Mon compte", icon: KeyRound }] }
  ];
}

function SidebarLink({ item, collapsed, badge, onNavigate }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.href}
      onClick={onNavigate}
      className="group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium outline-none"
    >
      {({ isActive }) => (
        <>
          {isActive ? (
            <motion.span
              layoutId="sidebar-active"
              className="absolute inset-0 rounded-xl bg-white/[0.09] ring-1 ring-inset ring-white/10"
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
            />
          ) : null}
          {isActive ? (
            <span className="absolute -left-3 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full" style={{ background: "var(--primary-color)" }} />
          ) : null}
          <span className={`relative z-10 flex h-5 w-5 shrink-0 items-center justify-center transition-colors duration-calm ease-calm ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-100"}`}>
            <Icon size={18} strokeWidth={1.9} />
          </span>
          {!collapsed ? (
            <span className={`relative z-10 flex-1 truncate transition-colors duration-calm ease-calm ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-100"}`}>
              {item.label}
            </span>
          ) : null}
          {!collapsed && badge ? (
            <span className="relative z-10 rounded-full bg-amber-400/15 px-2 py-0.5 text-[0.68rem] font-semibold tabular-nums text-amber-300 ring-1 ring-inset ring-amber-300/20">
              {badge}
            </span>
          ) : null}
          {collapsed && badge ? <span className="absolute right-2 top-2 z-10 h-2 w-2 rounded-full bg-amber-400" /> : null}
          {collapsed ? (
            <span className="pointer-events-none absolute left-full z-overlay ml-3 whitespace-nowrap rounded-lg bg-ink-800 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-deep ring-1 ring-white/10 transition-opacity duration-calm ease-calm group-hover:opacity-100 group-focus-visible:opacity-100">
              {item.label}
            </span>
          ) : null}
        </>
      )}
    </NavLink>
  );
}

function SidebarContent({ sections, collapsed, isSuperAdmin, badges, onNavigate, onToggle, showToggle }) {
  return (
    <div className="flex h-full flex-col">
      <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"} px-4 pb-4 pt-5`}>
        <Link to="/" className="flex items-center gap-3" onClick={onNavigate}>
          {isSuperAdmin ? (
            <img src="/app-logo.svg" alt="" className="h-9 w-9 shrink-0 rounded-xl shadow-glow" />
          ) : (
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-glow"
              style={{ background: "linear-gradient(135deg, var(--primary-color), color-mix(in srgb, var(--primary-color) 55%, black))" }}
            >
              <CarFront size={18} />
            </span>
          )}
          {!collapsed ? (
            <span className="min-w-0">
              <span className="block font-display text-[0.95rem] font-semibold leading-tight text-white">{isSuperAdmin ? "Car Rental" : "Atlas Drive"}</span>
              <span className="block text-[0.7rem] text-slate-500">{isSuperAdmin ? "Super admin SaaS" : "Agence"}</span>
            </span>
          ) : null}
        </Link>
        {showToggle && !collapsed ? (
          <button
            type="button"
            onClick={onToggle}
            aria-label="Reduire la navigation"
            className="rounded-lg p-1.5 text-slate-500 transition-colors duration-calm ease-calm hover:bg-white/5 hover:text-slate-200"
          >
            <ChevronsLeft size={16} />
          </button>
        ) : null}
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-4 pt-2">
        {sections.map((section) => (
          <div key={section.title}>
            {!collapsed ? (
              <p className="mb-1.5 px-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-600">{section.title}</p>
            ) : (
              <div className="mx-3 mb-2 h-px bg-white/5" />
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <SidebarLink
                  key={item.href}
                  item={item}
                  collapsed={collapsed}
                  badge={item.badgeKey ? badges[item.badgeKey] : 0}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {showToggle && collapsed ? (
        <div className="px-3 pb-4">
          <button
            type="button"
            onClick={onToggle}
            aria-label="Developper la navigation"
            className="flex w-full items-center justify-center rounded-xl p-2.5 text-slate-500 transition-colors duration-calm ease-calm hover:bg-white/5 hover:text-slate-200"
          >
            <ChevronsLeft size={16} className="rotate-180" />
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function DashboardLayout({ mode = "admin" }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isSuperAdmin = mode === "super-admin";
  const permissions = user?.permissions || [];

  const sections = useMemo(
    () => (isSuperAdmin ? buildSuperAdminSections() : buildAdminSections(permissions)),
    [isSuperAdmin, permissions]
  );
  const flatLinks = useMemo(() => sections.flatMap((section) => section.items.map((item) => ({ ...item, section: section.title }))), [sections]);
  const active = flatLinks.find((link) => location.pathname.startsWith(link.href));
  const currentLabel = active?.label || "Dashboard";
  const currentSection = active?.section || "Pilotage";

  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(COLLAPSE_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [pending, setPending] = useState(0);
  const searchRef = useRef(null);
  const profileRef = useRef(null);

  function toggleCollapsed() {
    setCollapsed((value) => {
      const next = !value;
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {
        /* storage unavailable: keep in-memory state */
      }
      return next;
    });
  }

  // Pending reservations count (existing endpoint) drives the nav badge and the bell.
  useEffect(() => {
    if (isSuperAdmin) return undefined;
    let alive = true;
    api.get("/dashboard/stats")
      .then((response) => {
        if (alive) setPending(Number(response.data?.pendingReservations || 0));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [isSuperAdmin, location.pathname]);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
    setSearchOpen(false);
    setQuery("");
  }, [location.pathname]);

  useEffect(() => {
    function onKey(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === "Escape") {
        setSearchOpen(false);
        setProfileOpen(false);
        setMobileOpen(false);
      }
    }
    function onClick(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, []);

  const results = query.trim()
    ? flatLinks.filter((link) => link.label.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 6)
    : [];
  const badges = { pending };
  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Compte";
  const accountPath = isSuperAdmin ? "/super-admin/account" : "/admin/account";
  const contextLabel = isSuperAdmin ? "Vision reseau" : user?.agency?.name || "Agence";

  return (
    <div className="min-h-screen" style={{ background: "var(--canvas)" }}>
      {/* Desktop sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-sidebar hidden bg-ink-900 transition-[width] duration-calm ease-calm lg:block ${collapsed ? "w-[76px]" : "w-[264px]"}`}
        style={{ boxShadow: "1px 0 0 rgba(255,255,255,0.04)" }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(22rem 16rem at 0% 0%, color-mix(in srgb, var(--primary-color) 16%, transparent), transparent 70%)" }}
        />
        <div className="relative h-full">
          <SidebarContent
            sections={sections}
            collapsed={collapsed}
            isSuperAdmin={isSuperAdmin}
            badges={badges}
            onToggle={toggleCollapsed}
            showToggle
          />
        </div>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.button
              key="overlay"
              type="button"
              aria-label="Fermer la navigation"
              className="fixed inset-0 z-overlay bg-ink-950/50 backdrop-blur-[2px] lg:hidden"
              onClick={() => setMobileOpen(false)}
              {...overlay}
            />
            <motion.aside key="drawer" className="fixed inset-y-0 left-0 z-drawer w-[280px] bg-ink-900 lg:hidden" {...drawer}>
              <button
                type="button"
                aria-label="Fermer"
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"
              >
                <X size={18} />
              </button>
              <SidebarContent
                sections={sections}
                collapsed={false}
                isSuperAdmin={isSuperAdmin}
                badges={badges}
                onNavigate={() => setMobileOpen(false)}
              />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <div className={`flex min-h-screen flex-col transition-[padding] duration-calm ease-calm ${collapsed ? "lg:pl-[76px]" : "lg:pl-[264px]"}`}>
        {/* Topbar */}
        <header
          className="sticky top-0 z-topbar border-b backdrop-blur-xl"
          style={{ borderColor: "var(--line-color)", background: "color-mix(in srgb, var(--canvas) 82%, transparent)" }}
        >
          <div className="flex items-center gap-3 px-4 py-3 md:px-6">
            <button
              type="button"
              aria-label="Ouvrir la navigation"
              onClick={() => setMobileOpen(true)}
              className="rounded-xl p-2 text-slate-600 transition-colors duration-calm ease-calm hover:bg-slate-900/5 lg:hidden"
            >
              <Menu size={20} />
            </button>

            <div className="hidden min-w-0 md:block">
              <p className="eyebrow !text-[0.65rem]">{currentSection}</p>
              <p className="truncate font-display text-[0.95rem] font-semibold leading-tight text-slate-900">{currentLabel}</p>
            </div>

            {/* Quick navigation search (UI over existing routes) */}
            <div className="relative mx-auto w-full max-w-md">
              <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                ref={searchRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 120)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && results[0]) navigate(results[0].href);
                }}
                placeholder="Aller a une page..."
                aria-label="Recherche de navigation"
                className="input !rounded-full !py-2 !pl-10 !pr-14 text-sm"
              />
              <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border px-1.5 py-0.5 text-[0.65rem] font-medium text-slate-400 sm:block" style={{ borderColor: "var(--line-strong)" }}>
                Ctrl K
              </kbd>
              <AnimatePresence>
                {searchOpen && query.trim() ? (
                  <motion.div
                    className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-2xl border bg-white p-1.5 shadow-lift"
                    style={{ borderColor: "var(--line-color)" }}
                    {...overlay}
                  >
                    {results.length ? (
                      results.map((link) => {
                        const Icon = link.icon;
                        return (
                          <button
                            key={link.href}
                            type="button"
                            onMouseDown={() => navigate(link.href)}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-slate-700 transition-colors duration-calm ease-calm hover:bg-slate-50"
                          >
                            <Icon size={16} className="text-slate-400" />
                            <span className="flex-1 font-medium">{link.label}</span>
                            <span className="text-xs text-slate-400">{link.section}</span>
                          </button>
                        );
                      })
                    ) : (
                      <p className="px-3 py-3 text-sm text-slate-500">Aucune page trouvee.</p>
                    )}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-2">
              {!isSuperAdmin ? (
                <Link to="/admin/cars/create" className="btn-primary hidden !py-2 xl:inline-flex">
                  <Plus size={16} className="mr-1.5" />
                  Nouvelle voiture
                </Link>
              ) : null}

              <span className="hidden items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-xs font-medium text-slate-600 md:inline-flex" style={{ borderColor: "var(--line-color)" }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--primary-color)" }} />
                <span className="max-w-[9rem] truncate">{contextLabel}</span>
              </span>

              {!isSuperAdmin ? (
                <Link
                  to="/admin/reservations"
                  aria-label={pending ? `${pending} reservations en attente` : "Reservations"}
                  className="relative rounded-xl p-2 text-slate-600 transition-colors duration-calm ease-calm hover:bg-slate-900/5"
                >
                  <BellRing size={19} />
                  {pending ? (
                    <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[0.6rem] font-bold text-white">
                      {pending > 9 ? "9+" : pending}
                    </span>
                  ) : null}
                </Link>
              ) : null}

              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen((value) => !value)}
                  aria-expanded={profileOpen}
                  className="flex items-center gap-2 rounded-full border bg-white py-1 pl-1 pr-2.5 transition-shadow duration-calm ease-calm hover:shadow-soft"
                  style={{ borderColor: "var(--line-color)" }}
                >
                  <Avatar name={fullName} size={30} />
                  <span className="hidden max-w-[8rem] truncate text-sm font-medium text-slate-800 md:block">{user?.firstName || "Compte"}</span>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform duration-calm ease-calm ${profileOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {profileOpen ? (
                    <motion.div
                      className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-2xl border bg-white shadow-lift"
                      style={{ borderColor: "var(--line-color)" }}
                      {...overlay}
                    >
                      <div className="border-b px-4 py-3" style={{ borderColor: "var(--line-color)" }}>
                        <p className="truncate text-sm font-semibold text-slate-900">{fullName}</p>
                        <p className="truncate text-xs text-slate-500">{user?.email}</p>
                        <span className="mt-2 inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-slate-600">
                          {user?.type || "-"}
                        </span>
                      </div>
                      <div className="p-1.5">
                        <Link to={accountPath} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 transition-colors duration-calm ease-calm hover:bg-slate-50">
                          <KeyRound size={16} className="text-slate-400" /> Mon compte
                        </Link>
                        <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 transition-colors duration-calm ease-calm hover:bg-slate-50">
                          <ExternalLink size={16} className="text-slate-400" /> Voir le site
                        </Link>
                        <button
                          type="button"
                          onClick={logout}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-rose-600 transition-colors duration-calm ease-calm hover:bg-rose-50"
                        >
                          <LogOut size={16} /> Deconnexion
                        </button>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-6 md:py-8">
          <motion.div key={location.pathname} className="mx-auto w-full max-w-[1500px]" {...pageTransition}>
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
