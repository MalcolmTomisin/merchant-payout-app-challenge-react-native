/**
 * BalanceCard — displays available and pending balances side-by-side
 */
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { formatCurrency } from '@/utils/format-currency';
import { Spacing, FontSizes, BorderRadius } from '@/constants/design-tokens';
import { scale, moderateScale } from '@/utils/scale';
import type { Currency } from '@/types/api';

interface BalanceCardProps {
  availableBalance: number;
  pendingBalance: number;
  currency: Currency;
}

export function BalanceCard({ availableBalance, pendingBalance, currency }: BalanceCardProps) {
  return (
    <ThemedView style={styles.card}>
      <ThemedText type="subtitle">Account Balance</ThemedText>
      <View style={styles.row}>
        <View style={styles.column}>
          <ThemedText style={styles.label}>Available</ThemedText>
          <ThemedText
            type="defaultSemiBold"
            style={styles.amount}
            accessibilityLabel={`Available balance ${formatCurrency(availableBalance, currency)}`}
          >
            {formatCurrency(availableBalance, currency)}
          </ThemedText>
        </View>
        <View style={styles.column}>
          <ThemedText style={styles.label}>Pending</ThemedText>
          <ThemedText
            type="defaultSemiBold"
            style={styles.amount}
            accessibilityLabel={`Pending balance ${formatCurrency(pendingBalance, currency)}`}
          >
            {formatCurrency(pendingBalance, currency)}
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: scale(Spacing.base),
    borderRadius: scale(BorderRadius.medium),
    marginBottom: scale(Spacing.section),
  },
  row: {
    flexDirection: 'row',
    marginTop: scale(Spacing.content),
  },
  column: {
    flex: 1,
  },
  label: {
    fontSize: moderateScale(FontSizes.caption),
    opacity: 0.6,
    marginBottom: scale(Spacing.tight),
  },
  amount: {
    fontSize: moderateScale(FontSizes.xl),
  },
});
