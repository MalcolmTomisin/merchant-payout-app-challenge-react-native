import { renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCreatePayout } from '../use-create-payout';

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

describe('useCreatePayout', () => {
  it('starts in idle state', () => {
    const { result } = renderHook(() => useCreatePayout(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('successfully creates a payout', async () => {
    const { result } = renderHook(() => useCreatePayout(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      amount: 40000,
      currency: 'GBP',
      iban: 'GB29NWBK60161331926819',
    });

    await waitFor(
      () => {
        expect(result.current.isSuccess).toBe(true);
      },
      { timeout: 10000 },
    );

    expect(result.current.data?.status).toBe('completed');
    expect(result.current.data?.amount).toBe(40000);
    expect(result.current.data?.currency).toBe('GBP');
  });

  it('handles insufficient funds error', async () => {
    const { result } = renderHook(() => useCreatePayout(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      amount: 88888,
      currency: 'GBP',
      iban: 'GB29NWBK60161331926819',
    });

    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 10000 },
    );

    expect(result.current.error?.message).toContain('Insufficient funds');
  });

  it('handles service unavailable error', async () => {
    const { result } = renderHook(() => useCreatePayout(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      amount: 99999,
      currency: 'GBP',
      iban: 'GB29NWBK60161331926819',
    });

    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 10000 },
    );

    expect(result.current.error?.message).toContain(
      'Service temporarily unavailable',
    );
  });

  it('can be reset after error', async () => {
    const { result } = renderHook(() => useCreatePayout(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      amount: 88888,
      currency: 'GBP',
      iban: 'GB29NWBK60161331926819',
    });

    await waitFor(
      () => {
        expect(result.current.isError).toBe(true);
      },
      { timeout: 10000 },
    );

    result.current.reset();

    await waitFor(() => {
      expect(result.current.isIdle).toBe(true);
    });
  });
});
