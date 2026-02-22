import React from 'react';
import { waitFor, fireEvent } from '@testing-library/react-native';
import { renderRouter, screen } from 'expo-router/testing-library';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ModalScreen from '@/app/modal';
import { http, HttpResponse } from 'msw';
import { server } from '../../../mocks/server.test';
import { API_BASE_URL } from '@/constants';
import HomeScreen from '../index';

import type { MerchantDataResponse } from '@/types/api';

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

const mockMerchantData: MerchantDataResponse = {
  available_balance: 500000,
  pending_balance: 25000,
  currency: 'GBP',
  activity: [
    {
      id: 'act_001',
      type: 'deposit',
      amount: 150000,
      currency: 'GBP',
      date: '2026-02-20T14:00:00.000Z',
      description: 'Payment from Customer ABC',
      status: 'completed',
    },
    {
      id: 'act_002',
      type: 'payout',
      amount: -50000,
      currency: 'GBP',
      date: '2026-02-19T10:00:00.000Z',
      description: 'Payout to Bank ****1234',
      status: 'completed',
    },
    {
      id: 'act_003',
      type: 'deposit',
      amount: 230000,
      currency: 'GBP',
      date: '2026-02-18T08:00:00.000Z',
      description: 'Payment from Customer XYZ',
      status: 'completed',
    },
    {
      id: 'act_004',
      type: 'fee',
      amount: -2500,
      currency: 'GBP',
      date: '2026-02-17T12:00:00.000Z',
      description: 'Monthly service fee',
      status: 'completed',
    },
  ],
};

describe('HomeScreen', () => {
    const MockHomeScreen = jest.fn(() => <HomeScreen />);
    const MockModalScreen = jest.fn(() => <ModalScreen />);

  it('shows loading indicator initially', () => {
    
    // Use a handler that never resolves to keep loading state
    server.use(
      http.get(`${API_BASE_URL}/api/merchant`, () => {
        return new Promise(() => {}); // never resolves
      })
    );

    renderRouter({
        index: MockHomeScreen,
        'modal': MockModalScreen,
    }, {
        wrapper: createWrapper(),
    });
    expect(screen.getByTestId('loading-indicator')).toBeTruthy();
  });

  it('renders merchant data after loading', async () => {
    server.use(
      http.get(`${API_BASE_URL}/api/merchant`, () => {
        return HttpResponse.json(mockMerchantData);
      })
    );

    renderRouter({
        index: MockHomeScreen,
        'modal': MockModalScreen,
    }, {
        wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(screen.getByText('Business Account')).toBeTruthy();
    });

    // Balance card
    expect(screen.getByText('£5,000.00')).toBeTruthy();
    expect(screen.getByText('£250.00')).toBeTruthy();

    // Recent activity (only first 3)
    expect(screen.getByText('Payment from Customer ABC')).toBeTruthy();
    expect(screen.getByText('Payout to Bank ****1234')).toBeTruthy();
    expect(screen.getByText('Payment from Customer XYZ')).toBeTruthy();

    // 4th item should NOT be rendered
    expect(screen.queryByText('Monthly service fee')).toBeNull();
  });

  it('shows only 3 activity items', async () => {
    server.use(
      http.get(`${API_BASE_URL}/api/merchant`, () => {
        return HttpResponse.json(mockMerchantData);
      })
    );

    renderRouter({
        index: MockHomeScreen,
        'modal': MockModalScreen,
    }, {
        wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(screen.getByText('Payment from Customer ABC')).toBeTruthy();
    });

    // Verify exactly 3 activity items rendered
    expect(screen.getByText('Payment from Customer ABC')).toBeTruthy();
    expect(screen.getByText('Payout to Bank ****1234')).toBeTruthy();
    expect(screen.getByText('Payment from Customer XYZ')).toBeTruthy();
    expect(screen.queryByText('Monthly service fee')).toBeNull();
  });

  it('renders "Show More" button that navigates to modal', async () => {
    server.use(
      http.get(`${API_BASE_URL}/api/merchant`, () => {
        return HttpResponse.json(mockMerchantData);
      })
    );

    renderRouter({
        index: MockHomeScreen,
        'modal': MockModalScreen,
    }, {
        wrapper: createWrapper(),
    });

    expect(screen).toHavePathname('/');

    await waitFor(() => {
      expect(screen.getByText('Show More')).toBeTruthy();
    });

    fireEvent.press(screen.getByText('Show More'));
    expect(screen).toHavePathname('/modal');
  });

  it('shows error state with retry button on failure', async () => {
    server.use(
      http.get(`${API_BASE_URL}/api/merchant`, () => {
        return HttpResponse.json({ error: 'Server Error' }, { status: 500 });
      })
    );

    renderRouter({
        index: MockHomeScreen,
        'modal': MockModalScreen,
    }, {
        wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(screen.getByText('Something went wrong. Please try again.')).toBeTruthy();
    }, { timeout: 10000 });

    expect(screen.getByText('Retry')).toBeTruthy();
  });

  it('retry button re-fetches data', async () => {
    let callCount = 0;
    server.use(
      http.get(`${API_BASE_URL}/api/merchant`, () => {
        callCount++;
        // Fail the initial call AND the automatic retry (retry: 1)
        // Only succeed on the 3rd call (manual retry via button press)
        if (callCount <= 2) {
          return HttpResponse.json({ error: 'Server Error' }, { status: 500 });
        }
        return HttpResponse.json(mockMerchantData);
      })
    );

    renderRouter({
        index: MockHomeScreen,
        'modal': MockModalScreen,
    }, {
        wrapper: createWrapper(),
    });

    // Wait for error state (after initial call + 1 auto-retry both fail)
    await waitFor(() => {
      expect(screen.getByText('Retry')).toBeTruthy();
    }, { timeout: 10000 });

    fireEvent.press(screen.getByText('Retry'));

    await waitFor(() => {
      expect(screen.getByText('Business Account')).toBeTruthy();
    }, { timeout: 10000 });

    expect(screen.getByText('£5,000.00')).toBeTruthy();
  }, 30000);
});
