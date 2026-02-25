/**
 * TransactionRow — detailed activity row for the transaction list modal.
 * Shows type, description, date (left) and amount, status (right).
 */
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { formatCurrency } from '@/utils/format-currency';
import { formatDate } from '@/utils/format-date';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing, FontSizes } from '@/constants/design-tokens';
import { scale, moderateScale } from '@/utils/scale';
import type { ActivityItem } from '@/types/api';

interface TransactionRowProps {
  item: ActivityItem;
  showSeparator?: boolean;
}

function capitalise(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function TransactionRow({ item, showSeparator = true }: TransactionRowProps) {
  const separatorColor = useThemeColor({}, 'icon');
  const isPositive = item.amount >= 0;

  return (
    <View
      style={styles.container}
      accessibilityLabel={`${capitalise(item.type)} ${item.description} ${formatCurrency(item.amount, item.currency)} ${formatDate(item.date)}`}
    >
      <View style={styles.row}>
        {/* Left column: type, description, date */}
        <View style={styles.leftColumn}>
          <ThemedText type="defaultSemiBold" style={styles.type}>
            {capitalise(item.type)}
          </ThemedText>
          <ThemedText style={styles.description} numberOfLines={1}>
            {item.description}
          </ThemedText>
          <ThemedText style={styles.date}>
            {formatDate(item.date)}
          </ThemedText>
        </View>

        {/* Right column: amount, status */}
        <View style={styles.rightColumn}>
          <ThemedText
            style={[
              styles.amount,
              { color: isPositive ? '#16a34a' : '#dc2626' },
            ]}
          >
            {formatCurrency(item.amount, item.currency)}
          </ThemedText>
          <ThemedText style={styles.status}>
            {capitalise(item.status)}
          </ThemedText>
        </View>
      </View>

      {showSeparator && (
        <View style={[styles.separator, { backgroundColor: separatorColor }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: scale(Spacing.element),
    paddingHorizontal: scale(Spacing.base),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftColumn: {
    flex: 1,
    marginRight: scale(Spacing.base),
  },
  rightColumn: {
    alignItems: 'flex-end',
  },
  type: {
    fontSize: moderateScale(FontSizes.body),
    marginBottom: scale(Spacing.hairline),
  },
  description: {
    fontSize: moderateScale(FontSizes.caption),
    opacity: 0.8,
    marginBottom: scale(Spacing.hairline),
  },
  date: {
    fontSize: moderateScale(FontSizes.small),
    opacity: 0.5,
  },
  amount: {
    fontSize: moderateScale(FontSizes.body),
    fontWeight: '600',
    marginBottom: scale(Spacing.hairline),
  },
  status: {
    fontSize: moderateScale(FontSizes.small),
    opacity: 0.5,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginTop: scale(Spacing.element),
    opacity: 0.3,
  },
});
