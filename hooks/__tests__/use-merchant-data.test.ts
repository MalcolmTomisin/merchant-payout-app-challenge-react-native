import { renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server.test';
import { API_BASE_URL } from '@/constants';
import { useMerchantData } from '../use-merchant-data';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    );
  };
}

describe('useMerchantData', () => {
  it('starts in loading state', () => {
    const { result } = renderHook(() => useMerchantData(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('returns merchant data after loading', async () => {
    const { result } = renderHook(() => useMerchantData(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    }, { timeout: 10000 });

    expect(result.current.data).toBeDefined();
    expect(result.current.data!.available_balance).toBe(500000);
    expect(result.current.data!.pending_balance).toBe(25000);
    expect(result.current.data!.currency).toBe('GBP');
    expect(result.current.data!.activity.length).toBeGreaterThan(0);
  });

  it('handles fetch errors', async () => {
    // Override the MSW handler to return an error
    server.use(
      http.get(`${API_BASE_URL}/api/merchant`, () => {
        return HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 });
      })
    );

    const { result } = renderHook(() => useMerchantData(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    }, { timeout: 10000 });

    expect(result.current.error).toBeDefined();
  });
});
