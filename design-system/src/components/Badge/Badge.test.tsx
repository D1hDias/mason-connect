import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders its label', () => {
    render(<Badge variant="success">Ativo</Badge>);
    expect(screen.getByText('Ativo')).toBeInTheDocument();
  });

  it.each([
    ['success', 'bg-status-success-bg'],
    ['warning', 'bg-status-warning-bg'],
    ['critical', 'bg-status-critical-bg'],
    ['neutral', 'bg-status-neutral-bg'],
    ['accent', 'bg-status-accent-bg'],
  ] as const)('applies %s variant classes', (variant, expectedClass) => {
    render(<Badge variant={variant}>x</Badge>);
    expect(screen.getByText('x')).toHaveClass(expectedClass);
  });
});
