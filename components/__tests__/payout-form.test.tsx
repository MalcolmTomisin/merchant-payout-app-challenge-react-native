import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { PayoutForm } from '../payout-form';

describe('PayoutForm', () => {
  const mockSubmit = jest.fn();

  beforeEach(() => {
    mockSubmit.mockClear();
  });

  it('renders amount, currency, and IBAN fields', () => {
    render(<PayoutForm onSubmit={mockSubmit} />);

    expect(screen.getByText('Amount')).toBeTruthy();
    expect(screen.getByText('Currency')).toBeTruthy();
    expect(screen.getByText('IBAN')).toBeTruthy();
  });

  it('renders the Confirm button', () => {
    render(<PayoutForm onSubmit={mockSubmit} />);
    expect(screen.getByTestId('confirm-button')).toBeTruthy();
  });

  it('disables Confirm button when form is empty', () => {
    render(<PayoutForm onSubmit={mockSubmit} />);

    fireEvent.press(screen.getByTestId('confirm-button'));
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('disables Confirm button when amount is zero', () => {
    render(<PayoutForm onSubmit={mockSubmit} />);

    fireEvent.changeText(screen.getByTestId('amount-input'), '0');
    fireEvent.changeText(screen.getByTestId('iban-input'), 'GB29NWBK60161331926819');
    fireEvent.press(screen.getByTestId('confirm-button'));

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('disables Confirm button when amount is negative', () => {
    render(<PayoutForm onSubmit={mockSubmit} />);

    fireEvent.changeText(screen.getByTestId('amount-input'), '-50');
    fireEvent.changeText(screen.getByTestId('iban-input'), 'GB29NWBK60161331926819');
    fireEvent.press(screen.getByTestId('confirm-button'));

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('disables Confirm button when IBAN is empty', () => {
    render(<PayoutForm onSubmit={mockSubmit} />);

    fireEvent.changeText(screen.getByTestId('amount-input'), '100');
    fireEvent.press(screen.getByTestId('confirm-button'));

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with correct data when form is valid', () => {
    render(<PayoutForm onSubmit={mockSubmit} />);

    fireEvent.changeText(screen.getByTestId('amount-input'), '400');
    fireEvent.changeText(screen.getByTestId('iban-input'), 'GB29NWBK60161331926819');
    fireEvent.press(screen.getByTestId('confirm-button'));

    expect(mockSubmit).toHaveBeenCalledTimes(1);
    expect(mockSubmit).toHaveBeenCalledWith({
      amount: 40000, // 400 * 100 = 40000 pence
      currency: 'GBP',
      iban: 'GB29NWBK60161331926819',
    });
  });

  it('converts decimal amounts to pence correctly', () => {
    render(<PayoutForm onSubmit={mockSubmit} />);

    fireEvent.changeText(screen.getByTestId('amount-input'), '12.50');
    fireEvent.changeText(screen.getByTestId('iban-input'), 'DE89370400440532013000');
    fireEvent.press(screen.getByTestId('confirm-button'));

    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ amount: 1250 }),
    );
  });

  it('defaults to GBP currency', () => {
    render(<PayoutForm onSubmit={mockSubmit} />);
    expect(screen.getByTestId('currency-picker')).toBeTruthy();
    expect(screen.getByText('GBP')).toBeTruthy();
  });

  it('opens currency picker on press and selects EUR', () => {
    render(<PayoutForm onSubmit={mockSubmit} />);

    fireEvent.press(screen.getByTestId('currency-picker'));
    // Modal should show both currency options
    expect(screen.getByTestId('currency-option-EUR')).toBeTruthy();
    expect(screen.getByTestId('currency-option-GBP')).toBeTruthy();

    fireEvent.press(screen.getByTestId('currency-option-EUR'));

    // Now submit with EUR
    fireEvent.changeText(screen.getByTestId('amount-input'), '200');
    fireEvent.changeText(screen.getByTestId('iban-input'), 'FR1234567890');
    fireEvent.press(screen.getByTestId('confirm-button'));

    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ currency: 'EUR' }),
    );
  });

  it('renders IBAN helper text', () => {
    render(<PayoutForm onSubmit={mockSubmit} />);
    expect(screen.getByText('Enter the destination bank account IBAN')).toBeTruthy();
  });
});
