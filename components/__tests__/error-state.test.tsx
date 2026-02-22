import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ErrorState } from '../error-state';

describe('ErrorState', () => {
  const mockRetry = jest.fn();

  beforeEach(() => {
    mockRetry.mockClear();
  });

  it('renders the default error message', () => {
    render(<ErrorState onRetry={mockRetry} />);
    expect(
      screen.getByText('Something went wrong. Please try again.')
    ).toBeTruthy();
  });

  it('renders a custom error message when provided', () => {
    render(<ErrorState onRetry={mockRetry} message="Network unavailable" />);
    expect(screen.getByText('Network unavailable')).toBeTruthy();
    expect(
      screen.queryByText('Something went wrong. Please try again.')
    ).toBeNull();
  });

  it('renders a Retry button', () => {
    render(<ErrorState onRetry={mockRetry} />);
    expect(screen.getByText('Retry')).toBeTruthy();
    expect(screen.getByLabelText('Retry')).toBeTruthy();
  });

  it('calls onRetry when Retry is pressed', () => {
    render(<ErrorState onRetry={mockRetry} />);
    fireEvent.press(screen.getByText('Retry'));
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });
});
