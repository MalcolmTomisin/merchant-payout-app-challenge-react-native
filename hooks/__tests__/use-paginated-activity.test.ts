import { renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePaginatedActivity } from '../use-paginated-activity';
import { server } from '../../mocks/server.test';
import { http, HttpResponse } from 'msw';
import { API_BASE_URL } from '@/constants';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
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

describe('usePaginatedActivity', () => {
  it('starts in loading state', () => {
    server.use(
      http.get(`${API_BASE_URL}/api/merchant/activity`, () => {
        return new Promise(() => {}); // never resolves
      })
    );

    const { result } = renderHook(() => usePaginatedActivity(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('returns first page of activity data', async () => {
    const mockPage = {
      items: [
        {
          id: 'act_001',
          type: 'deposit',
          amount: 150000,
          currency: 'GBP',
          date: '2026-01-23T14:00:00.000Z',
          description: 'Payment from Customer ABC',
          status: 'completed',
        },
      ],
      next_cursor: 'act_001',
      has_more: true,
    };

    server.use(
      http.get(`${API_BASE_URL}/api/merchant/activity`, () => {
        return HttpResponse.json(mockPage);
      })
    );

    const { result } = renderHook(() => usePaginatedActivity(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    }, { timeout: 10000 });

    expect(result.current.data?.pages).toHaveLength(1);
    expect(result.current.data?.pages[0].items).toHaveLength(1);
    expect(result.current.hasNextPage).toBe(true);
  });

  it('returns error state on failure', async () => {
    server.use(
      http.get(`${API_BASE_URL}/api/merchant/activity`, () => {
        return HttpResponse.json({ error: 'Server Error' }, { status: 500 });
      })
    );

    const { result } = renderHook(() => usePaginatedActivity(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    }, { timeout: 10000 });

    expect(result.current.error).toBeDefined();
  });
});
