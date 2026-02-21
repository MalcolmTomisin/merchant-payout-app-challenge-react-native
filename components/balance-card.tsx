/**
 * BalanceCard — displays available and pending balances side-by-side
 */
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { formatCurrency } from '@/utils/format-currency';
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
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 12,
  },
  column: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 4,
  },
  amount: {
    fontSize: 22,
  },
});
