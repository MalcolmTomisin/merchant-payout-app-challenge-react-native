/**
 * Density-independent scaling utilities.
 *
 * These helpers scale raw dp/sp values relative to a base design frame
 * (375 × 812, i.e. iPhone X logical size) so the UI looks proportional
 * on every screen size. All outputs are snapped to the nearest physical
 * pixel via `PixelRatio.roundToNearestPixel` for crisp rendering.
 *
 * Usage:
 *   import { scale, verticalScale, moderateScale } from '@/utils/scale';
 *   import { Spacing, FontSizes } from '@/constants/design-tokens';
 *
 *   const styles = StyleSheet.create({
 *     container: { padding: scale(Spacing.base) },       // 16 dp, scaled
 *     title:     { fontSize: moderateScale(FontSizes.title) }, // 32 sp, scaled gently
 *   });
 */
import { Dimensions, PixelRatio } from "react-native";

/** Design reference width (iPhone X logical width in dp). */
const BASE_WIDTH = 375;

/** Design reference height (iPhone X logical height in dp). */
const BASE_HEIGHT = 812;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get("window");

/**
 * Scale a value proportionally to the screen **width**.
 *
 * Best for horizontal dimensions: padding, margin, gap, width, borderRadius.
 */
export function scale(size: number): number {
  return PixelRatio.roundToNearestPixel((SCREEN_WIDTH / BASE_WIDTH) * size);
}

/**
 * Scale a value proportionally to the screen **height**.
 *
 * Best for vertical dimensions: paddingVertical, marginTop/Bottom, height.
 */
export function verticalScale(size: number): number {
  return PixelRatio.roundToNearestPixel((SCREEN_HEIGHT / BASE_HEIGHT) * size);
}

/**
 * Scale a value with a dampening factor to avoid extremes on large screens.
 *
 * `factor` controls how much of the scaling is applied (0 = no scaling,
 * 1 = full `scale()`). The default **0.5** is ideal for font sizes,
 * icon sizes, and border radii where proportional growth should be subtle.
 *
 * Best for: fontSize, lineHeight, iconSize, borderRadius.
 */
export function moderateScale(size: number, factor: number = 0.5): number {
  return PixelRatio.roundToNearestPixel(
    size + (scale(size) - size) * factor,
  );
}
