import { useState } from "react";

import { PayoutForm } from "@/components/payout-form";
import { ConfirmationModal } from "@/components/confirmation-modal";
import { PayoutResult } from "@/components/payout-result";
import { useCreatePayout } from "@/hooks/use-create-payout";
import { PayoutFormContent } from "@/components/payout-form-content";
import type { Currency } from "@/types/api";

interface PendingPayout {
  amount: number; // in pence/cents
  currency: Currency;
  iban: string;
}

export default function PayoutsScreen() {
  const mutation = useCreatePayout();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingPayout, setPendingPayout] = useState<PendingPayout | null>(
    null,
  );
  // Key to force re-mount of PayoutForm on reset
  const [formKey, setFormKey] = useState(0);

  const handleFormSubmit = (data: PendingPayout) => {
    setPendingPayout(data);
    setShowConfirmation(true);
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  const handleConfirmPayout = async () => {
    if (!pendingPayout) return;

    try {
      await mutation.mutateAsync(pendingPayout);
    } finally {
      setShowConfirmation(false);
    }
  };

  const handleCreateAnother = () => {
    mutation.reset();
    setPendingPayout(null);
    setFormKey((k) => k + 1);
  };

  const handleTryAgain = () => {
    mutation.reset();
  };

  // Determine screen state
  const isSuccess = mutation.isSuccess && mutation.data?.status === "completed";
  const isError =
    mutation.isError ||
    (mutation.isSuccess && mutation.data?.status === "failed");

  const errorMessage =
    mutation.error?.message ??
    (mutation.data?.status === "failed"
      ? "Service temporarily unavailable. Please try again later."
      : undefined);

  // Title changes based on state
  const title = isSuccess || isError ? "Payout" : "Send Payout";

  if (isSuccess) {
    return (
      <PayoutFormContent title={title}>
        <PayoutResult
          status="success"
          amount={pendingPayout?.amount}
          currency={pendingPayout?.currency}
          onAction={handleCreateAnother}
        />
      </PayoutFormContent>
    );
  }

  if (isError) {
    return (
      <PayoutFormContent title={title}>
        <PayoutResult
          status="error"
          errorMessage={errorMessage}
          onAction={handleTryAgain}
        />
      </PayoutFormContent>
    );
  }

  return (
    <PayoutFormContent title={title}>
      <PayoutForm key={formKey} onSubmit={handleFormSubmit} />
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
    </PayoutFormContent>
  );
}
