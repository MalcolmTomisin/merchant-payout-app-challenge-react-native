/**
 * ActivityRow — single-row layout showing description (left) and amount (right)
 * Used in both the Home screen (3 recent items) and the Transaction List modal
 */
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { formatCurrency } from '@/utils/format-currency';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { ActivityItem } from '@/types/api';

interface ActivityRowProps {
  item: ActivityItem;
  /** Whether to show a bottom separator (default: true) */
  showSeparator?: boolean;
}

export function ActivityRow({ item, showSeparator = true }: ActivityRowProps) {
  const separatorColor = useThemeColor({}, 'icon');
  const isPositive = item.amount >= 0;

  return (
    <View
      style={styles.container}
      accessibilityLabel={`${item.description} ${formatCurrency(item.amount, item.currency)}`}
    >
      <View style={styles.row}>
        <ThemedText style={styles.description} numberOfLines={1}>
          {item.description}
        </ThemedText>
        <ThemedText
          style={[
            styles.amount,
            { color: isPositive ? '#16a34a' : '#dc2626' },
          ]}
        >
          {formatCurrency(item.amount, item.currency)}
        </ThemedText>
      </View>
      {showSeparator && (
        <View style={[styles.separator, { backgroundColor: separatorColor }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  description: {
    flex: 1,
    marginRight: 16,
    fontSize: 16,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginTop: 12,
    opacity: 0.3,
  },
});
