import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { Stat } from './Stat';

describe('Stat', () => {
  afterEach(() => {
    cleanup();
  });
  it('renders label and value', () => {
    render(<Stat label="Presença média" value="87%" />);
    expect(screen.getByText('Presença média')).toBeInTheDocument();
    expect(screen.getByText('87%')).toBeInTheDocument();
  });

  it('renders the hint when provided', () => {
    render(<Stat label="x" value="1" hint="últimos 90 dias" />);
    expect(screen.getByText('últimos 90 dias')).toBeInTheDocument();
  });

  it('applies the tone color class to the value', () => {
    render(<Stat label="x" value="87%" tone="success" />);
    expect(screen.getByText('87%')).toHaveClass('text-status-success-fg');
  });
});
