import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { FontSizes, LineHeights } from '@/constants/design-tokens';
import { moderateScale } from '@/utils/scale';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: moderateScale(FontSizes.body),
    lineHeight: moderateScale(LineHeights.body),
  },
  defaultSemiBold: {
    fontSize: moderateScale(FontSizes.body),
    lineHeight: moderateScale(LineHeights.body),
    fontWeight: '600',
  },
  title: {
    fontSize: moderateScale(FontSizes.title),
    fontWeight: 'bold',
    lineHeight: moderateScale(LineHeights.title),
  },
  subtitle: {
    fontSize: moderateScale(FontSizes.subtitle),
    fontWeight: 'bold',
  },
  link: {
    lineHeight: moderateScale(LineHeights.link),
    fontSize: moderateScale(FontSizes.body),
    color: '#0a7ea4',
  },
});
