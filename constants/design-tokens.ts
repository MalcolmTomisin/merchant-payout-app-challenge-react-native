/**
 * Barrel re-export for all design tokens.
 *
 * Import from here for convenience:
 *   import { Spacing, FontSizes, BorderRadius, LineHeights } from '@/constants/design-tokens';
 *
 * Pair with the scaling utilities for density-independent sizing:
 *   import { scale, moderateScale } from '@/utils/scale';
 */
export { Spacing } from "./spacing";
export type { SpacingKey, SpacingValue } from "./spacing";

export { FontSizes } from "./font-sizes";
export type { FontSizeKey, FontSizeValue } from "./font-sizes";

export { BorderRadius } from "./border-radius";
export type { BorderRadiusKey, BorderRadiusValue } from "./border-radius";

export { LineHeights } from "./line-heights";
export type { LineHeightKey, LineHeightValue } from "./line-heights";
