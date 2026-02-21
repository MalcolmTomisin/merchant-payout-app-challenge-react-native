import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { BalanceCard } from '../balance-card';


describe('BalanceCard', () => {
  it('renders available and pending balance labels', () => {
    render(
      <BalanceCard
        availableBalance={500000}
        pendingBalance={25000}
        currency="GBP"
      />
    );

    expect(screen.getByText('Available')).toBeTruthy();
    expect(screen.getByText('Pending')).toBeTruthy();
  });

  it('renders formatted GBP balances', () => {
    render(
      <BalanceCard
        availableBalance={500000}
        pendingBalance={25000}
        currency="GBP"
      />
    );

    expect(screen.getByText('£5,000.00')).toBeTruthy();
    expect(screen.getByText('£250.00')).toBeTruthy();
  });

  it('renders formatted EUR balances', () => {
    render(
      <BalanceCard
        availableBalance={100000}
        pendingBalance={5000}
        currency="EUR"
      />
    );

    expect(screen.getByText('€1,000.00')).toBeTruthy();
    expect(screen.getByText('€50.00')).toBeTruthy();
  });

  it('renders the Account Balance subtitle', () => {
    render(
      <BalanceCard
        availableBalance={500000}
        pendingBalance={25000}
        currency="GBP"
      />
    );

    expect(screen.getByText('Account Balance')).toBeTruthy();
  });

  it('provides accessibility labels for balances', () => {
    render(
      <BalanceCard
        availableBalance={500000}
        pendingBalance={25000}
        currency="GBP"
      />
    );

    expect(screen.getByLabelText('Available balance £5,000.00')).toBeTruthy();
    expect(screen.getByLabelText('Pending balance £250.00')).toBeTruthy();
  });
});
