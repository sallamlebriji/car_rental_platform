import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { currency } from "../utils/format";
import { useThemeSettings } from "../context/ThemeContext";
import StatusBadge from "../components/StatusBadge";
import { Item, Stagger } from "../components/ui/Reveal";
import { DURATION, EASE } from "../motion";

export default function ReservationSuccessPage() {
  const { state } = useLocation();
  const { buildClientPath } = useThemeSettings();
  const cataloguePath = buildClientPath("/cars");
  const reservationsPath = buildClientPath("/my-reservations");

  return (
    <div className="mx-auto max-w-xl py-6 text-center">
      <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
        <span
          className="anim-breathe absolute inset-0 rounded-full"
          style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--primary-color) 28%, transparent), transparent 70%)" }}
        />
        <svg viewBox="0 0 64 64" className="absolute inset-0 h-24 w-24 -rotate-90" aria-hidden="true">
          <motion.circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="var(--primary-color)"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: DURATION.counter, ease: EASE }}
          />
        </svg>
        <motion.span
          className="relative flex h-14 w-14 items-center justify-center rounded-full text-white"
          style={{ background: "var(--primary-color)" }}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: DURATION.reveal, ease: EASE, delay: 0.5 }}
        >
          <Check size={26} strokeWidth={3} />
        </motion.span>
      </div>

      <Stagger delay={0.4} className="mt-8">
        <Item as="h1" className="font-display text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Demande envoyee</Item>
        <Item as="p" className="mx-auto mt-3 max-w-md text-slate-500">
          Votre reservation a bien ete transmise a l'agence. Vous serez informe des sa validation.
        </Item>

        {state ? (
          <Item className="mt-10 overflow-hidden rounded-card-primary border border-slate-900/[0.06] bg-white text-left shadow-lift">
            <div className="flex items-center justify-between border-b border-dashed border-slate-200 px-6 py-5">
              <div>
                <p className="text-xs text-slate-500">Reference</p>
                <p className="font-display text-xl font-bold tracking-tight text-slate-900">{state.reference}</p>
              </div>
              <StatusBadge status={state.status} />
            </div>
            <div className="grid grid-cols-2 divide-x divide-slate-900/[0.06]">
              <div className="px-6 py-5">
                <p className="text-xs text-slate-500">Total</p>
                <p className="mt-1 font-display text-2xl font-bold text-slate-900">{currency(state.totalPrice)}</p>
              </div>
              <div className="px-6 py-5">
                <p className="text-xs text-slate-500">Avance</p>
                <p className="mt-1 font-display text-2xl font-bold text-slate-900">{currency(state.advanceAmount)}</p>
              </div>
            </div>
          </Item>
        ) : null}

        <Item className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to={cataloguePath} className="btn-secondary">Retour au catalogue</Link>
          <Link to={reservationsPath} className="btn-primary gap-2">
            Mes reservations <ArrowRight size={16} />
          </Link>
        </Item>
      </Stagger>
    </div>
  );
}
