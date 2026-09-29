import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

const SPRING = { stiffness: 140, damping: 20, mass: 0.6 };

// Very light 3D tilt (max ±4° X / ±6° Y) with a glare that follows the cursor.
// Disabled on touch and with prefers-reduced-motion.
export default function TiltCard({ children, className = "", maxX = 4, maxY = 6, ...rest }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const rx = useSpring(useMotionValue(0), SPRING);
  const ry = useSpring(useMotionValue(0), SPRING);

  function handleMove(event) {
    if (reduce || event.pointerType === "touch" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    ry.set((px - 0.5) * 2 * maxY);
    rx.set((0.5 - py) * 2 * maxX);
    ref.current.style.setProperty("--mx", `${px * 100}%`);
    ref.current.style.setProperty("--my", `${py * 100}%`);
  }

  function handleLeave() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <div className="scene-3d">
      <motion.div
        ref={ref}
        className={`tilt-glare preserve-3d relative ${className}`}
        style={{ rotateX: rx, rotateY: ry }}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        {...rest}
      >
        {children}
      </motion.div>
    </div>
  );
}
