/**
 * ErrorState — reusable error view with message and retry button.
 * Used across Home, Modal, and Payouts screens.
 */
import { Pressable, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

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
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
