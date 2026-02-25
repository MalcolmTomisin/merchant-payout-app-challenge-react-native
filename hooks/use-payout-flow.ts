import { useReducer } from "react";
import { useCreatePayout } from "@/hooks/use-create-payout";
import type { Currency } from "@/types/api";
import * as ScreenSecurity from "@/modules/screen-security";

export interface PendingPayout {
  amount: number; // in pence/cents
  currency: Currency;
  iban: string;
}

interface PayoutFlowState {
  showConfirmation: boolean;
  pendingPayout: PendingPayout | null;
  formKey: number;
}

type PayoutFlowAction =
  | { type: "SUBMIT_FORM"; payload: PendingPayout }
  | { type: "CANCEL_CONFIRMATION" }
  | { type: "CONFIRM_SETTLED" }
  | { type: "RESET_FORM" };

const initialState: PayoutFlowState = {
  showConfirmation: false,
  pendingPayout: null,
  formKey: 0,
};

function payoutFlowReducer(
  state: PayoutFlowState,
  action: PayoutFlowAction,
): PayoutFlowState {
  switch (action.type) {
    case "SUBMIT_FORM":
      return {
        ...state,
        pendingPayout: action.payload,
        showConfirmation: true,
      };
    case "CANCEL_CONFIRMATION":
      return {
        ...state,
        showConfirmation: false,
      };
    case "CONFIRM_SETTLED":
      return {
        ...state,
        showConfirmation: false,
      };
    case "RESET_FORM":
      return {
        ...state,
        pendingPayout: null,
        formKey: state.formKey + 1,
      };
    default:
      return state;
  }
}

/**
 * usePayoutFlow — manages payout screen UI state, mutation, event handlers,
 * and derived display values. The component only needs to render based on the
 * returned values.
 */
export function usePayoutFlow() {
  const [state, dispatch] = useReducer(payoutFlowReducer, initialState);
  const mutation = useCreatePayout();

  const { pendingPayout } = state;

  const handleFormSubmit = (data: PendingPayout) => {
    dispatch({ type: "SUBMIT_FORM", payload: data });
  };

  const handleCancelConfirmation = () => {
    dispatch({ type: "CANCEL_CONFIRMATION" });
  };

  const handleConfirmPayout = async () => {
    if (!pendingPayout) return;

    try {
      const device_id = await ScreenSecurity.getDeviceIdAsync();
      await mutation.mutateAsync({ ...pendingPayout, device_id });
    } catch {
      // Error state is captured by React Query (mutation.isError)
    } finally {
      dispatch({ type: "CONFIRM_SETTLED" });
    }
  };

  const handleCreateAnother = () => {
    mutation.reset();
    dispatch({ type: "RESET_FORM" });
  };

  const handleTryAgain = () => {
    mutation.reset();
  };

  const isSuccess = mutation.isSuccess && mutation.data?.status === "completed";
  const isError =
    mutation.isError ||
    (mutation.isSuccess && mutation.data?.status === "failed");

  const errorMessage =
    mutation.error?.message ??
    (mutation.data?.status === "failed"
      ? "Service temporarily unavailable. Please try again later."
      : undefined);

  const title = isSuccess || isError ? "Payout" : "Send Payout";

  return {
    ...state,
    isSuccess,
    isError,
    errorMessage,
    title,
    isSubmitting: mutation.isPending,
    handleFormSubmit,
    handleCancelConfirmation,
    handleConfirmPayout,
    handleCreateAnother,
    handleTryAgain,
  } as const;
}
