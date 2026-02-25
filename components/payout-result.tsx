/**
 * PayoutResult — displays the success or failure state after a payout attempt.
 * Shows a centered icon, title, message, and an action button.
 */
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { formatCurrency } from '@/utils/format-currency';
import { Spacing, FontSizes, BorderRadius, LineHeights } from '@/constants/design-tokens';
import { scale, moderateScale } from '@/utils/scale';
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
    padding: scale(Spacing.section),
  },
  content: {
    alignItems: 'center',
    maxWidth: 320,
  },
  iconCircle: {
    width: scale(72),
    height: scale(72),
    borderRadius: scale(36),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(Spacing.section),
  },
  iconText: {
    fontSize: moderateScale(FontSizes.icon),
    fontWeight: 'bold',
  },
  title: {
    textAlign: 'center',
    marginBottom: scale(Spacing.base),
  },
  message: {
    fontSize: moderateScale(FontSizes.body),
    textAlign: 'center',
    lineHeight: moderateScale(LineHeights.body),
    marginBottom: scale(Spacing.block),
  },
  actionButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: scale(Spacing.base),
    paddingHorizontal: scale(Spacing.block),
    borderRadius: scale(BorderRadius.medium),
    minWidth: scale(240),
    alignItems: 'center',
  },
  actionText: {
    fontSize: moderateScale(FontSizes.body),
    fontWeight: '600',
  },
});
