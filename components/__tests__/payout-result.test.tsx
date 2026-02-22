import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { PayoutResult } from '../payout-result';

describe('PayoutResult', () => {
  const mockAction = jest.fn();

  beforeEach(() => {
    mockAction.mockClear();
  });

  describe('success state', () => {
    it('renders success title and message', () => {
      render(
        <PayoutResult
          status="success"
          amount={40000}
          currency="GBP"
          onAction={mockAction}
        />,
      );

      expect(screen.getByText('Payout Completed')).toBeTruthy();
      expect(
        screen.getByText(
          'Your payout of £400.00 has been processed successfully.',
        ),
      ).toBeTruthy();
    });

    it('renders the checkmark icon', () => {
      render(
        <PayoutResult
          status="success"
          amount={40000}
          currency="GBP"
          onAction={mockAction}
        />,
      );

      expect(screen.getByText('✓')).toBeTruthy();
    });

    it('renders "Create Another Payout" button', () => {
      render(
        <PayoutResult
          status="success"
          amount={40000}
          currency="GBP"
          onAction={mockAction}
        />,
      );

      expect(screen.getByText('Create Another Payout')).toBeTruthy();
    });

    it('calls onAction when button is pressed', () => {
      render(
        <PayoutResult
          status="success"
          amount={40000}
          currency="GBP"
          onAction={mockAction}
        />,
      );

      fireEvent.press(screen.getByText('Create Another Payout'));
      expect(mockAction).toHaveBeenCalledTimes(1);
    });

    it('formats EUR currency correctly', () => {
      render(
        <PayoutResult
          status="success"
          amount={15050}
          currency="EUR"
          onAction={mockAction}
        />,
      );

      expect(
        screen.getByText(
          'Your payout of €150.50 has been processed successfully.',
        ),
      ).toBeTruthy();
    });
  });

  describe('error state', () => {
    it('renders error title and message', () => {
      render(
        <PayoutResult
          status="error"
          errorMessage="Insufficient funds"
          onAction={mockAction}
        />,
      );

      expect(screen.getByText('Unable to Process Payout')).toBeTruthy();
      expect(screen.getByText('Insufficient funds')).toBeTruthy();
    });

    it('renders the X icon', () => {
      render(
        <PayoutResult
          status="error"
          errorMessage="Service error"
          onAction={mockAction}
        />,
      );

      expect(screen.getByText('✕')).toBeTruthy();
    });

    it('renders "Try Again" button', () => {
      render(
        <PayoutResult
          status="error"
          errorMessage="Service error"
          onAction={mockAction}
        />,
      );

      expect(screen.getByText('Try Again')).toBeTruthy();
    });

    it('calls onAction when Try Again is pressed', () => {
      render(
        <PayoutResult
          status="error"
          errorMessage="Service error"
          onAction={mockAction}
        />,
      );

      fireEvent.press(screen.getByText('Try Again'));
      expect(mockAction).toHaveBeenCalledTimes(1);
    });

    it('shows default error message when none provided', () => {
      render(
        <PayoutResult status="error" onAction={mockAction} />,
      );

      expect(
        screen.getByText('Something went wrong. Please try again.'),
      ).toBeTruthy();
    });
  });
});
