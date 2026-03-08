/**
 * CSS animation class name helpers.
 * Replaces framer-motion Variants with pure CSS class strings.
 */

export const ANIMATION_CLASSES = {
  fadeInUp: "animate-slide-up",
  fadeInLeft: "animate-slide-left",
  scaleIn: "animate-scale-in",
  stagger: "stagger-reveal",
  staggerVisible: "stagger-reveal--visible",
} as const;
