import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { Chip } from './Chip';

describe('Chip', () => {
  afterEach(() => {
    cleanup();
  });

  it.each([
    ['presente', 'Presente', 'bg-presence-presente-bg'],
    ['falta', 'Falta', 'bg-presence-falta-bg'],
    ['justificada', 'Justificada', 'bg-presence-justificada-bg'],
    ['representado', 'Representado', 'bg-presence-representado-bg'],
  ] as const)('renders %s state with correct label and classes', (estado, label, expectedBgClass) => {
    render(<Chip estado={estado} />);
    const chip = screen.getByText(label);
    expect(chip).toBeInTheDocument();
    expect(chip).toHaveClass(expectedBgClass);
  });

  it('applies text color classes for each state', () => {
    const testCases: Array<[typeof estado, string]> = [
      ['presente', 'text-presence-presente-fg'],
      ['falta', 'text-presence-falta-fg'],
      ['justificada', 'text-presence-justificada-fg'],
      ['representado', 'text-presence-representado-fg'],
    ];

    testCases.forEach(([estado, expectedFgClass]) => {
      const { unmount } = render(<Chip estado={estado} />);
      const chip = screen.getByText(/Presente|Falta|Justificada|Representado/);
      expect(chip).toHaveClass(expectedFgClass);
      unmount();
    });
  });
});
