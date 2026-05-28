"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "./cn";

type Variant = "rise" | "fade" | "phone";

type Props = {
  children: ReactNode;
  /** Animation flavor. `phone` is a slightly longer travel + scale used for device mockups. */
  variant?: Variant;
  /** Stagger delay in seconds. Apply small values (0.08–0.24) for sibling sequencing. */
  delay?: number;
  /** Tag override — defaults to `<div>`. Useful when wrapping <li>/<article>/<section>. */
  as?: "div" | "section" | "article" | "li";
  className?: string;
};

const variants = {
  rise: {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0 },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  phone: {
    hidden: { opacity: 0, y: 64, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
} as const;

/**
 * Lightweight scroll-reveal wrapper around Framer Motion. Reveals children
 * once on viewport entry with a tasteful rise / fade.
 *
 * Respects `prefers-reduced-motion` — falls through to a no-op render so
 * users with vestibular sensitivity get the static layout immediately.
 */
export function ScrollReveal({
  children,
  variant = "rise",
  delay = 0,
  as = "div",
  className,
}: Props) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
      variants={variants[variant]}
      transition={{
        duration: variant === "phone" ? 0.9 : 0.7,
        ease: [0.22, 1, 0.36, 1],
        delay,
      }}
    >
      {children}
    </MotionTag>
  );
}
