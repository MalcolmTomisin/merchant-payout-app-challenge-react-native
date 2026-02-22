import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { ActivityRow } from '../activity-row';
import type { ActivityItem } from '@/types/api';

/** Recursively flatten RN style arrays into a single object (last value wins) */
function flattenStyles(style: any): Record<string, any> {
  if (!style) return {};
  if (Array.isArray(style)) {
    return style.reduce((acc, s) => ({ ...acc, ...flattenStyles(s) }), {});
  }
  if (typeof style === 'object') return { ...style };
  return {};
}

const mockDeposit: ActivityItem = {
  id: 'act_001',
  type: 'deposit',
  amount: 150000,
  currency: 'GBP',
  date: '2026-02-20T14:00:00.000Z',
  description: 'Payment from Customer ABC',
  status: 'completed',
};

const mockRefund: ActivityItem = {
  id: 'act_002',
  type: 'refund',
  amount: -50000,
  currency: 'GBP',
  date: '2026-02-19T10:00:00.000Z',
  description: 'Refund to Customer XYZ',
  status: 'completed',
};

const mockEurItem: ActivityItem = {
  id: 'act_003',
  type: 'deposit',
  amount: 100000,
  currency: 'EUR',
  date: '2026-02-18T08:00:00.000Z',
  description: 'Payment from Customer DEF',
  status: 'completed',
};

describe('ActivityRow', () => {
  it('renders description and formatted positive amount', () => {
    render(<ActivityRow item={mockDeposit} />);

    expect(screen.getByText('Payment from Customer ABC')).toBeTruthy();
    expect(screen.getByText('£1,500.00')).toBeTruthy();
  });

  it('renders negative amount for refunds', () => {
    render(<ActivityRow item={mockRefund} />);

    expect(screen.getByText('Refund to Customer XYZ')).toBeTruthy();
    expect(screen.getByText('-£500.00')).toBeTruthy();
  });

  it('shows green color for positive amounts', () => {
    render(<ActivityRow item={mockDeposit} />);

    const amountText = screen.getByText('£1,500.00');
    
    const flatStyle = flattenStyles(amountText.props.style);
    expect(flatStyle.color).toBe('#16a34a');
  });

  it('shows red color for negative amounts', () => {
    render(<ActivityRow item={mockRefund} />);

    const amountText = screen.getByText('-£500.00');
    const flatStyle = flattenStyles(amountText.props.style);
    expect(flatStyle.color).toBe('#dc2626');
  });

  it('renders EUR amounts correctly', () => {
    render(<ActivityRow item={mockEurItem} />);

    expect(screen.getByText('€1,000.00')).toBeTruthy();
  });

  it('provides accessibility label with description and amount', () => {
    render(<ActivityRow item={mockDeposit} />);

    expect(
      screen.getByLabelText('Payment from Customer ABC £1,500.00')
    ).toBeTruthy();
  });
});
