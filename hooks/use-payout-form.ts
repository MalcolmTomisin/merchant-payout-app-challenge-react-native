import { useState } from "react";
import type { Currency } from "@/types/api";

interface PayoutFormData {
  /** Amount in lowest denomination (pence/cents) */
  amount: number;
  currency: Currency;
  iban: string;
}

/**
 * usePayoutForm — manages form field state, validation, and submission.
 */
export function usePayoutForm(onSubmit: (data: PayoutFormData) => void) {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<Currency>("GBP");
  const [iban, setIban] = useState("");

  const parsedAmount = parseFloat(amount);
  const isValid =
    !isNaN(parsedAmount) && parsedAmount > 0 && iban.trim().length > 0;


  const handleSubmit = () => {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0 || iban.trim().length === 0) return;
    const amountInPence = Math.round(parsed * 100);
    onSubmit({ amount: amountInPence, currency, iban: iban.trim() });
  };

  return {
    amount,
    currency,
    iban,
    setAmount,
    setCurrency,
    setIban,
    isValid,
    handleSubmit,
  } as const;
}
