/**
 * PayoutForm — form for initiating a payout with amount, currency, and IBAN fields.
 * Validates inputs and calls onSubmit with the parsed form data.
 */
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { usePayoutForm } from "@/hooks/use-payout-form";
import type { Currency } from "@/types/api";

const CURRENCIES: Currency[] = ["GBP", "EUR"];

interface PayoutFormData {
  /** Amount in lowest denomination (pence/cents) */
  amount: number;
  currency: Currency;
  iban: string;
}

interface PayoutFormProps {
  onSubmit: (data: PayoutFormData) => void;
}

export function PayoutForm({ onSubmit }: PayoutFormProps) {
  const {
    amount,
    currency,
    iban,
    showCurrencyPicker,
    setAmount,
    setIban,
    isValid,
    textColor,
    borderColor,
    placeholderColor,
    inputBg,
    handleSubmit,
    handleSelectCurrency,
    openCurrencyPicker,
    closeCurrencyPicker,
  } = usePayoutForm(onSubmit);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Amount + Currency row */}
        <View style={styles.amountRow}>
          <View style={styles.amountField}>
            <ThemedText type="defaultSemiBold" style={styles.fieldLabel}>
              Amount
            </ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  color: textColor,
                  borderColor,
                  backgroundColor: inputBg,
                },
              ]}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={placeholderColor}
              keyboardType="decimal-pad"
              returnKeyType="next"
              accessibilityLabel="Payout amount"
              testID="amount-input"
            />
          </View>

          <View style={styles.currencyField}>
            <ThemedText type="defaultSemiBold" style={styles.fieldLabel}>
              Currency
            </ThemedText>
            <Pressable
              style={[
                styles.input,
                styles.currencyPicker,
                { borderColor, backgroundColor: inputBg },
              ]}
              onPress={openCurrencyPicker}
              accessibilityRole="button"
              accessibilityLabel={`Currency: ${currency}. Tap to change.`}
              testID="currency-picker"
            >
              <ThemedText style={styles.currencyText}>{currency}</ThemedText>
              <ThemedText
                lightColor="#687076"
                darkColor="#9BA1A6"
                style={styles.chevron}
              >
                ▼
              </ThemedText>
            </Pressable>
          </View>
        </View>

        {/* IBAN field */}
        <View style={styles.ibanField}>
          <ThemedText type="defaultSemiBold" style={styles.fieldLabel}>
            IBAN
          </ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                color: textColor,
                borderColor,
                backgroundColor: inputBg,
              },
            ]}
            value={iban}
            onChangeText={setIban}
            placeholder="FR1212345123451234567A12310131231231231"
            placeholderTextColor={placeholderColor}
            autoCapitalize="characters"
            autoCorrect={false}
            returnKeyType="done"
            accessibilityLabel="Destination IBAN"
            testID="iban-input"
          />
          <ThemedText
            lightColor="#687076"
            darkColor="#9BA1A6"
            style={styles.helperText}
          >
            Enter the destination bank account IBAN
          </ThemedText>
        </View>

        <Pressable
          style={[
            styles.confirmButton,
            !isValid && styles.confirmButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!isValid}
          accessibilityRole="button"
          accessibilityLabel="Confirm"
          accessibilityState={{ disabled: !isValid }}
          testID="confirm-button"
        >
          <ThemedText
            lightColor="#fff"
            darkColor="#fff"
            style={styles.confirmButtonText}
          >
            Confirm
          </ThemedText>
        </Pressable>
      </ScrollView>

      {/* Currency picker modal */}
      <Modal
        visible={showCurrencyPicker}
        transparent
        animationType="fade"
        onRequestClose={closeCurrencyPicker}
      >
        <Pressable
          style={styles.pickerOverlay}
          onPress={closeCurrencyPicker}
        >
          <View style={styles.pickerCard}>
            <ThemedText
              type="defaultSemiBold"
              lightColor="#11181C"
              darkColor="#11181C"
              style={styles.pickerTitle}
            >
              Select Currency
            </ThemedText>
            {CURRENCIES.map((c) => (
              <Pressable
                key={c}
                style={[
                  styles.pickerOption,
                  c === currency && styles.pickerOptionSelected,
                ]}
                onPress={() => handleSelectCurrency(c)}
                accessibilityRole="button"
                accessibilityLabel={c}
                testID={`currency-option-${c}`}
              >
                <ThemedText
                  lightColor={c === currency ? "#0a7ea4" : "#11181C"}
                  darkColor={c === currency ? "#0a7ea4" : "#11181C"}
                  style={[
                    styles.pickerOptionText,
                    c === currency && styles.pickerOptionTextSelected,
                  ]}
                >
                  {c}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}

/** Reset form fields externally via ref — or parent can just re-mount */
PayoutForm.displayName = "PayoutForm";

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  amountRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  amountField: {
    flex: 1,
  },
  currencyField: {
    width: 120,
  },
  fieldLabel: {
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  currencyPicker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  currencyText: {
    fontSize: 16,
    fontWeight: "500",
  },
  chevron: {
    fontSize: 12,
    marginLeft: 8,
  },
  ibanField: {
    marginBottom: 32,
  },
  helperText: {
    fontSize: 14,
    marginTop: 8,
  },
  confirmButton: {
    backgroundColor: "#0a7ea4",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmButtonDisabled: {
    backgroundColor: "#D1D5DB",
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: "600",
  },
  // Currency picker modal
  pickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  pickerCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 300,
  },
  pickerTitle: {
    textAlign: "center",
    marginBottom: 16,
    fontSize: 18,
  },
  pickerOption: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  pickerOptionSelected: {
    backgroundColor: "#E8F4F8",
  },
  pickerOptionText: {
    fontSize: 16,
    textAlign: "center",
  },
  pickerOptionTextSelected: {
    fontWeight: "600",
  },
});
