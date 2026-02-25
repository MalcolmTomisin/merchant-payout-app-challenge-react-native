import { PayoutForm } from "@/components/payout-form";
import { ConfirmationModal } from "@/components/confirmation-modal";
import { PayoutResult } from "@/components/payout-result";
import { usePayoutFlow } from "@/hooks/use-payout-flow";
import { useScreenshotListener } from "@/hooks/use-screenshot-listener";
import { PayoutFormContent } from "@/components/payout-form-content";

export default function PayoutsScreen() {
  const {
    showConfirmation,
    pendingPayout,
    formKey,
    isSuccess,
    isError,
    errorMessage,
    title,
    isSubmitting,
    handleFormSubmit,
    handleCancelConfirmation,
    handleConfirmPayout,
    handleCreateAnother,
    handleTryAgain,
  } = usePayoutFlow();

  useScreenshotListener();

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
          isSubmitting={isSubmitting}
        />
      )}
    </PayoutFormContent>
  );
}
