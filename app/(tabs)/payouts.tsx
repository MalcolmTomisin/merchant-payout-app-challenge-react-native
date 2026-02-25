import { useEffect } from "react";
import { Alert } from "react-native";
import { PayoutForm } from "@/components/payout-form";
import { ConfirmationModal } from "@/components/confirmation-modal";
import { PayoutResult } from "@/components/payout-result";
import { usePayoutFlow } from "@/hooks/use-payout-flow";
import { PayoutFormContent } from "@/components/payout-form-content";
import { addScreenshotListener } from "@/modules/screen-security";

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

  useEffect(() => {
    const subscription = addScreenshotListener(() => {
      Alert.alert(
        "Security Reminder",
        "Please keep your financial data private. Screenshots may contain sensitive information."
      );
    });
    return () => subscription.remove();
  }, []);

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
