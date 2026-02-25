/**
 * Semantic font-size tokens for consistent typography across the app.
 *
 * All values are in logical pixels (sp). Wrap with `moderateScale()` from
 * `@/utils/scale` for density-independent sizing that avoids excessive
 * growth on tablets.
 *
 * Migration reference (raw value → token):
 *   12 → FontSizes.xs        (chevron indicators, fine print)
 *   13 → FontSizes.small     (date labels, status text)
 *   14 → FontSizes.caption   (secondary / helper text)
 *   16 → FontSizes.body      (default body text — also replaces the 17 outlier)
 *   18 → FontSizes.lg        (CTA buttons, picker titles)
 *   20 → FontSizes.subtitle  (section subtitles)
 *   22 → FontSizes.xl        (balance amounts, emphasis)
 *   32 → FontSizes.title     (screen titles)
 *   36 → FontSizes.icon      (large icon glyphs)
 */
export const FontSizes = Object.freeze({
  /** 12 — extra-small text (indicators, fine print) */
  xs: 12,
  /** 13 — small text (dates, status labels) */
  small: 13,
  /** 14 — captions, helper text */
  caption: 14,
  /** 16 — standard body text */
  body: 16,
  /** 18 — large body / button CTA text */
  lg: 18,
  /** 20 — subtitles */
  subtitle: 20,
  /** 22 — extra-large emphasis (balance amounts) */
  xl: 22,
  /** 32 — screen titles */
  title: 32,
  /** 36 — icon-sized text glyphs */
  icon: 36,
} as const);

export type FontSizeKey = keyof typeof FontSizes;
export type FontSizeValue = (typeof FontSizes)[FontSizeKey];
