import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EASE_GSAP } from "../../motion";

gsap.registerPlugin(ScrollTrigger);

// Scroll-linked Y drift (0 -> -amount %). Marketing visuals only.
export default function Parallax({ children, className = "", amount = 10 }) {
  const ref = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 1023px)").matches;
    if (reduce || small || !ref.current) return undefined;

    const tween = gsap.to(ref.current, {
      yPercent: -amount,
      ease: EASE_GSAP,
      scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true }
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [amount]);

  return <div ref={ref} className={className}>{children}</div>;
}
