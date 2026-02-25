import { renderHook, waitFor, act } from '@testing-library/react-native';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePayoutFlow, type PendingPayout } from '../use-payout-flow';
import * as ScreenSecurity from '@/modules/screen-security';

jest.mock('@/modules/screen-security', () => ({
  getDeviceIdAsync: jest.fn().mockResolvedValue('mock-device-id'),
  isBiometricAuthenticatedAsync: jest.fn().mockResolvedValue(true),
}));

const mockedGetDeviceIdAsync = ScreenSecurity.getDeviceIdAsync as jest.Mock;
const mockedIsBiometricAuthenticated =
  (ScreenSecurity as any).isBiometricAuthenticatedAsync as jest.Mock;

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

const validPayout: PendingPayout = {
  amount: 40000,
  currency: 'GBP',
  iban: 'GB29NWBK60161331926819',
};

describe('usePayoutFlow', () => {
  beforeEach(() => {
    mockedGetDeviceIdAsync.mockClear();
    mockedGetDeviceIdAsync.mockResolvedValue('mock-device-id');
    mockedIsBiometricAuthenticated.mockClear();
    mockedIsBiometricAuthenticated.mockResolvedValue(true);
  });

  it('returns correct initial state', () => {
    const { result } = renderHook(() => usePayoutFlow(), {
      wrapper: createWrapper(),
    });

    expect(result.current.showConfirmation).toBe(false);
    expect(result.current.pendingPayout).toBeNull();
    expect(result.current.formKey).toBe(0);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.errorMessage).toBeUndefined();
    expect(result.current.title).toBe('Send Payout');
  });


  it('sets pendingPayout and shows confirmation on form submit', () => {
    const { result } = renderHook(() => usePayoutFlow(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.handleFormSubmit(validPayout);
    });

    expect(result.current.showConfirmation).toBe(true);
    expect(result.current.pendingPayout).toEqual(validPayout);
  });


  it('hides confirmation but keeps pendingPayout on cancel', () => {
    const { result } = renderHook(() => usePayoutFlow(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.handleFormSubmit(validPayout);
    });

    expect(result.current.showConfirmation).toBe(true);

    act(() => {
      result.current.handleCancelConfirmation();
    });

    expect(result.current.showConfirmation).toBe(false);
    expect(result.current.pendingPayout).toEqual(validPayout);
  });

  it('completes a payout successfully', async () => {
    const { result } = renderHook(() => usePayoutFlow(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.handleFormSubmit(validPayout);
    });

    await act(async () => {
      await result.current.handleConfirmPayout();
    });

    await waitFor(
      () => {
        expect(result.current.isSuccess).toBe(true);
      },
      { timeout: 10000 },
    );

    expect(result.current.isError).toBe(false);
    expect(result.current.showConfirmation).toBe(false);
    expect(result.current.title).toBe('Payout');
    expect(result.current.isSubmitting).toBe(false);
    expect(mockedGetDeviceIdAsync).toHaveBeenCalledTimes(1);
  });


  it('handles insufficient funds error (amount 88888)', async () => {
    const insufficientPayout: PendingPayout = {
      amount: 88888,
      currency: 'GBP',
      iban: 'GB29NWBK60161331926819',
    };

    const { result } = renderHook(() => usePayoutFlow(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.handleFormSubmit(insufficientPayout);
    });

    await act(async () => {
      try {
        await result.current.handleConfirmPayout();
      } catch {
        // mutateAsync throws on error — the hook catches via finally
      }
    });

    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 10000 },
    );

    expect(result.current.isSuccess).toBe(false);
    expect(result.current.errorMessage).toBeDefined();
    expect(result.current.title).toBe('Payout');
    expect(result.current.showConfirmation).toBe(false);
  });


  it('treats payout with failed status as error', async () => {
    const failedPayout: PendingPayout = {
      amount: 199, // MSW returns status "failed"
      currency: 'GBP',
      iban: 'GB29NWBK60161331926819',
    };

    const { result } = renderHook(() => usePayoutFlow(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.handleFormSubmit(failedPayout);
    });

    await act(async () => {
      await result.current.handleConfirmPayout();
    });

    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 10000 },
    );

    expect(result.current.isSuccess).toBe(false);
    expect(result.current.errorMessage).toBe(
      'Service temporarily unavailable. Please try again later.',
    );
    expect(result.current.title).toBe('Payout');
  });


  it('does nothing when confirming without a pending payout', async () => {
    const { result } = renderHook(() => usePayoutFlow(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.handleConfirmPayout();
    });

    expect(mockedGetDeviceIdAsync).not.toHaveBeenCalled();
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.isSubmitting).toBe(false);
  });


  it('resets mutation and increments formKey on create another', async () => {
    const { result } = renderHook(() => usePayoutFlow(), {
      wrapper: createWrapper(),
    });

    // Complete a successful payout first
    act(() => {
      result.current.handleFormSubmit(validPayout);
    });

    await act(async () => {
      await result.current.handleConfirmPayout();
    });

    await waitFor(
      () => {
        expect(result.current.isSuccess).toBe(true);
      },
      { timeout: 10000 },
    );

    const previousFormKey = result.current.formKey;

    act(() => {
      result.current.handleCreateAnother();
    });

    expect(result.current.formKey).toBe(previousFormKey + 1);
    expect(result.current.pendingPayout).toBeNull();
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.title).toBe('Send Payout');
  });


  it('resets mutation error state on try again', async () => {
    const insufficientPayout: PendingPayout = {
      amount: 88888,
      currency: 'GBP',
      iban: 'GB29NWBK60161331926819',
    };

    const { result } = renderHook(() => usePayoutFlow(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.handleFormSubmit(insufficientPayout);
    });

    await act(async () => {
      try {
        await result.current.handleConfirmPayout();
      } catch {
        // expected
      }
    });

    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 10000 },
    );

    act(() => {
      result.current.handleTryAgain();
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(false);
    });

    expect(result.current.isSuccess).toBe(false);
    expect(result.current.title).toBe('Send Payout');
    // pendingPayout should still be set (handleTryAgain does not clear it)
    expect(result.current.pendingPayout).toEqual(insufficientPayout);
  });

  it('isSubmitting is false before and after a payout completes', async () => {
    const { result } = renderHook(() => usePayoutFlow(), {
      wrapper: createWrapper(),
    });

    // Before any mutation, isSubmitting should be false
    expect(result.current.isSubmitting).toBe(false);

    act(() => {
      result.current.handleFormSubmit(validPayout);
    });

    await act(async () => {
      await result.current.handleConfirmPayout();
    });

    await waitFor(
      () => {
        expect(result.current.isSuccess).toBe(true);
      },
      { timeout: 10000 },
    );

    // After the mutation resolves, isSubmitting should return to false
    expect(result.current.isSubmitting).toBe(false);
  });

  it('passes device_id from ScreenSecurity to the mutation', async () => {
    mockedGetDeviceIdAsync.mockResolvedValue('test-device-123');

    const { result } = renderHook(() => usePayoutFlow(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.handleFormSubmit(validPayout);
    });

    await act(async () => {
      await result.current.handleConfirmPayout();
    });

    await waitFor(
      () => {
        expect(result.current.isSuccess).toBe(true);
      },
      { timeout: 10000 },
    );

    expect(mockedGetDeviceIdAsync).toHaveBeenCalledTimes(1);
  });

  it('skips biometric check for payouts at or below threshold', async () => {
    const belowThresholdPayout: PendingPayout = {
      amount: 100000, // exactly 1,000.00 — not "over"
      currency: 'GBP',
      iban: 'GB29NWBK60161331926819',
    };

    const { result } = renderHook(() => usePayoutFlow(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.handleFormSubmit(belowThresholdPayout);
    });

    await act(async () => {
      await result.current.handleConfirmPayout();
    });

    await waitFor(
      () => {
        expect(result.current.isSuccess).toBe(true);
      },
      { timeout: 10000 },
    );

    expect(mockedIsBiometricAuthenticated).not.toHaveBeenCalled();
    expect(mockedGetDeviceIdAsync).toHaveBeenCalledTimes(1);
  });

  it('triggers biometric check for payouts over threshold and proceeds on success', async () => {
    const highValuePayout: PendingPayout = {
      amount: 100001, // over 1,000.00
      currency: 'GBP',
      iban: 'GB29NWBK60161331926819',
    };

    mockedIsBiometricAuthenticated.mockResolvedValue(true);

    const { result } = renderHook(() => usePayoutFlow(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.handleFormSubmit(highValuePayout);
    });

    await act(async () => {
      await result.current.handleConfirmPayout();
    });

    await waitFor(
      () => {
        expect(result.current.isSuccess).toBe(true);
      },
      { timeout: 10000 },
    );

    expect(mockedIsBiometricAuthenticated).toHaveBeenCalledTimes(1);
    expect(mockedGetDeviceIdAsync).toHaveBeenCalledTimes(1);
  });

  it('shows error when biometric authentication is cancelled', async () => {
    const highValuePayout: PendingPayout = {
      amount: 200000,
      currency: 'GBP',
      iban: 'GB29NWBK60161331926819',
    };

    mockedIsBiometricAuthenticated.mockRejectedValue(
      new Error('Biometric authentication was cancelled.'),
    );

    const { result } = renderHook(() => usePayoutFlow(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.handleFormSubmit(highValuePayout);
    });

    await act(async () => {
      await result.current.handleConfirmPayout();
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.errorMessage).toBe(
      'Biometric authentication was cancelled.',
    );
    expect(result.current.showConfirmation).toBe(false);
    expect(result.current.title).toBe('Payout');
    // API call should NOT have been made
    expect(mockedGetDeviceIdAsync).not.toHaveBeenCalled();
  });

  it('shows error when biometrics are not enrolled', async () => {
    const highValuePayout: PendingPayout = {
      amount: 150000,
      currency: 'EUR',
      iban: 'FR1212345123451234567A12310131231231231',
    };

    mockedIsBiometricAuthenticated.mockRejectedValue(
      new Error(
        'Biometric authentication is not set up. Please enable it in Settings.',
      ),
    );

    const { result } = renderHook(() => usePayoutFlow(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.handleFormSubmit(highValuePayout);
    });

    await act(async () => {
      await result.current.handleConfirmPayout();
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.errorMessage).toBe(
      'Biometric authentication is not set up. Please enable it in Settings.',
    );
    expect(mockedGetDeviceIdAsync).not.toHaveBeenCalled();
  });

  it('clears biometric error on try again', async () => {
    const highValuePayout: PendingPayout = {
      amount: 200000,
      currency: 'GBP',
      iban: 'GB29NWBK60161331926819',
    };

    mockedIsBiometricAuthenticated.mockRejectedValue(
      new Error('Biometric authentication was cancelled.'),
    );

    const { result } = renderHook(() => usePayoutFlow(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.handleFormSubmit(highValuePayout);
    });

    await act(async () => {
      await result.current.handleConfirmPayout();
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.errorMessage).toBe(
      'Biometric authentication was cancelled.',
    );

    act(() => {
      result.current.handleTryAgain();
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(false);
    });

    expect(result.current.errorMessage).toBeUndefined();
    expect(result.current.title).toBe('Send Payout');
  });

  it('aborts payout when biometric returns false', async () => {
    const highValuePayout: PendingPayout = {
      amount: 200000,
      currency: 'GBP',
      iban: 'GB29NWBK60161331926819',
    };

    mockedIsBiometricAuthenticated.mockResolvedValue(false);

    const { result } = renderHook(() => usePayoutFlow(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.handleFormSubmit(highValuePayout);
    });

    await act(async () => {
      await result.current.handleConfirmPayout();
    });

    expect(result.current.isError).toBe(true);
    expect(result.current.errorMessage).toBe(
      'Biometric authentication failed. Please try again.',
    );
    expect(mockedGetDeviceIdAsync).not.toHaveBeenCalled();
  });
});
