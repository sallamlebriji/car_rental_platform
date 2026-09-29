import { motion } from "framer-motion";
import { DURATION, EASE, STAGGER } from "../../motion";

// Word-by-word headline reveal. Reserved for marketing headlines / hero titles.
export default function SplitWords({ text, className = "", delay = 0, as = "h1" }) {
  const Tag = motion[as] || motion.h1;
  const words = String(text || "").split(" ");

  return (
    <Tag
      className={className}
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: STAGGER.word, delayChildren: delay } } }}
      aria-label={text}
      style={{ perspective: 800 }}
    >
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden pb-[0.12em] align-bottom" aria-hidden="true">
          <motion.span
            className="inline-block origin-bottom"
            variants={{
              hidden: { y: "110%", rotateX: -55, opacity: 0 },
              show: { y: 0, rotateX: 0, opacity: 1, transition: { duration: DURATION.headline, ease: EASE } }
            }}
          >
            {word}
            {index < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
