import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CalendarDays, Check, CreditCard, FileCheck2 } from "lucide-react";
import { DURATION, EASE } from "../../motion";

const steps = [
  {
    key: "reservation",
    label: "Reservation",
    icon: CalendarDays,
    lines: [["Depart", "12 oct. 10:00"], ["Retour", "15 oct. 18:00"], ["Pack", "Confort"]]
  },
  {
    key: "payment",
    label: "Avance",
    icon: CreditCard,
    lines: [["Total estime", "1 450 MAD"], ["Avance", "290 MAD"], ["Reste a regler", "1 160 MAD"]]
  },
  {
    key: "confirmed",
    label: "Confirmee",
    icon: FileCheck2,
    lines: [["Reference", "RES-2048"], ["Statut", "Confirmee"], ["Contrat", "Disponible"]]
  }
];

// Mini animated interface illustrating the booking flow (illustrative values).
export default function LiveBookingMockup() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce) return undefined;
    const timer = setInterval(() => setIndex((value) => (value + 1) % steps.length), 3200);
    return () => clearInterval(timer);
  }, [reduce]);

  const step = steps[index];
  const Icon = step.icon;

  return (
    <div className="relative mx-auto w-full max-w-sm" aria-hidden="true">
      <div
        className="anim-breathe absolute -inset-10 rounded-full"
        style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--primary-color) 22%, transparent), transparent 65%)" }}
      />
      <div className="relative rounded-[1.75rem] border border-slate-900/[0.06] bg-white p-5 shadow-deep">
        <div className="flex items-center gap-2">
          {steps.map((item, itemIndex) => (
            <div key={item.key} className="flex flex-1 items-center gap-2">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[0.7rem] font-bold transition-colors duration-calm ease-calm ${
                  itemIndex <= index ? "text-white" : "bg-slate-100 text-slate-400"
                }`}
                style={itemIndex <= index ? { background: "var(--primary-color)" } : undefined}
              >
                {itemIndex < index ? <Check size={14} /> : itemIndex + 1}
              </span>
              {itemIndex < steps.length - 1 ? (
                <span className="h-[2px] flex-1 overflow-hidden rounded-full bg-slate-100">
                  <motion.span
                    className="block h-full"
                    style={{ background: "var(--primary-color)" }}
                    animate={{ width: itemIndex < index ? "100%" : "0%" }}
                    transition={{ duration: DURATION.reveal, ease: EASE }}
                  />
                </span>
              ) : null}
            </div>
          ))}
        </div>

        <div className="relative mt-5 h-[188px] overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: DURATION.base, ease: EASE }}
              className="absolute inset-0"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                  <Icon size={18} />
                </span>
                <div>
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-slate-400">Etape {index + 1}</p>
                  <p className="font-display text-lg font-bold text-slate-900">{step.label}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {step.lines.map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5 text-sm">
                    <span className="text-slate-500">{label}</span>
                    <span className="font-semibold text-slate-900">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
