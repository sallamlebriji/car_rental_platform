import { DURATION } from "./duration";
import { EASE } from "./easing";
import { STAGGER } from "./stagger";

// Barely-noticeable entrance: opacity 0 -> 1, y 20 -> 0.
export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: DURATION.reveal, ease: EASE } }
};

export const fade = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DURATION.base, ease: EASE } }
};

export const staggerContainer = (stagger = STAGGER.list, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } }
});

export const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: DURATION.reveal, ease: EASE } }
};

export const overlay = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: DURATION.base, ease: EASE } },
  exit: { opacity: 0, transition: { duration: DURATION.fast, ease: EASE } }
};

export const drawer = {
  initial: { x: "-100%" },
  animate: { x: 0, transition: { duration: DURATION.base, ease: EASE } },
  exit: { x: "-100%", transition: { duration: DURATION.base, ease: EASE } }
};
