import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { TransactionRow } from '../transaction-row';
import type { ActivityItem } from '@/types/api';


const depositItem: ActivityItem = {
  id: 'act_001',
  type: 'deposit',
  amount: 72738,
  currency: 'GBP',
  date: '2026-01-23T14:00:00.000Z',
  description: 'Payment from Customer MYK',
  status: 'completed',
};

const payoutItem: ActivityItem = {
  id: 'act_002',
  type: 'payout',
  amount: -187515,
  currency: 'GBP',
  date: '2026-01-23T10:00:00.000Z',
  description: 'Payout to Bank Account ****0117',
  status: 'completed',
};

describe('TransactionRow', () => {
  it('renders the capitalised type', () => {
    render(<TransactionRow item={depositItem} />);
    expect(screen.getByText('Deposit')).toBeTruthy();
  });

  it('renders the description', () => {
    render(<TransactionRow item={depositItem} />);
    expect(screen.getByText('Payment from Customer MYK')).toBeTruthy();
  });

  it('renders the formatted date as DD Mon YYYY', () => {
    render(<TransactionRow item={depositItem} />);
    expect(screen.getByText('23 Jan 2026')).toBeTruthy();
  });

  it('renders the formatted amount', () => {
    render(<TransactionRow item={depositItem} />);
    expect(screen.getByText('£727.38')).toBeTruthy();
  });

  it('renders the capitalised status', () => {
    render(<TransactionRow item={depositItem} />);
    expect(screen.getByText('Completed')).toBeTruthy();
  });

  it('renders negative amounts for payouts', () => {
    render(<TransactionRow item={payoutItem} />);
    expect(screen.getByText('Payout')).toBeTruthy();
    expect(screen.getByText('-£1,875.15')).toBeTruthy();
  });

  it('provides an accessible label with all details', () => {
    render(<TransactionRow item={depositItem} />);
    expect(
      screen.getByLabelText('Deposit Payment from Customer MYK £727.38 23 Jan 2026')
    ).toBeTruthy();
  });
});
