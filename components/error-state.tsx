/**
 * ErrorState — reusable error view with message and retry button.
 * Used across Home, Modal, and Payouts screens.
 */
import { Pressable, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing, FontSizes, BorderRadius } from '@/constants/design-tokens';
import { scale, moderateScale } from '@/utils/scale';

interface ErrorStateProps {
  /** Callback invoked when the user taps Retry */
  onRetry: () => void;
  /** Error message to display (defaults to generic message) */
  message?: string;
}

const DEFAULT_MESSAGE = 'Something went wrong. Please try again.';

export function ErrorState({ onRetry, message = DEFAULT_MESSAGE }: ErrorStateProps) {
  const tint = useThemeColor({}, 'tint');

  return (
    <ThemedView style={styles.centered}>
      <ThemedText style={styles.errorText}>{message}</ThemedText>
      <Pressable
        style={[styles.retryButton, { backgroundColor: tint }]}
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel="Retry"
      >
        <ThemedText style={styles.retryText}>Retry</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(Spacing.base),
  },
  errorText: {
    fontSize: moderateScale(FontSizes.body),
    textAlign: 'center',
    marginBottom: scale(Spacing.base),
  },
  retryButton: {
    paddingHorizontal: scale(Spacing.section),
    paddingVertical: scale(Spacing.content),
    borderRadius: scale(BorderRadius.small),
  },
  retryText: {
    color: '#fff',
    fontSize: moderateScale(FontSizes.body),
    fontWeight: '600',
  },
});
