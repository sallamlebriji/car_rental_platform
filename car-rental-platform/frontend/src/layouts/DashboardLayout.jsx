import {
  BellRing,
  BriefcaseBusiness,
  Building2,
  CarFront,
  Flag,
  FileText,
  Home,
  KeyRound,
  LayoutTemplate,
  LogOut,
  Palette,
  ReceiptText,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  ClipboardList,
  Users,
  Wrench
} from "lucide-react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function buildAdminLinks(permissions) {
  return [
    { href: "/admin/dashboard", label: "Dashboard", icon: Home },
    { href: "/admin/cars", label: "Voitures", icon: CarFront },
    { href: "/admin/reservations", label: "Reservations", icon: ReceiptText },
    { href: "/admin/clients", label: "Clients", icon: Users },
    { href: "/admin/employees", label: "Employes", icon: BriefcaseBusiness },
    { href: "/admin/packs", label: "Packs", icon: LayoutTemplate },
    { href: "/admin/options", label: "Options", icon: SlidersHorizontal },
    { href: "/admin/payments", label: "Paiements", icon: ReceiptText },
    { href: "/admin/contracts", label: "Contrats", icon: FileText },
    { href: "/admin/account", label: "Mon compte", icon: KeyRound },
    { href: "/admin/settings", label: "Parametres", icon: Settings2, permission: "settings.manage" }
  ].filter((item) => !item.permission || permissions.includes(item.permission));
}

function buildSuperAdminLinks() {
  return [
    { href: "/super-admin/dashboard", label: "Dashboard", icon: Home },
    { href: "/super-admin/agency-settings", label: "Agences", icon: Building2 },
    { href: "/super-admin/visual-settings", label: "Visuel", icon: Palette },
    { href: "/super-admin/reservation-settings", label: "Reservations", icon: ShieldCheck },
    { href: "/super-admin/roles-permissions", label: "Roles & droits", icon: Wrench },
    { href: "/super-admin/notification-settings", label: "Notifications", icon: BellRing },
    { href: "/super-admin/document-settings", label: "Documents", icon: FileText },
    { href: "/super-admin/audit-logs", label: "Audit logs", icon: ClipboardList },
    { href: "/super-admin/feature-flags", label: "Feature flags", icon: Flag },
    { href: "/super-admin/account", label: "Mon compte", icon: KeyRound }
  ];
}

function getPageLabel(links, pathname) {
  const active = links.find((link) => pathname.startsWith(link.href));
  return active?.label || "Dashboard";
}

export default function DashboardLayout({ mode = "admin" }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isSuperAdmin = mode === "super-admin";
  const permissions = user?.permissions || [];
  const links = isSuperAdmin ? buildSuperAdminLinks() : buildAdminLinks(permissions);
  const currentLabel = getPageLabel(links, location.pathname);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[300px_1fr]">
        <aside
          className={`relative overflow-hidden px-6 py-8 text-white ${
            isSuperAdmin
              ? "bg-slate-950"
              : "bg-slate-950"
          }`}
        >
          <div
            className={`absolute inset-0 ${
              isSuperAdmin
                ? "bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.2),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.12),transparent_30%)]"
                : "bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.12),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.08),transparent_28%)]"
            }`}
          />

          <div className="relative flex h-full flex-col">
            <div className="space-y-4">
              <Link to="/" className="inline-flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
                  {isSuperAdmin ? <Building2 size={22} /> : <CarFront size={22} />}
                </div>
                <div>
                  <p className="text-lg font-semibold tracking-tight">Atlas Drive</p>
                  <p className="text-sm text-slate-400">{isSuperAdmin ? "Centre de pilotage reseau" : "Pilotage agence"}</p>
                </div>
              </Link>

              <div className="rounded-[1.7rem] border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  {isSuperAdmin ? "Super administration" : "Administration"}
                </p>
                <p className="mt-3 text-2xl font-semibold">{user?.firstName} {user?.lastName}</p>
                <p className="mt-1 text-sm text-slate-400">{user?.email}</p>
              </div>
            </div>

            <nav className="mt-8 space-y-2">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.href}
                    to={link.href}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? "bg-white text-slate-950 shadow-sm"
                          : "text-slate-300 hover:bg-white/8 hover:text-white"
                      }`
                    }
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900/40 transition group-hover:bg-white/10">
                      <Icon size={18} />
                    </span>
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="mt-auto pt-8">
              <button
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                onClick={logout}
              >
                <LogOut size={16} />
                Deconnexion
              </button>
            </div>
          </div>
        </aside>

        <div className="flex min-h-screen flex-col">
          <header className="border-b border-slate-200 bg-white/90 px-6 py-5 backdrop-blur">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  {isSuperAdmin ? "Pilotage global" : "Espace agence"}
                </p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{currentLabel}</h1>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {isSuperAdmin ? (
                  <div className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white">
                    Super admin
                  </div>
                ) : (
                  <div className="rounded-full bg-teal-600 px-4 py-2 text-sm font-medium text-white">
                    Espace admin
                  </div>
                )}
                <div className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
                  {user?.type || "-"}
                </div>
              </div>
            </div>
          </header>

          <main className={`${isSuperAdmin ? "bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)]" : "bg-slate-100"} flex-1 p-6`}>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
