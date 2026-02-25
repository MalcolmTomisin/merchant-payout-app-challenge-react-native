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
import { useModal } from "@/hooks/use-modal";
import { useFormInputColors } from "@/hooks/use-form-input-colors";
import { Spacing, FontSizes, BorderRadius } from '@/constants/design-tokens';
import { scale, moderateScale } from '@/utils/scale';
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
    setAmount,
    setCurrency,
    setIban,
    isValid,
    handleSubmit,
  } = usePayoutForm(onSubmit);

  const currencyPicker = useModal();
  const { textColor, borderColor, placeholderColor, inputBg } =
    useFormInputColors();

  const handleSelectCurrency = (selected: Currency) => {
    setCurrency(selected);
    currencyPicker.close();
  };

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
              onPress={currencyPicker.open}
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
        visible={currencyPicker.visible}
        transparent
        animationType="fade"
        onRequestClose={currencyPicker.close}
      >
        <Pressable
          style={styles.pickerOverlay}
          onPress={currencyPicker.close}
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
    paddingBottom: scale(Spacing.section),
  },
  amountRow: {
    flexDirection: "row",
    gap: scale(Spacing.content),
    marginBottom: scale(Spacing.section),
  },
  amountField: {
    flex: 1,
  },
  currencyField: {
    width: scale(120),
  },
  fieldLabel: {
    marginBottom: scale(Spacing.compact),
  },
  input: {
    borderWidth: 1,
    borderRadius: scale(BorderRadius.medium),
    paddingHorizontal: scale(Spacing.base),
    paddingVertical: scale(Spacing.element),
    fontSize: moderateScale(FontSizes.body),
  },
  currencyPicker: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  currencyText: {
    fontSize: moderateScale(FontSizes.body),
    fontWeight: "500",
  },
  chevron: {
    fontSize: moderateScale(FontSizes.xs),
    marginLeft: scale(Spacing.compact),
  },
  ibanField: {
    marginBottom: scale(Spacing.block),
  },
  helperText: {
    fontSize: moderateScale(FontSizes.caption),
    marginTop: scale(Spacing.compact),
  },
  confirmButton: {
    backgroundColor: "#0a7ea4",
    paddingVertical: scale(Spacing.element + Spacing.tight),
    borderRadius: scale(BorderRadius.medium),
    alignItems: "center",
  },
  confirmButtonDisabled: {
    backgroundColor: "#D1D5DB",
  },
  confirmButtonText: {
    fontSize: moderateScale(FontSizes.lg),
    fontWeight: "600",
  },
  // Currency picker modal
  pickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: scale(Spacing.section),
  },
  pickerCard: {
    backgroundColor: "#fff",
    borderRadius: scale(BorderRadius.large),
    padding: scale(Spacing.section),
    width: "100%",
    maxWidth: 300,
  },
  pickerTitle: {
    textAlign: "center",
    marginBottom: scale(Spacing.base),
    fontSize: moderateScale(FontSizes.lg),
  },
  pickerOption: {
    paddingVertical: scale(Spacing.element),
    paddingHorizontal: scale(Spacing.base),
    borderRadius: scale(BorderRadius.small),
  },
  pickerOptionSelected: {
    backgroundColor: "#E8F4F8",
  },
  pickerOptionText: {
    fontSize: moderateScale(FontSizes.body),
    textAlign: "center",
  },
  pickerOptionTextSelected: {
    fontWeight: "600",
  },
});
