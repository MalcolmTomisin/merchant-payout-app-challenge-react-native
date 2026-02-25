/**
 * Semantic border-radius tokens for consistent rounding across the app.
 *
 * Wrap with `scale()` from `@/utils/scale` for density-independent sizing.
 *
 * Migration reference (raw value → token):
 *   8    → BorderRadius.small   (small buttons, pickers)
 *   12   → BorderRadius.medium  (cards, inputs, standard buttons)
 *   16   → BorderRadius.large   (modal cards, emphasis containers)
 *   9999 → BorderRadius.full    (circular / pill shapes)
 */
export const BorderRadius = Object.freeze({
  /** 8 — small rounding (compact buttons, pickers) */
  small: 8,
  /** 12 — standard rounding (cards, inputs, buttons) */
  medium: 12,
  /** 16 — large rounding (modals, emphasis containers) */
  large: 16,
  /** 9999 — fully rounded / pill / circle */
  full: 9999,
} as const);

export type BorderRadiusKey = keyof typeof BorderRadius;
export type BorderRadiusValue = (typeof BorderRadius)[BorderRadiusKey];
