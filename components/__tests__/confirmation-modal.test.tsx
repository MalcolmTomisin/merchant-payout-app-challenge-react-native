import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ConfirmationModal } from '../confirmation-modal';

describe('ConfirmationModal', () => {
  const defaultProps = {
    visible: true,
    amount: 40000,
    currency: 'GBP' as const,
    iban: 'FR1212345123451234567A12310131231231231',
    onCancel: jest.fn(),
    onConfirm: jest.fn(),
    isSubmitting: false,
  };

  beforeEach(() => {
    defaultProps.onCancel.mockClear();
    defaultProps.onConfirm.mockClear();
  });

  it('renders the title', () => {
    render(<ConfirmationModal {...defaultProps} />);
    expect(screen.getByText('Confirm Payout')).toBeTruthy();
  });

  it('displays the formatted amount', () => {
    render(<ConfirmationModal {...defaultProps} />);
    expect(screen.getByText('£400.00')).toBeTruthy();
  });

  it('displays the currency', () => {
    render(<ConfirmationModal {...defaultProps} />);
    expect(screen.getByText('GBP')).toBeTruthy();
  });

  it('displays a masked IBAN', () => {
    render(<ConfirmationModal {...defaultProps} />);
    // First 4: FR12, Last 4: 1231, middle is asterisks
    const maskedText = screen.getByText(/^FR12\*+1231$/);
    expect(maskedText).toBeTruthy();
  });

  it('calls onCancel when Cancel is pressed', () => {
    render(<ConfirmationModal {...defaultProps} />);
    fireEvent.press(screen.getByText('Cancel'));
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when Confirm is pressed', () => {
    render(<ConfirmationModal {...defaultProps} />);
    fireEvent.press(screen.getByLabelText('Confirm payout'));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('shows loading indicator when submitting', () => {
    render(<ConfirmationModal {...defaultProps} isSubmitting />);
    // Confirm button text should not be visible; ActivityIndicator replaces it
    expect(screen.queryByText('Confirm')).toBeNull();
  });

  it('disables buttons when submitting', () => {
    render(<ConfirmationModal {...defaultProps} isSubmitting />);
    fireEvent.press(screen.getByLabelText('Cancel'));
    fireEvent.press(screen.getByLabelText('Confirm payout'));
    expect(defaultProps.onCancel).not.toHaveBeenCalled();
    expect(defaultProps.onConfirm).not.toHaveBeenCalled();
  });

  it('formats EUR amounts correctly', () => {
    render(
      <ConfirmationModal
        {...defaultProps}
        amount={15050}
        currency="EUR"
      />,
    );
    expect(screen.getByText('€150.50')).toBeTruthy();
    expect(screen.getByText('EUR')).toBeTruthy();
  });
});
