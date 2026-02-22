/**
 * PayoutResult — displays the success or failure state after a payout attempt.
 * Shows a centered icon, title, message, and an action button.
 */
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { formatCurrency } from '@/utils/format-currency';
import type { Currency } from '@/types/api';

interface PayoutResultProps {
  status: 'success' | 'error';
  /** Amount in lowest denomination (pence/cents) — used for success message */
  amount?: number;
  currency?: Currency;
  /** Error message for failure state */
  errorMessage?: string;
  /** Callback invoked when the action button is pressed */
  onAction: () => void;
}

export function PayoutResult({
  status,
  amount,
  currency,
  errorMessage,
  onAction,
}: PayoutResultProps) {
  const isSuccess = status === 'success';

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        {/* Icon */}
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: isSuccess ? '#22C55E' : 'transparent' },
          ]}
        >
          <ThemedText
            lightColor={isSuccess ? '#fff' : '#EF4444'}
            darkColor={isSuccess ? '#fff' : '#EF4444'}
            style={styles.iconText}
          >
            {isSuccess ? '✓' : '✕'}
          </ThemedText>
        </View>

        {/* Title */}
        <ThemedText
          type="subtitle"
          lightColor={isSuccess ? '#11181C' : '#EF4444'}
          darkColor={isSuccess ? '#ECEDEE' : '#EF4444'}
          style={styles.title}
        >
          {isSuccess ? 'Payout Completed' : 'Unable to Process Payout'}
        </ThemedText>

        {/* Message */}
        <ThemedText
          lightColor={isSuccess ? '#687076' : '#EF4444'}
          darkColor={isSuccess ? '#9BA1A6' : '#EF4444'}
          style={styles.message}
        >
          {isSuccess && amount != null && currency
            ? `Your payout of ${formatCurrency(amount, currency)} has been processed successfully.`
            : errorMessage ?? 'Something went wrong. Please try again.'}
        </ThemedText>

        {/* Action button */}
        <Pressable
          style={styles.actionButton}
          onPress={onAction}
          accessibilityRole="button"
          accessibilityLabel={isSuccess ? 'Create another payout' : 'Try again'}
        >
          <ThemedText lightColor="#fff" darkColor="#fff" style={styles.actionText}>
            {isSuccess ? 'Create Another Payout' : 'Try Again'}
          </ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    maxWidth: 320,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  actionButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 240,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
