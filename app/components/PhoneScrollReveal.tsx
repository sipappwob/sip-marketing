"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import type { ReactNode } from "react";
import { useRef } from "react";
import { cn } from "./cn";

type Props = {
  children: ReactNode;
  /**
   * Initial rotation angle (degrees) the phone starts at when it first
   * enters the viewport from below. Positive = clockwise lean, negative =
   * counter-clockwise. Vary by row for an editorial stack effect.
   */
  initialRotate?: number;
  /** Initial vertical offset (px) while off-screen. Larger = more "rise". */
  initialY?: number;
  /**
   * Continue rotating in the opposite direction after the phone passes
   * center (for a panning-out effect). Set false for hero phones where you
   * want the final upright pose to stay locked.
   */
  panThrough?: boolean;
  className?: string;
};

/**
 * Scroll-linked phone reveal. Replaces the previous `ScrollReveal variant="phone"`
 * approach (a one-shot in-view animation) with a scrubbing transform tied
 * to the phone's scroll position inside its container.
 *
 * Why scroll-linked: the user wants the phone screens to feel like a
 * camera panning to the correct angle as you scroll, not a single
 * fire-on-entry pop. With `useScroll` + `offset: ["start end", "end start"]`,
 * progress runs 0 → 1 over the phone's entire viewport traversal:
 *
 *   • progress 0.00 — phone is just appearing at the bottom of the viewport
 *   • progress 0.50 — phone is centered (upright, scale 1, opacity 1)
 *   • progress 1.00 — phone is leaving the top of the viewport
 *
 * Rotation, Y-translate, scale, and opacity are all interpolated against
 * this scrubbing value with a `useSpring` smoothing pass so the motion
 * stays buttery on touch devices.
 *
 * Respects `prefers-reduced-motion` — falls through to a static render.
 */
export function PhoneScrollReveal({
  children,
  initialRotate = -7,
  initialY = 80,
  panThrough = true,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Spring-smooth the scroll progress so finger-flicks don't pop the
  // transforms — gives the camera-pan feel the brief asked for.
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    mass: 0.35,
  });

  const exitRotate = panThrough ? -initialRotate * 0.55 : 0;

  const rotate = useTransform(
    progress,
    [0, 0.45, 0.55, 1],
    [initialRotate, 0, 0, exitRotate],
  );
  const y = useTransform(progress, [0, 0.5, 1], [initialY, 0, -28]);
  const scale = useTransform(progress, [0, 0.5, 1], [0.92, 1, 0.97]);
  const opacity = useTransform(
    progress,
    [0, 0.18, 0.85, 1],
    [0.35, 1, 1, 0.85],
  );

  if (reduceMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      style={{
        rotate,
        y,
        scale,
        opacity,
        transformOrigin: "center center",
        willChange: "transform, opacity",
      }}
    >
      {children}
    </motion.div>
  );
}
