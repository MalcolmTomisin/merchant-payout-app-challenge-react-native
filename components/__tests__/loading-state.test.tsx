import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { LoadingState } from '../loading-state';


describe('LoadingState', () => {
  it('renders an activity indicator with default testID', () => {
    render(<LoadingState />);
    expect(screen.getByTestId('loading-indicator')).toBeTruthy();
  });

  it('accepts a custom testID', () => {
    render(<LoadingState testID="custom-loader" />);
    expect(screen.getByTestId('custom-loader')).toBeTruthy();
    expect(screen.queryByTestId('loading-indicator')).toBeNull();
  });

  it('does not render a message by default', () => {
    render(<LoadingState />);
    // Only the spinner, no text
    expect(screen.queryByText(/.+/)).toBeNull();
  });

  it('renders an optional message below the spinner', () => {
    render(<LoadingState message="Fetching data…" />);
    expect(screen.getByText('Fetching data…')).toBeTruthy();
  });
});
