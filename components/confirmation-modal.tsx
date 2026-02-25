/**
 * ConfirmationModal — displays a summary of the payout for user confirmation.
 * Shows amount, currency, masked IBAN with Cancel / Confirm actions.
 */
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { formatCurrency } from '@/utils/format-currency';
import { maskIban } from '@/utils/mask-iban';
import { Spacing, FontSizes, BorderRadius } from '@/constants/design-tokens';
import { scale, moderateScale } from '@/utils/scale';
import type { Currency } from '@/types/api';

interface ConfirmationModalProps {
  visible: boolean;
  /** Amount in lowest denomination (pence/cents) */
  amount: number;
  currency: Currency;
  iban: string;
  onCancel: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function ConfirmationModal({
  visible,
  amount,
  currency,
  iban,
  onCancel,
  onConfirm,
  isSubmitting,
}: ConfirmationModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      accessibilityViewIsModal
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <ThemedText
            type="subtitle"
            lightColor="#11181C"
            darkColor="#11181C"
            style={styles.title}
          >
            Confirm Payout
          </ThemedText>

          {/* Amount row */}
          <View style={styles.row}>
            <ThemedText lightColor="#687076" darkColor="#687076" style={styles.label}>
              Amount:
            </ThemedText>
            <ThemedText
              lightColor="#11181C"
              darkColor="#11181C"
              style={styles.value}
            >
              {formatCurrency(amount, currency)}
            </ThemedText>
          </View>
          <View style={styles.divider} />

          {/* Currency row */}
          <View style={styles.row}>
            <ThemedText lightColor="#687076" darkColor="#687076" style={styles.label}>
              Currency:
            </ThemedText>
            <ThemedText
              lightColor="#11181C"
              darkColor="#11181C"
              style={styles.value}
            >
              {currency}
            </ThemedText>
          </View>
          <View style={styles.divider} />

          {/* IBAN row */}
          <View style={styles.row}>
            <ThemedText lightColor="#687076" darkColor="#687076" style={styles.ibanLabel}>
              IBAN:
            </ThemedText>
            <ThemedText
              lightColor="#11181C"
              darkColor="#11181C"
              style={styles.ibanValue}
              numberOfLines={1}
            >
              {maskIban(iban)}
            </ThemedText>
          </View>
          <View style={styles.divider} />

          {/* Action buttons */}
          <View style={styles.actions}>
            <Pressable
              style={styles.cancelButton}
              onPress={onCancel}
              disabled={isSubmitting}
              accessibilityRole="button"
              accessibilityLabel="Cancel"
            >
              <ThemedText lightColor="#11181C" darkColor="#11181C" style={styles.cancelText}>
                Cancel
              </ThemedText>
            </Pressable>

            <Pressable
              style={[styles.confirmButton, isSubmitting && styles.buttonDisabled]}
              onPress={onConfirm}
              disabled={isSubmitting}
              accessibilityRole="button"
              accessibilityLabel="Confirm payout"
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <ThemedText lightColor="#fff" darkColor="#fff" style={styles.confirmText}>
                  Confirm
                </ThemedText>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(Spacing.section),
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: scale(BorderRadius.large),
    padding: scale(Spacing.section),
    width: '100%',
    maxWidth: 400,
  },
  title: {
    textAlign: 'center',
    marginBottom: scale(Spacing.section),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scale(Spacing.content),
  },
  label: {
    fontSize: moderateScale(FontSizes.body),
  },
  value: {
    fontSize: moderateScale(FontSizes.body),
    fontWeight: '600',
  },
  ibanLabel: {
    fontSize: moderateScale(FontSizes.body),
    flexShrink: 0,
  },
  ibanValue: {
    fontSize: moderateScale(FontSizes.caption),
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
    marginLeft: scale(Spacing.tight),
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E0E0E0',
  },
  actions: {
    flexDirection: 'row',
    gap: scale(Spacing.content),
    marginTop: scale(20),
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    paddingVertical: scale(Spacing.base),
    borderRadius: scale(BorderRadius.medium),
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#0a7ea4',
    paddingVertical: scale(Spacing.base),
    borderRadius: scale(BorderRadius.medium),
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  cancelText: {
    fontSize: moderateScale(FontSizes.body),
    fontWeight: '600',
  },
  confirmText: {
    fontSize: moderateScale(FontSizes.body),
    fontWeight: '600',
  },
});
