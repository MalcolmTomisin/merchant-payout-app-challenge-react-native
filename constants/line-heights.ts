/**
 * Semantic line-height tokens for consistent vertical rhythm.
 *
 * Wrap with `verticalScale()` from `@/utils/scale` for
 * density-independent sizing.
 *
 * Migration reference (raw value → token):
 *   24 → LineHeights.body   (default body text)
 *   30 → LineHeights.link   (inline links, slightly taller)
 *   32 → LineHeights.title  (screen titles, headings)
 */
export const LineHeights = Object.freeze({
  /** 24 — body text line height */
  body: 24,
  /** 30 — link / inline interactive text */
  link: 30,
  /** 32 — title / heading line height */
  title: 32,
} as const);

export type LineHeightKey = keyof typeof LineHeights;
export type LineHeightValue = (typeof LineHeights)[LineHeightKey];
