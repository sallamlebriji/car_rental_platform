import { motion } from "framer-motion";
import { fadeUp, staggerContainer, STAGGER } from "../../motion";

// Group of elements that appear one after the other, once, on first view.
export function Stagger({ children, className, stagger = STAGGER.list, delay = 0, as = "div", ...rest }) {
  const Tag = motion[as] || motion.div;
  return (
    <Tag
      className={className}
      variants={staggerContainer(stagger, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// Single item inside <Stagger>.
export function Item({ children, className, as = "div", ...rest }) {
  const Tag = motion[as] || motion.div;
  return (
    <Tag className={className} variants={fadeUp} {...rest}>
      {children}
    </Tag>
  );
}

// Standalone reveal (not inside a Stagger).
export function Reveal({ children, className, delay = 0, as = "div", ...rest }) {
  const Tag = motion[as] || motion.div;
  return (
    <Tag
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
