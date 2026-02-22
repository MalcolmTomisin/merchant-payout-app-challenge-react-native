import { useState } from "react";
import { useThemeColor } from "@/hooks/use-theme-color";
import type { Currency } from "@/types/api";

interface PayoutFormData {
  /** Amount in lowest denomination (pence/cents) */
  amount: number;
  currency: Currency;
  iban: string;
}

/**
 * usePayoutForm — manages form state, validation, and derived values
 * for the payout form component.
 */
export function usePayoutForm(onSubmit: (data: PayoutFormData) => void) {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<Currency>("GBP");
  const [iban, setIban] = useState("");
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

  // Theme colors
  const textColor = useThemeColor({}, "text");
  const borderColor = useThemeColor(
    { light: "#E0E0E0", dark: "#3A3A3C" },
    "icon",
  );
  const placeholderColor = useThemeColor(
    { light: "#9CA3AF", dark: "#6B7280" },
    "icon",
  );
  const inputBg = useThemeColor(
    { light: "#fff", dark: "#1C1E21" },
    "background",
  );

  // Validation
  const parsedAmount = parseFloat(amount);
  const isValid =
    !isNaN(parsedAmount) && parsedAmount > 0 && iban.trim().length > 0;

  // Handlers
  const handleSubmit = () => {
    if (!isValid) return;
    const amountInPence = Math.round(parsedAmount * 100);
    onSubmit({ amount: amountInPence, currency, iban: iban.trim() });
  };

  const handleSelectCurrency = (selected: Currency) => {
    setCurrency(selected);
    setShowCurrencyPicker(false);
  };

  const openCurrencyPicker = () => {
    setShowCurrencyPicker(true);
  };

  const closeCurrencyPicker = () => {
    setShowCurrencyPicker(false);
  };

  return {
    // Field values
    amount,
    currency,
    iban,
    showCurrencyPicker,

    // Field setters
    setAmount,
    setIban,

    // Validation
    isValid,

    // Theme colors
    textColor,
    borderColor,
    placeholderColor,
    inputBg,

    // Handlers
    handleSubmit,
    handleSelectCurrency,
    openCurrencyPicker,
    closeCurrencyPicker,
  } as const;
}
