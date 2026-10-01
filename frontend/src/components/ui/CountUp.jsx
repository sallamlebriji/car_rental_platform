import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { DURATION, EASE } from "../../motion";

// Counts 0 -> value once, when the element first appears.
// `format` receives the current number and returns what to display.
export default function CountUp({ value = 0, format = (n) => Math.round(n).toLocaleString("fr-FR"), className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -5% 0px" });
  const reduce = useReducedMotion();
  const target = Number(value) || 0;
  const [display, setDisplay] = useState(reduce ? target : 0);

  useEffect(() => {
    if (!inView) return undefined;
    if (reduce) {
      setDisplay(target);
      return undefined;
    }
    const controls = animate(0, target, {
      duration: DURATION.counter,
      ease: EASE,
      onUpdate: setDisplay
    });
    return () => controls.stop();
  }, [inView, target, reduce]);

  return <span ref={ref} className={className}>{format(display)}</span>;
}
