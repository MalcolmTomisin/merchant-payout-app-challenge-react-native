/**
 * LoadingState — reusable centered loading indicator with optional message.
 * Used across Home, Modal, and Payouts screens.
 */
import { ActivityIndicator, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

interface LoadingStateProps {
  /** Optional message displayed below the spinner */
  message?: string;
  /** Test ID for the activity indicator (default: 'loading-indicator') */
  testID?: string;
}

export function LoadingState({ message, testID = 'loading-indicator' }: LoadingStateProps) {
  const tint = useThemeColor({}, 'tint');

  return (
    <ThemedView style={styles.centered}>
      <ActivityIndicator size="large" color={tint} testID={testID} />
      {message && (
        <ThemedText style={styles.message}>{message}</ThemedText>
      )}
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
  message: {
    marginTop: 12,
    fontSize: 14,
    opacity: 0.7,
  },
});
