import { Sparkles } from "lucide-react";

export const DEMO_PASSWORD = "password123";

export const clientDemoAccounts = [
  { label: "Client demo", hint: "Sara Bennani", email: "client@example.com" }
];

export const agencyDemoAccounts = [
  { label: "Admin agence demo", hint: "Atlas Drive", email: "admin@agency.com" },
  { label: "Super admin demo", hint: "Vision reseau", email: "superadmin@agency.com" }
];

export default function DemoAccounts({ accounts, disabled, onSelect }) {
  if (import.meta.env.VITE_ENABLE_DEMO === "false") return null;

  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-4">
      <p className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Sparkles size={16} /> Comptes de demonstration
      </p>
      <div className="mt-3 grid gap-2">
        {accounts.map((account) => (
          <button
            key={account.email}
            type="button"
            disabled={disabled}
            onClick={() => onSelect({ email: account.email, password: DEMO_PASSWORD })}
            className="flex items-center justify-between rounded-xl bg-white px-4 py-2 text-left text-sm shadow-sm ring-1 ring-slate-200 transition hover:ring-[var(--primary-color)] disabled:opacity-60"
          >
            <span className="font-medium text-slate-900">{account.label}</span>
            <span className="text-xs text-slate-500">{account.email}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
