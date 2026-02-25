import React from 'react';
import { waitFor, fireEvent } from '@testing-library/react-native';
import { renderRouter, screen } from 'expo-router/testing-library';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PayoutsScreen from '../payouts';
import HomeScreen from '../index';

jest.mock('@/modules/screen-security', () => ({
  getDeviceIdAsync: jest.fn().mockResolvedValue('mock-device-id'),
  addScreenshotListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
  isBiometricAuthenticatedAsync: jest.fn().mockResolvedValue(true),
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children,
    );
  };
}

function renderPayoutsScreen() {
  const MockHomeScreen = jest.fn(() => <HomeScreen />);
  const MockPayoutsScreen = jest.fn(() => <PayoutsScreen />);

  renderRouter(
    {
      index: MockHomeScreen,
      payouts: MockPayoutsScreen,
    },
    {
      wrapper: createWrapper(),
      initialUrl: '/payouts',
    },
  );
}

describe('PayoutsScreen Integration', () => {

  it('navigates to the payouts screen', () => {
    renderPayoutsScreen();
    expect(screen).toHavePathname('/payouts');
  });

  it('renders the Send Payout title', () => {
    renderPayoutsScreen();
    expect(screen.getByText('Send Payout')).toBeTruthy();
  });

  it('renders amount input, IBAN input, and confirm button', () => {
    renderPayoutsScreen();

    expect(screen.getByTestId('amount-input')).toBeTruthy();
    expect(screen.getByTestId('iban-input')).toBeTruthy();
    expect(screen.getByTestId('confirm-button')).toBeTruthy();
  });

  it('renders currency picker defaulting to GBP', () => {
    renderPayoutsScreen();

    const picker = screen.getByTestId('currency-picker');
    expect(picker).toBeTruthy();
    expect(screen.getByText('GBP')).toBeTruthy();
  });


  it('disables confirm button when form is empty', () => {
    renderPayoutsScreen();

    const button = screen.getByTestId('confirm-button');
    expect(button.props.accessibilityState?.disabled).toBe(true);
  });

  it('enables confirm button when amount and IBAN are filled', () => {
    renderPayoutsScreen();

    fireEvent.changeText(screen.getByTestId('amount-input'), '100');
    fireEvent.changeText(
      screen.getByTestId('iban-input'),
      'GB29NWBK60161331926819',
    );

    const button = screen.getByTestId('confirm-button');
    expect(button.props.accessibilityState?.disabled).toBe(false);
  });


  it('opens currency picker and selects EUR', async () => {
    renderPayoutsScreen();

    fireEvent.press(screen.getByTestId('currency-picker'));

    await waitFor(() => {
      expect(screen.getByText('Select Currency')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('currency-option-EUR'));

    await waitFor(() => {
      expect(screen.getByText('EUR')).toBeTruthy();
    });
  });


  it('shows confirmation modal after filling form and pressing confirm', async () => {
    renderPayoutsScreen();

    fireEvent.changeText(screen.getByTestId('amount-input'), '400');
    fireEvent.changeText(
      screen.getByTestId('iban-input'),
      'GB29NWBK60161331926819',
    );
    fireEvent.press(screen.getByTestId('confirm-button'));

    await waitFor(() => {
      expect(screen.getByText('Confirm Payout')).toBeTruthy();
    });

    // Verify modal content
    expect(screen.getByText('£400.00')).toBeTruthy();
    expect(screen.getByText('Amount:')).toBeTruthy();
    expect(screen.getByText('Currency:')).toBeTruthy();
    expect(screen.getByText('IBAN:')).toBeTruthy();

    // Verify action buttons
    expect(screen.getByLabelText('Cancel')).toBeTruthy();
    expect(screen.getByLabelText('Confirm payout')).toBeTruthy();
  });

  it('closes confirmation modal when cancel is pressed', async () => {
    renderPayoutsScreen();

    fireEvent.changeText(screen.getByTestId('amount-input'), '400');
    fireEvent.changeText(
      screen.getByTestId('iban-input'),
      'GB29NWBK60161331926819',
    );
    fireEvent.press(screen.getByTestId('confirm-button'));

    await waitFor(() => {
      expect(screen.getByText('Confirm Payout')).toBeTruthy();
    });

    fireEvent.press(screen.getByLabelText('Cancel'));

    await waitFor(() => {
      expect(screen.queryByText('Confirm Payout')).toBeNull();
    });

    // Form should still be visible
    expect(screen.getByTestId('amount-input')).toBeTruthy();
  });


  it('shows success result after confirming a valid payout', async () => {
    renderPayoutsScreen();

    fireEvent.changeText(screen.getByTestId('amount-input'), '400');
    fireEvent.changeText(
      screen.getByTestId('iban-input'),
      'GB29NWBK60161331926819',
    );
    fireEvent.press(screen.getByTestId('confirm-button'));

    await waitFor(() => {
      expect(screen.getByText('Confirm Payout')).toBeTruthy();
    });

    fireEvent.press(screen.getByLabelText('Confirm payout'));

    await waitFor(
      () => {
        expect(screen.getByText('Payout Completed')).toBeTruthy();
      },
      { timeout: 10000 },
    );

    expect(screen.getByText('Payout')).toBeTruthy();
    expect(
      screen.getByText(
        'Your payout of £400.00 has been processed successfully.',
      ),
    ).toBeTruthy();
    expect(screen.getByText('Create Another Payout')).toBeTruthy();
  });

  it('returns to form when "Create Another Payout" is pressed', async () => {
    renderPayoutsScreen();

    // Complete a successful payout
    fireEvent.changeText(screen.getByTestId('amount-input'), '250');
    fireEvent.changeText(
      screen.getByTestId('iban-input'),
      'GB29NWBK60161331926819',
    );
    fireEvent.press(screen.getByTestId('confirm-button'));

    await waitFor(() => {
      expect(screen.getByText('Confirm Payout')).toBeTruthy();
    });

    fireEvent.press(screen.getByLabelText('Confirm payout'));

    await waitFor(
      () => {
        expect(screen.getByText('Payout Completed')).toBeTruthy();
      },
      { timeout: 10000 },
    );

    // Press "Create Another Payout"
    fireEvent.press(screen.getByText('Create Another Payout'));

    await waitFor(() => {
      expect(screen.getByText('Send Payout')).toBeTruthy();
    });

    // Form should be visible again with empty inputs
    expect(screen.getByTestId('amount-input')).toBeTruthy();
    expect(screen.getByTestId('iban-input')).toBeTruthy();
  });


  it('shows error result for insufficient funds (amount 888.88)', async () => {
    renderPayoutsScreen();

    // 888.88 → 88888 pence → MSW returns 400 Insufficient funds
    fireEvent.changeText(screen.getByTestId('amount-input'), '888.88');
    fireEvent.changeText(
      screen.getByTestId('iban-input'),
      'GB29NWBK60161331926819',
    );
    fireEvent.press(screen.getByTestId('confirm-button'));

    await waitFor(() => {
      expect(screen.getByText('Confirm Payout')).toBeTruthy();
    });

    fireEvent.press(screen.getByLabelText('Confirm payout'));

    await waitFor(
      () => {
        expect(screen.getByText('Unable to Process Payout')).toBeTruthy();
      },
      { timeout: 10000 },
    );

    expect(screen.getByText('Payout')).toBeTruthy();
    expect(screen.getByText('Try Again')).toBeTruthy();
  });


  it('shows error result for payout with failed status (amount 1.99)', async () => {
    renderPayoutsScreen();

    // 1.99 → 199 pence → 199 % 100 === 99 → MSW returns status: "failed"
    fireEvent.changeText(screen.getByTestId('amount-input'), '1.99');
    fireEvent.changeText(
      screen.getByTestId('iban-input'),
      'GB29NWBK60161331926819',
    );
    fireEvent.press(screen.getByTestId('confirm-button'));

    await waitFor(() => {
      expect(screen.getByText('Confirm Payout')).toBeTruthy();
    });

    fireEvent.press(screen.getByLabelText('Confirm payout'));

    await waitFor(
      () => {
        expect(screen.getByText('Unable to Process Payout')).toBeTruthy();
      },
      { timeout: 10000 },
    );

    expect(
      screen.getByText(
        'Service temporarily unavailable. Please try again later.',
      ),
    ).toBeTruthy();
    expect(screen.getByText('Try Again')).toBeTruthy();
  });


  it('resets error state when "Try Again" is pressed', async () => {
    renderPayoutsScreen();

    // Trigger an error
    fireEvent.changeText(screen.getByTestId('amount-input'), '888.88');
    fireEvent.changeText(
      screen.getByTestId('iban-input'),
      'GB29NWBK60161331926819',
    );
    fireEvent.press(screen.getByTestId('confirm-button'));

    await waitFor(() => {
      expect(screen.getByText('Confirm Payout')).toBeTruthy();
    });

    fireEvent.press(screen.getByLabelText('Confirm payout'));

    await waitFor(
      () => {
        expect(screen.getByText('Unable to Process Payout')).toBeTruthy();
      },
      { timeout: 10000 },
    );

    // Press "Try Again"
    fireEvent.press(screen.getByText('Try Again'));

    await waitFor(() => {
      expect(screen.getByText('Send Payout')).toBeTruthy();
    });

    // Form should be visible
    expect(screen.getByTestId('amount-input')).toBeTruthy();
  });

  it('shows error result for service unavailable (amount 999.99)', async () => {
    renderPayoutsScreen();

    // 999.99 → 99999 pence → MSW returns 503
    fireEvent.changeText(screen.getByTestId('amount-input'), '999.99');
    fireEvent.changeText(
      screen.getByTestId('iban-input'),
      'GB29NWBK60161331926819',
    );
    fireEvent.press(screen.getByTestId('confirm-button'));

    await waitFor(() => {
      expect(screen.getByText('Confirm Payout')).toBeTruthy();
    });

    fireEvent.press(screen.getByLabelText('Confirm payout'));

    await waitFor(
      () => {
        expect(screen.getByText('Unable to Process Payout')).toBeTruthy();
      },
      { timeout: 10000 },
    );

    expect(screen.getByText('Try Again')).toBeTruthy();
  });


  it('completes a payout with EUR currency', async () => {
    renderPayoutsScreen();

    // Change currency to EUR
    fireEvent.press(screen.getByTestId('currency-picker'));

    await waitFor(() => {
      expect(screen.getByText('Select Currency')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('currency-option-EUR'));

    // Fill form
    fireEvent.changeText(screen.getByTestId('amount-input'), '200');
    fireEvent.changeText(
      screen.getByTestId('iban-input'),
      'FR7630006000011234567890189',
    );
    fireEvent.press(screen.getByTestId('confirm-button'));

    await waitFor(() => {
      expect(screen.getByText('Confirm Payout')).toBeTruthy();
    });

    // Verify EUR in confirmation
    expect(screen.getByText('€200.00')).toBeTruthy();

    fireEvent.press(screen.getByLabelText('Confirm payout'));

    await waitFor(
      () => {
        expect(screen.getByText('Payout Completed')).toBeTruthy();
      },
      { timeout: 10000 },
    );

    expect(
      screen.getByText(
        'Your payout of €200.00 has been processed successfully.',
      ),
    ).toBeTruthy();
  });
});
