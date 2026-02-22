import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { MerchantOverview } from '../merchant-overview';
import type { MerchantDataResponse } from '@/types/api';

const mockData: MerchantDataResponse = {
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

describe('MerchantOverview', () => {
  const mockShowMore = jest.fn();

  beforeEach(() => {
    mockShowMore.mockClear();
  });

  it('renders the Business Account title', () => {
    render(<MerchantOverview data={mockData} onShowMore={mockShowMore} />);
    expect(screen.getByText('Business Account')).toBeTruthy();
  });

  it('renders balance card with formatted amounts', () => {
    render(<MerchantOverview data={mockData} onShowMore={mockShowMore} />);
    expect(screen.getByText('£5,000.00')).toBeTruthy();
    expect(screen.getByText('£250.00')).toBeTruthy();
  });

  it('renders Recent Activity subtitle', () => {
    render(<MerchantOverview data={mockData} onShowMore={mockShowMore} />);
    expect(screen.getByText('Recent Activity')).toBeTruthy();
  });

  it('shows only the first 3 activity items', () => {
    render(<MerchantOverview data={mockData} onShowMore={mockShowMore} />);
    expect(screen.getByText('Payment from Customer ABC')).toBeTruthy();
    expect(screen.getByText('Payout to Bank ****1234')).toBeTruthy();
    expect(screen.getByText('Payment from Customer XYZ')).toBeTruthy();
    // 4th item should NOT appear
    expect(screen.queryByText('Monthly service fee')).toBeNull();
  });

  it('renders a Show More button', () => {
    render(<MerchantOverview data={mockData} onShowMore={mockShowMore} />);
    expect(screen.getByText('Show More')).toBeTruthy();
    expect(screen.getByLabelText('Show More')).toBeTruthy();
  });

  it('calls onShowMore when Show More is pressed', () => {
    render(<MerchantOverview data={mockData} onShowMore={mockShowMore} />);
    fireEvent.press(screen.getByText('Show More'));
    expect(mockShowMore).toHaveBeenCalledTimes(1);
  });
});
