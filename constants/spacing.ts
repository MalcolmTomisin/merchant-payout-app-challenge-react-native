/**
 * Semantic spacing tokens for consistent layout across the app.
 *
 * All values are in logical pixels (dp). Wrap with `scale()` or
 * `verticalScale()` from `@/utils/scale` for density-independent sizing.
 *
 * Migration reference (raw value → token):
 *   2  → Spacing.hairline   (minimal row gaps)
 *   4  → Spacing.tight      (micro margin / padding)
 *   8  → Spacing.compact    (field labels, small margins, small border-radius)
 *   12 → Spacing.content    (inner padding, small gaps, separators)
 *   14 → Spacing.element    (button vertical padding, between content & base)
 *   16 → Spacing.base       (primary content padding, horizontal padding)
 *   24 → Spacing.section    (section spacing, modal padding, header margins)
 *   32 → Spacing.block      (large section padding, screen-level margins)
 */
export const Spacing = Object.freeze({
  /** 2 — minimal row spacing, hairline gaps */
  hairline: 2,
  /** 4 — micro spacing (e.g. marginLeft between inline elements) */
  tight: 4,
  /** 8 — compact spacing (field labels, small margins) */
  compact: 8,
  /** 12 — content-level inner padding, small gaps */
  content: 12,
  /** 14 — element-level vertical padding (buttons, rows) */
  element: 14,
  /** 16 — base content padding, standard horizontal/vertical padding */
  base: 16,
  /** 24 — section-level spacing (cards, modals, grouped content) */
  section: 24,
  /** 32 — block-level spacing (screen edges, large separators) */
  block: 32,
} as const);

export type SpacingKey = keyof typeof Spacing;
export type SpacingValue = (typeof Spacing)[SpacingKey];
