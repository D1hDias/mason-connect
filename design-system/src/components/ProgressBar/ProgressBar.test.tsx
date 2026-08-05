import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders label and value', () => {
    render(<ProgressBar label="Negócios fechados" value={9} percent={0.36} />);
    expect(screen.getByText('Negócios fechados')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
  });

  it('exposes the percentage to assistive tech', () => {
    render(<ProgressBar label="Negócios fechados" value={9} percent={0.36} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '36');
  });

  it('clamps out-of-range percentages', () => {
    render(<ProgressBar label="x" value={1} percent={1.5} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });
});
