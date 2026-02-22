/**
 * PayoutsScreen — orchestrates the payout flow:
 *   1. Form state → PayoutForm + ConfirmationModal
 *   2. Success state → PayoutResult (success)
 *   3. Error state → PayoutResult (error)
 */
import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PayoutForm } from '@/components/payout-form';
import { ConfirmationModal } from '@/components/confirmation-modal';
import { PayoutResult } from '@/components/payout-result';
import { useCreatePayout } from '@/hooks/use-create-payout';
import type { Currency } from '@/types/api';

interface PendingPayout {
  amount: number; // in pence/cents
  currency: Currency;
  iban: string;
}

export default function PayoutsScreen() {
  const mutation = useCreatePayout();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingPayout, setPendingPayout] = useState<PendingPayout | null>(null);
  // Key to force re-mount of PayoutForm on reset
  const [formKey, setFormKey] = useState(0);

  const handleFormSubmit = useCallback(
    (data: PendingPayout) => {
      setPendingPayout(data);
      setShowConfirmation(true);
    },
    [],
  );

  const handleCancelConfirmation = useCallback(() => {
    setShowConfirmation(false);
  }, []);

  const handleConfirmPayout = useCallback(async () => {
    if (!pendingPayout) return;

    try {
      await mutation.mutateAsync(pendingPayout);
    } finally {
      setShowConfirmation(false);
    }
  }, [pendingPayout, mutation]);

  const handleCreateAnother = useCallback(() => {
    mutation.reset();
    setPendingPayout(null);
    setFormKey((k) => k + 1);
  }, [mutation]);

  const handleTryAgain = useCallback(() => {
    mutation.reset();
  }, [mutation]);

  // Determine screen state
  const isSuccess = mutation.isSuccess && mutation.data?.status === 'completed';
  const isError =
    mutation.isError ||
    (mutation.isSuccess && mutation.data?.status === 'failed');

  const errorMessage =
    mutation.error?.message ??
    (mutation.data?.status === 'failed'
      ? 'Service temporarily unavailable. Please try again later.'
      : undefined);

  // Title changes based on state
  const title = isSuccess || isError ? 'Payout' : 'Send Payout';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">{title}</ThemedText>
        </ThemedView>

        {isSuccess ? (
          <PayoutResult
            status="success"
            amount={pendingPayout?.amount}
            currency={pendingPayout?.currency}
            onAction={handleCreateAnother}
          />
        ) : isError ? (
          <PayoutResult
            status="error"
            errorMessage={errorMessage}
            onAction={handleTryAgain}
          />
        ) : (
          <PayoutForm key={formKey} onSubmit={handleFormSubmit} />
        )}

        {pendingPayout && (
          <ConfirmationModal
            visible={showConfirmation}
            amount={pendingPayout.amount}
            currency={pendingPayout.currency}
            iban={pendingPayout.iban}
            onCancel={handleCancelConfirmation}
            onConfirm={handleConfirmPayout}
            isSubmitting={mutation.isPending}
          />
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
});
